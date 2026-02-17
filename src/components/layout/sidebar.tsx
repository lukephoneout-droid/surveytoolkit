"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Briefcase,
    Database,
    Settings,
    ShieldCheck,
    PlusCircle
} from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Evidence Vault", href: "/vault", icon: Database },
    { name: "Portal Config", href: "/settings/portals", icon: Settings, adminOnly: true },
    { name: "Organisation", href: "/settings/org", icon: ShieldCheck, adminOnly: true },
]

export function Sidebar({ role }: { role?: string }) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64">
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl font-geist">S</span>
                </div>
                <span className="font-bold text-lg tracking-tight">Survey Toolkit</span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => {
                    if (item.adminOnly && role !== "ADMIN") return null

                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all hover:lift">
                    <PlusCircle className="w-4 h-4" />
                    New Job
                </button>
            </div>
        </div>
    )
}
