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
