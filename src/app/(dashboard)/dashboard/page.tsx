export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back to your survey research command center.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Active Jobs", value: "12", trend: "+2 this week" },
                    { label: "Pending Vault Items", value: "48", trend: "+12 today" },
                    { label: "Completed Surveys", value: "156", trend: "Target: 200" },
                    { label: "Organisation Users", value: "6", trend: "MEMBER" },
                ].map((stat) => (
                    <div key={stat.label} className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all hover:lift">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-primary mt-1">{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Recent Jobs</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">123 Example Street, London</span>
                                    <span className="text-xs text-muted-foreground uppercase">Survey • Valuation</span>
                                </div>
                                <div className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                                    In Progress
                                </div>
                            </div>
                        ))}
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
