"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { geocodeJobPostcode } from "@/actions/job-actions"
import { toast } from "sonner"
import { MapPin } from "lucide-react"

export function GeocodeButton({ jobId, isGeocoded }: { jobId: string; isGeocoded: boolean }) {
    const [loading, setLoading] = useState(false)

    const handleGeocode = async () => {
        setLoading(true)
        try {
            await geocodeJobPostcode(jobId)
            toast.success("Postcode geocoded successfully!")
            window.location.reload() // Refresh to show new lat/lon
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant={isGeocoded ? "outline" : "default"}
            size="sm"
            onClick={handleGeocode}
            disabled={loading}
            className={!isGeocoded ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
        >
            <MapPin className="mr-2 h-4 w-4" />
            {loading ? "Geocoding..." : isGeocoded ? "Update Geocode" : "Geocode Postcode"}
        </Button>
    )
}
