import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FilePlus, FileText, User, LogOut, ShieldAlert, Home } from "lucide-react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV = [
  { to: "/portal", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/portal/quote", label: "Request a Quote", icon: FilePlus },
  { to: "/portal/requests", label: "My Requests", icon: FileText },
  { to: "/portal/profile", label: "Profile", icon: User },
];

function AppLayout() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: pathname } });
  }, [user, loading]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container-rk flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button asChild size="sm" variant="outline">
                <Link to="/admin"><ShieldAlert className="h-4 w-4" /> Admin</Link>
              </Button>
            )}
            <Button asChild size="sm" variant="ghost"><Link to="/"><Home className="h-4 w-4" /> Site</Link></Button>
            <Button size="sm" variant="outline" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </header>
      <div className="container-rk grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="space-y-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-h-[60vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
