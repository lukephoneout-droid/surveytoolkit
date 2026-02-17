"use server"

import { auth } from "@/auth"
import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const JobSchema = z.object({
    jobType: z.enum(["SURVEY", "VALUATION", "DEVELOPMENT"]),
    addressLine1: z.string().min(1, "Address is required"),
    town: z.string().optional(),
    postcode: z.string().min(1, "Postcode is required"),
    clientName: z.string().optional(),
})

export async function createJob(data: z.infer<typeof JobSchema>) {
    const session = await auth()

    if (!session?.user?.orgId || !session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const { jobType, addressLine1, town, postcode, clientName } = JobSchema.parse(data)

    const job = await db.job.create({
        data: {
            orgId: session.user.orgId,
            createdByUserId: session.user.id,
            jobType,
            addressLine1,
            town,
            postcode,
            clientName,
            status: "NOT_STARTED",
        },
    })

    revalidatePath("/jobs")
    return job
}

export async function getJobs() {
    const session = await auth()

    if (!session?.user?.orgId) {
        return []
    }

    return db.job.findMany({
        where: {
            orgId: session.user.orgId,
        },
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getDashboardStats() {
    const session = await auth()

    if (!session?.user?.orgId) {
        return {
            activeJobs: 0,
            completedJobs: 0,
            totalJobs: 0,
            recentJobs: [],
        }
    }

    const [activeJobs, completedJobs, totalJobs] = await Promise.all([
        db.job.count({ where: { orgId: session.user.orgId, status: "IN_PROGRESS" } }),
        db.job.count({ where: { orgId: session.user.orgId, status: "COMPLETE" } }),
        db.job.count({ where: { orgId: session.user.orgId } }),
    ])

    const recentJobs = await db.job.findMany({
        where: { orgId: session.user.orgId },
        orderBy: { createdAt: "desc" },
        take: 5,
    })

    return {
        activeJobs,
        completedJobs,
        totalJobs,
        recentJobs,
    }
}

export async function getSources() {
    return await db.source.findMany({
        orderBy: { name: "asc" }
    })
}

export async function getPortalConfigs() {
    const session = await auth()
    if (!session?.user?.orgId) return []

    return await db.portalConfig.findMany({
        where: { orgId: session.user.orgId }
    })
}

export async function geocodeJobPostcode(jobId: string) {
    const session = await auth()
    if (!session?.user?.orgId) throw new Error("Unauthorized")

    const job = await db.job.findUnique({
        where: { id: jobId, orgId: session.user.orgId }
    })

    if (!job || !job.postcode) throw new Error("Job not found or missing postcode")

    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(job.postcode)}`)
    const data = await res.json()

    if (data.status !== 200) throw new Error("Invalid postcode")

    const { latitude, longitude, postcode } = data.result

    return await db.job.update({
        where: { id: jobId },
        data: {
            lat: latitude,
            lon: longitude,
            postcodeNormalised: postcode.replace(/\s/g, "").toUpperCase(),
            geocodeSource: "postcodes.io",
            geocodedAt: new Date()
        }
    })
}

export async function runEPCCheck(jobId: string) {
    const session = await auth()
    if (!session?.user?.orgId) throw new Error("Unauthorized")

    const job = await db.job.findUnique({
        where: { id: jobId, orgId: session.user.orgId }
    })

    if (!job || !job.postcode) throw new Error("Postcode required for EPC check")

    const username = process.env.EPC_API_USERNAME
    const apiKey = process.env.EPC_API_KEY

    if (!username || !apiKey) {
        throw new Error("EPC API credentials missing (ENV)")
    }

    const authHeader = Buffer.from(`${username}:${apiKey}`).toString('base64')
    const res = await fetch(`https://epc.opendatacommunities.org/api/v1/domestic/search?postcode=${encodeURIComponent(job.postcode)}`, {
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Accept': 'application/json'
        }
    })

    if (!res.ok) throw new Error(`EPC API error: ${res.statusText}`)

    const data = await res.json()
    return data.rows || []
}

export async function selectEPCCertificate(jobId: string, certData: any) {
    const session = await auth()
    if (!session?.user?.orgId) throw new Error("Unauthorized")

    return await db.jobFinding.upsert({
        where: {
            jobId_sourceSlug: {
                jobId,
                sourceSlug: "EPC_OPEN_DATA_API"
            }
        },
        update: {
            status: "COMPLETE",
            structuredJson: certData,
            executedAt: new Date()
        },
        create: {
            jobId,
            sourceSlug: "EPC_OPEN_DATA_API",
            status: "COMPLETE",
            structuredJson: certData
        }
    })
}

export async function runCrimeSummary(jobId: string) {
    const session = await auth()
    if (!session?.user?.orgId) throw new Error("Unauthorized")

    const job = await db.job.findUnique({
        where: { id: jobId, orgId: session.user.orgId }
    })

    if (!job || !job.lat || !job.lon) {
        throw new Error("Job must be geocoded before running crime summary")
    }

    const res = await fetch(`https://data.police.uk/api/crimes-at-location?lat=${job.lat}&lng=${job.lon}`)
    if (!res.ok) throw new Error("Police.uk API error")

    const crimes = await res.json()

    // Aggregate data
    const total_crimes = crimes.length
    const categories: Record<string, number> = {}
    crimes.forEach((c: any) => {
        categories[c.category] = (categories[c.category] || 0) + 1
    })

    const top_categories = Object.entries(categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }))

    const result = {
        period: "Latest available month",
        total_crimes,
        top_categories,
        disclaimer: "Area-based anonymised data; not property-specific."
    }

    return await db.jobFinding.upsert({
        where: {
            jobId_sourceSlug: {
                jobId,
                sourceSlug: "POLICE_CRIME"
            }
        },
        update: {
            status: "COMPLETE",
            structuredJson: result as any,
            executedAt: new Date()
        },
        create: {
            jobId,
            sourceSlug: "POLICE_CRIME",
            status: "COMPLETE",
            structuredJson: result as any
        }
    })
}
