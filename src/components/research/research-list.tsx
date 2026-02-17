"use client"

import { useState } from "react"
import { geocodeJobPostcode, runEPCCheck, selectEPCCertificate, runCrimeSummary } from "@/actions/job-actions"
import { toast } from "sonner"
import { Source, PortalConfig, SourceCategory, SourceMode } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, Fingerprint, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResearchListProps {
    jobId?: string
    sources: Source[]
    portals: PortalConfig[]
}

const SECTION_MAP: Record<string, SourceCategory[]> = {
    "Core Automation": [SourceCategory.AUTHORITATIVE, SourceCategory.DATASET],
    "Planning & Constraints": [SourceCategory.LOCAL_GIS],
    "Environmental & Ground": [SourceCategory.INDICATIVE, SourceCategory.REFERENCE],
    "Infrastructure & Location": [SourceCategory.REFERENCE],
    "Compliance & Certificates": [SourceCategory.AUTHORITATIVE],
    "Visual Context": [SourceCategory.REFERENCE],
    "Reference Library": [SourceCategory.REFERENCE],
}

// Custom grouping logic based on Source names if Category is too broad
const CUSTOM_GROUPING: Record<string, string> = {
    "RADON_UK": "Environmental & Ground",
    "BGS_GEOLOGY": "Environmental & Ground",
    "MAGIC_DESIGNATIONS": "Environmental & Ground",
    "COAL_AUTHORITY_DATAMINE": "Environmental & Ground",
    "NBN_ATLAS": "Environmental & Ground",
    "OPENINFRAMAP": "Infrastructure & Location",
    "ONSHORE_OIL_GAS": "Infrastructure & Location",
    "NOISE_AIR_VIEWER": "Infrastructure & Location",
    "GAS_SAFE_RECORDS": "Compliance & Certificates",
    "FENSA_CERT_CHECK": "Compliance & Certificates",
    "LSBUD": "Compliance & Certificates",
    "NLS_HISTORIC_MAPS": "Visual Context",
    "SATELLITES_PRO": "Visual Context",
    "UK_AERIAL_PHOTOS": "Visual Context",
    "INNS_MAPPER": "Environmental & Ground",
    "NNSS_ID_SHEETS": "Environmental & Ground",
    "ENVIRONET_KNOTWEED_HEATMAP": "Environmental & Ground",
    "GOV_UK_EMF": "Reference Library",
    "HERITAGE_GATEWAY": "Reference Library",
}

export function ResearchList({ jobId, sources, portals }: ResearchListProps) {
    const [loading, setLoading] = useState<string | null>(null)
    const [epcRecords, setEpcRecords] = useState<any[] | null>(null)

    const handleGeocode = async () => {
        if (!jobId) return
        setLoading("geocode")
        try {
            await geocodeJobPostcode(jobId)
            toast.success("Position recorded")
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(null)
        }
    }

    const handleEPCCheck = async () => {
        if (!jobId) return
        setLoading("EPC_OPEN_DATA_API")
        try {
            const records = await runEPCCheck(jobId)
            if (records.length === 0) {
                toast.info("No EPC records found for this postcode")
            } else {
                setEpcRecords(records)
            }
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(null)
        }
    }

    const handleCrimeCheck = async () => {
        if (!jobId) return
        setLoading("POLICE_CRIME")
        try {
            await runCrimeSummary(jobId)
            toast.success("Crime summary aggregated")
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(null)
        }
    }

    const handleSelectEPC = async (record: any) => {
        if (!jobId) return
        try {
            await selectEPCCertificate(jobId, record)
            toast.success("Certificate selection saved")
            setEpcRecords(null)
        } catch (e: any) {
            toast.error(e.message)
        }
    }

    const sections = [
        "Core Automation",
        "Planning & Constraints",
        "Environmental & Ground",
        "Infrastructure & Location",
        "Compliance & Certificates",
        "Market & Valuation",
        "Visual Context",
        "Reference Library",
    ]

    const getSectionForSource = (source: Source) => {
        if (CUSTOM_GROUPING[source.slug]) return CUSTOM_GROUPING[source.slug]
        if (source.category === SourceCategory.AUTHORITATIVE || source.category === SourceCategory.DATASET) return "Core Automation"
        return "Reference Library"
    }

    return (
        <div className="space-y-8">
            {sections.map(section => {
                const sectionSources = sources.filter(s => getSectionForSource(s) === section)
                const sectionPortals = section === "Planning & Constraints" ? portals : []

                if (sectionSources.length === 0 && sectionPortals.length === 0) return null

                return (
                    <div key={section} className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/40" />
                            {section}
                        </h3>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {sectionPortals.map(portal => (
                                <div key={portal.id} className="p-4 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all group border-primary/20 bg-primary/5">
                                    <div className="flex flex-col h-full justify-between gap-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-primary uppercase">Local Portal</span>
                                                <Badge variant="outline" className="text-[9px] h-4">ASSISTED</Badge>
                                            </div>
                                            <h4 className="font-semibold text-sm leading-tight line-clamp-2">{portal.label}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">{portal.authorityName}</p>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full text-xs h-8"
                                            onClick={() => window.open(portal.url, '_blank')}
                                        >
                                            <ExternalLink className="mr-2 h-3 w-3" />
                                            Open Portal
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {sectionSources.map(source => (
                                <div key={source.id} className="p-4 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex flex-col h-full justify-between gap-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary" className="text-[9px] h-4 uppercase tracking-tighter">
                                                    {source.mode}
                                                </Badge>
                                                <Badge variant="outline" className="text-[9px] h-4 uppercase tracking-tighter">
                                                    {source.category}
                                                </Badge>
                                            </div>

                                            <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                                                {source.name}
                                            </h4>

                                            {/* UI Rules */}
                                            <div className="space-y-1.5">
                                                {source.category === SourceCategory.INDICATIVE && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 p-1.5 rounded-md border border-amber-100 italic">
                                                        <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                                                        Indicative only — not authoritative.
                                                    </div>
                                                )}

                                                {source.mode === SourceMode.ASSISTED && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-blue-600 bg-blue-50 p-1.5 rounded-md border border-blue-100 font-medium">
                                                        <Info className="h-3 w-3 flex-shrink-0" />
                                                        Open in new tab, then upload evidence.
                                                    </div>
                                                )}

                                                {source.slug === "GOV_UK_FLOOD_LONG_TERM" && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-primary bg-primary/5 p-1.5 rounded-md border border-primary/10 font-bold">
                                                        <Fingerprint className="h-3 w-3 flex-shrink-0" />
                                                        Captcha required — manual step.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-xs h-8 group-hover:bg-primary group-hover:text-white transition-all border border-transparent group-hover:border-primary"
                                                onClick={() => window.open(source.url, '_blank')}
                                            >
                                                <ExternalLink className="mr-2 h-3 w-3" />
                                                Launch Source
                                            </Button>

                                            {jobId && source.slug === "EPC_OPEN_DATA_API" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-xs h-8 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                                                    disabled={loading === source.slug}
                                                    onClick={handleEPCCheck}
                                                >
                                                    {loading === source.slug ? "Checking..." : "Run EPC Check"}
                                                </Button>
                                            )}

                                            {jobId && source.slug === "POLICE_CRIME" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-xs h-8 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800"
                                                    disabled={loading === source.slug}
                                                    onClick={handleCrimeCheck}
                                                >
                                                    {loading === source.slug ? "Running..." : "Run Crime Summary"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}

            {/* EPC Record Selector */}
            {epcRecords && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-background border rounded-xl shadow-xl w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Select Correct EPC Record</h3>
                            <Button variant="ghost" size="sm" onClick={() => setEpcRecords(null)}>Cancel</Button>
                        </div>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {epcRecords.map((record, i) => (
                                <div
                                    key={i}
                                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => handleSelectEPC(record)}
                                >
                                    <div className="font-medium text-sm">{record.address}</div>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px]">{record['current-energy-rating']}</Badge>
                                        <span className="text-xs text-muted-foreground">{record['inspection-date']}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
