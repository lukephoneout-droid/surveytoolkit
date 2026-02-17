import { getSources, getPortalConfigs } from "@/actions/job-actions"
import { ResearchList } from "@/components/research/research-list"

export default async function ResearchPage() {
    const sources = await getSources()
    const portals = await getPortalConfigs()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Source Catalog</h1>
                <p className="text-muted-foreground mt-1">
                    Authoritative data sources and local authority portals for your survey research.
                </p>
            </div>

            <ResearchList sources={sources} portals={portals} />
        </div>
    )
}
