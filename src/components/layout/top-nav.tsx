import { auth } from "@/auth"
import { Search } from "lucide-react"

export async function TopNav() {
    const session = await auth()

    return (
        <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96 max-w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search jobs, addresses, or files..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-2">
                    <span className="text-sm font-medium">{session?.user?.name}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">{session?.user?.role}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border text-secondary-foreground font-medium">
                    {session?.user?.name?.charAt(0) || "U"}
                </div>
            </div>
        </header>
    )
}
