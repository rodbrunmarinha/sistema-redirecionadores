import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BoxesClient } from "./BoxesClient";
import { getTenantSettings } from "../_utils/getTenantSettings";

export const dynamic = 'force-dynamic';

export default async function BoxesPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/app/login");
  }

  // Obter caixas
  const { data: boxes } = await supabase
    .from('boxes')
    .select(`
      *,
      products (*)
    `)
    .eq('customer_id', user.id)
    .is('deleted_at', null)
    .order('received_at', { ascending: false });

  const settings = await getTenantSettings(subdomain);
  const currency = settings?.operations?.currency || "USD";
  const currencySymbol = currency === "BRL" ? "R$" : currency === "EUR" ? "€" : currency === "JPY" ? "¥" : "$";

  return <BoxesClient initialBoxes={boxes || []} currencySymbol={currencySymbol} />;
}
