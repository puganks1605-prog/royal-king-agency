import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "./_app.portal.index";
import { toast } from "sonner";
import { useState } from "react";
import { ShieldAlert, Inbox, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Royal King Insurance" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/portal", replace: true });
  }, [isAdmin, loading]);

  const { data: requests = [] } = useQuery({
    queryKey: ["admin-requests"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(20);
      return data ?? [];
    },
  });

  if (!isAdmin) return null;

  const pending = requests.filter((r: any) => r.status === "pending").length;
  const quoted = requests.filter((r: any) => r.status === "quoted").length;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-7 w-7 text-primary" />
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage quote requests, contact messages and customers.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total Requests" value={requests.length} />
        <Stat label="Pending" value={pending} accent="warning" />
        <Stat label="Quoted" value={quoted} accent="primary" />
      </div>

      <Card className="p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold">Quote requests</h2>
        {requests.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No requests yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Mobile</th>
                  <th className="py-2 pr-3">Submitted</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-3 pr-3 font-medium">{r.full_name}</td>
                    <td className="py-3 pr-3">{r.insurance_type}</td>
                    <td className="py-3 pr-3">{r.mobile}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 pr-3"><StatusBadge status={r.status} /></td>
                    <td className="py-3 pr-3"><ManageDialog request={r} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Recent contact messages</h2>
        {messages.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2"><Inbox className="h-4 w-4" /> No messages yet.</p>
        ) : (
          <ul className="mt-4 divide-y">
            {messages.map((m: any) => (
              <li key={m.id} className="py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-display text-sm font-bold">{m.name} <span className="font-sans font-normal text-muted-foreground">· {m.email}{m.mobile ? ` · ${m.mobile}` : ""}</span></p>
                  <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString("en-IN")}</p>
                </div>
                {m.subject && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">{m.subject}</p>}
                <p className="mt-1 text-sm">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: "primary" | "warning" }) {
  const ring = accent === "primary" ? "ring-primary/30" : accent === "warning" ? "ring-warning/30" : "ring-border";
  return (
    <Card className={`p-5 shadow-soft ring-1 ${ring}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </Card>
  );
}

function ManageDialog({ request }: { request: any }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(request.status);
  const [adminResponse, setAdminResponse] = useState<string>(request.admin_response ?? "");
  const [premium, setPremium] = useState<string>(request.quoted_premium?.toString() ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const { error } = await supabase
      .from("quote_requests")
      .update({
        status,
        admin_response: adminResponse || null,
        quoted_premium: premium ? Number(premium) : null,
      })
      .eq("id", request.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-requests"] }); setOpen(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline">Manage</Button></DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{request.full_name} · {request.insurance_type}</DialogTitle></DialogHeader>
        <div className="grid gap-3 text-sm">
          <div className="grid gap-1 rounded-md bg-muted p-3 text-xs">
            <p><span className="font-semibold">Mobile:</span> {request.mobile}</p>
            <p><span className="font-semibold">Email:</span> {request.email}</p>
            {request.vehicle_details && <p><span className="font-semibold">Vehicle:</span> {request.vehicle_details}</p>}
            {request.property_details && <p><span className="font-semibold">Property:</span> {request.property_details}</p>}
            {request.notes && <p><span className="font-semibold">Notes:</span> {request.notes}</p>}
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="prem">Quoted premium (₹)</Label>
            <Input id="prem" type="number" value={premium} onChange={(e) => setPremium(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="resp">Advisor response</Label>
            <Textarea id="resp" rows={4} value={adminResponse} onChange={(e) => setAdminResponse(e.target.value)} maxLength={2000} />
          </div>
          <Button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save changes"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
