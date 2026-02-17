import { auth } from "@/auth"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"

export default async function DashboardShell({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <div className="flex h-screen bg-background overflow-hidden font-geist">
            <Sidebar role={session?.user?.role} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
