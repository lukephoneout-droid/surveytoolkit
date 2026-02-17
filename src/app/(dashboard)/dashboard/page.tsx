import { getDashboardStats } from "@/actions/job-actions"
import { Badge } from "@/components/ui/badge"
import { Briefcase, FileText, CheckCircle, Users } from "lucide-react"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    const statCards = [
        { label: "Active Jobs", value: stats.activeJobs, trend: "In Progress", icon: Briefcase },
        { label: "Completed", value: stats.completedJobs, trend: "Total finished", icon: CheckCircle },
        { label: "Total Research", value: stats.totalJobs, trend: "Cumulative", icon: FileText },
        { label: "Team Members", value: "1", trend: "Active", icon: Users },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back to your survey research command center.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all hover:lift">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <stat.icon className="h-4 w-4 text-primary opacity-70" />
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-primary mt-1">{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Recent Jobs</h2>
                    <div className="space-y-4">
                        {stats.recentJobs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No recent activity. Create your first job!
                            </div>
                        ) : (
                            stats.recentJobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{job.addressLine1}</span>
                                        <span className="text-xs text-muted-foreground uppercase">{job.jobType}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                                        {job.status.replace("_", " ")}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            "Launch Research",
                            "Upload Evidence",
                            "Generate Report",
                            "Portal Config"
                        ].map(action => (
                            <button key={action} className="p-4 bg-secondary/50 text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors text-center">
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
