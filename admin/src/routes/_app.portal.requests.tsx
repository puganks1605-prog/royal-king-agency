import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "./_app.portal.index";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/_app/portal/requests")({
  head: () => ({ meta: [{ title: "My Requests — Royal King Insurance" }, { name: "robots", content: "noindex" }] }),
  component: RequestsPage,
});

function RequestsPage() {
  const { data: requests = [] } = useQuery({
    queryKey: ["my-requests-all"],
    queryFn: async () => {
      const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold">My Requests</h1>
        <p className="mt-1 text-muted-foreground">All your insurance quote requests and their status.</p>
      </div>

      {requests.length === 0 ? (
        <Card className="grid place-items-center gap-3 p-12 text-center shadow-soft">
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <p className="font-display text-lg font-bold">No requests yet</p>
          <p className="text-sm text-muted-foreground">Submit your first quote request to see it here.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((r: any) => (
            <Card key={r.id} className="p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold">{r.insurance_type}</h3>
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(r.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              {r.vehicle_details && <p className="mt-3 text-sm"><span className="font-semibold">Vehicle:</span> {r.vehicle_details}</p>}
              {r.property_details && <p className="mt-1 text-sm"><span className="font-semibold">Property:</span> {r.property_details}</p>}
              {r.notes && <p className="mt-1 text-sm text-muted-foreground">{r.notes}</p>}
              {r.admin_response && (
                <div className="mt-4 rounded-lg border-l-4 border-primary bg-primary/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Advisor response</p>
                  <p className="mt-1 text-sm">{r.admin_response}</p>
                  {r.quoted_premium && <p className="mt-2 font-display text-lg font-bold text-primary">₹ {Number(r.quoted_premium).toLocaleString("en-IN")}</p>}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
