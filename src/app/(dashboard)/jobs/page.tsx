import { getJobs } from "@/actions/job-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateJobDialog } from "@/components/jobs/create-job-dialog"

// Category Colors from globals.css
const categoryColors: Record<string, string> = {
  SURVEY: "bg-[var(--cat-authoritative)] text-white hover:bg-[var(--cat-authoritative)]/80",
  VALUATION: "bg-[var(--cat-dataset)] text-white hover:bg-[var(--cat-dataset)]/80",
  DEVELOPMENT: "bg-[var(--cat-local-gis)] text-white hover:bg-[var(--cat-local-gis)]/80",
}

const statusColors: Record<string, string> = {
  COMPLETE: "bg-[var(--status-complete)] text-white border-none",
  IN_PROGRESS: "bg-[var(--status-in-progress)] text-white border-none",
  NOT_STARTED: "bg-[var(--status-not-started)] text-white border-none",
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage and track your active research jobs.</p>
        </div>
        <CreateJobDialog />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Filter jobs by address or client..."
            className="w-full pl-10 pr-4 py-2 bg-card border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Address</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Briefcase className="h-8 w-8 opacity-20" />
                    <p>No jobs found. Create your first job to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{job.addressLine1}</span>
                      <span className="text-xs text-muted-foreground">{job.town} {job.postcode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={categoryColors[job.jobType] || ""}>
                      {job.jobType}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.clientName || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[job.status] || ""}>
                      {job.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {job.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
