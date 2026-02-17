import { auth } from "@/auth"
import db from "@/lib/db"
import { notFound } from "next/navigation"
import { getSources, getPortalConfigs } from "@/actions/job-actions"
import { ResearchList } from "@/components/research/research-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, User, Building, Landmark } from "lucide-react"
import Link from "next/link"
import { GeocodeButton } from "@/components/jobs/geocode-button"

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user?.orgId) return null

    const job = await db.job.findUnique({
        where: { id: params.id, orgId: session.user.orgId },
        include: { findings: true }
    })

    if (!job) notFound()

    const sources = await getSources()
    const portals = await getPortalConfigs()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card border rounded-xl shadow-sm">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">{job.addressLine1}</h1>
                        <Badge variant="outline" className="uppercase text-[10px] font-bold">
                            {job.jobType}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.postcode}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {job.createdAt.toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <GeocodeButton jobId={job.id} isGeocoded={!!job.lat} />
                    <Button variant="default" size="sm" asChild>
                        <Link href="/jobs">Back to Jobs</Link>
                    </Button>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 bg-card border rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-primary" />
                            Research & Evidence
                        </h2>
                        <ResearchList jobId={job.id} sources={sources} portals={portals} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-card border rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Job Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge>{job.status.replace("_", " ")}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Geocoded</span>
                                <span className={job.lat ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                                    {job.lat ? "YES" : "NO"}
                                </span>
                            </div>
                            {job.lat && (
                                <div className="pt-2 border-t text-[10px] text-muted-foreground">
                                    <p>Lat: {job.lat.toFixed(6)}</p>
                                    <p>Lon: {job.lon.toFixed(6)}</p>
                                    <p>Source: {job.geocodeSource}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
