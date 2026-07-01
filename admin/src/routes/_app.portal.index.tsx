import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { FilePlus, Bell, MessageCircle, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/portal/")({
  head: () => ({ meta: [{ title: "My Portal — Royal King Insurance" }, { name: "robots", content: "noindex" }] }),
  component: PortalHome,
});

function PortalHome() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["my-requests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const pending = requests.filter((r: any) => r.status === "pending").length;
  const quoted = requests.filter((r: any) => r.status === "quoted").length;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.</h1>
        <p className="mt-1 text-muted-foreground">Here's a quick view of your account.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Requests" value={requests.length} icon={FileText} />
        <StatCard label="Awaiting Quote" value={pending} icon={Bell} />
        <StatCard label="Quoted" value={quoted} icon={MessageCircle} />
      </div>

      <Card className="p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold">Need a new insurance quote?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tell us a little about what you need — we'll revert with the best option from 15+ insurers.</p>
          </div>
          <Button asChild><Link to="/portal/quote"><FilePlus className="h-4 w-4" /> New Request</Link></Button>
        </div>
      </Card>

      <Card className="p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recent requests</h2>
          <Link to="/portal/requests" className="text-sm font-semibold text-primary hover:underline">View all</Link>
        </div>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests yet. Submit one to get started.</p>
        ) : (
          <ul className="divide-y">
            {requests.map((r: any) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-display text-sm font-semibold">{r.insurance_type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <Card className="p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:  "bg-warning/15 text-warning-foreground border-warning/40",
    quoted:   "bg-primary/15 text-primary border-primary/30",
    approved: "bg-green-500/15 text-green-700 border-green-500/30",
    declined: "bg-destructive/15 text-destructive border-destructive/30",
    closed:   "bg-muted text-muted-foreground border-border",
  };
  return <Badge variant="outline" className={map[status] ?? ""}>{status}</Badge>;
}
