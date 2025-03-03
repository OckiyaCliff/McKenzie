"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Home,
  Search,
  Menu,
  FileText,
  Users,
  DollarSign,
  BarChart2,
  Settings,
  LogOut,
  Heart,
  CreditCard,
  HelpCircle,
  Wallet,
  Gavel,
  Clock,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const AdminMenuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/admin" },
  { icon: Users, label: "Manage Users", href: "/dashboard/admin/users" },
  { icon: Gavel, label: "Manage Auctions", href: "/dashboard/admin/auctions" },
  { icon: DollarSign, label: "Token Distribution", href: "/dashboard/admin/tokens" },
  { icon: BarChart2, label: "Reports & Analytics", href: "/dashboard/admin/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" },
]

const UserMenuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/user" },
  { icon: Wallet, label: "Buy Tokens", href: "/dashboard/user/buy-tokens" },
  { icon: Gavel, label: "Auctions", href: "/dashboard/user/auctions" },
  { icon: Clock, label: "My Bids", href: "/dashboard/user/my-bids" },
  { icon: Heart, label: "Watchlist", href: "/dashboard/user/watchlist" },
  { icon: FileText, label: "My Properties", href: "/dashboard/user/properties" },
  { icon: FileText, label: "List Property", href: "/dashboard/user/list-property" },
  { icon: CreditCard, label: "Payment History", href: "/dashboard/user/payments" },
  { icon: Settings, label: "Account Settings", href: "/dashboard/user/settings" },
  { icon: HelpCircle, label: "Help Center", href: "/dashboard/user/help" },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === "admin")
          setTokenBalance(userDoc.data().tokenBalance || 0)
        }
      }
    }
    checkUserRole()
  }, [user])

  const menuItems = isAdmin ? AdminMenuItems : UserMenuItems

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-card lg:border-r">
        <div className="flex items-center h-16 px-6 border-b">
          <span className="text-2xl font-semibold">{isAdmin ? "Admin Dashboard" : "User Dashboard"}</span>
        </div>
        {!isAdmin && (
          <div className="p-4 border-b">
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Token Balance</p>
              <p className="text-2xl font-bold text-primary">{tokenBalance}</p>
              <Link href="/dashboard/user/buy-tokens">
                <Button size="sm" className="w-full mt-2">
                  Buy Tokens
                </Button>
              </Link>
            </div>
          </div>
        )}
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
              {item.label === "My Bids" && (
                <Badge variant="secondary" className="ml-auto">
                  3
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="flex items-center justify-between h-16 px-6 bg-card border-b">
          <div className="flex items-center lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="h-16 px-6 border-b">
                  <SheetTitle>Dashboard</SheetTitle>
                </SheetHeader>
                {!isAdmin && (
                  <div className="p-4 border-b">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Token Balance</p>
                      <p className="text-2xl font-bold text-primary">{tokenBalance}</p>
                      <Link href="/dashboard/user/buy-tokens">
                        <Button size="sm" className="w-full mt-2">
                          Buy Tokens
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                <nav className="flex-1 overflow-y-auto">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-6 py-3 text-sm font-medium ${
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                      {item.label === "My Bids" && (
                        <Badge variant="secondary" className="ml-auto">
                          3
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="text" placeholder="Search..." className="pl-10 w-64" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt={user?.displayName || "User avatar"} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard/user/settings" className="flex w-full">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                {!isAdmin && (
                  <DropdownMenuItem>
                    <Link href="/dashboard/user/buy-tokens" className="flex w-full">
                      Buy Tokens ({tokenBalance})
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => auth.signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">{children}</main>
      </div>
    </div>
  )
}

