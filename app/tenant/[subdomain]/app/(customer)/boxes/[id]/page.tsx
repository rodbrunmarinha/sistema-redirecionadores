import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BoxDetailsClient } from "./BoxDetailsClient";
import { getTenantSettings } from "../../_utils/getTenantSettings";

export default async function BoxDetailsPage(props: { params: Promise<{ subdomain: string, id: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const boxId = params.id;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/app/login");
  }

  // Obter detalhes da caixa
  const { data: box } = await supabase
    .from('boxes')
    .select(`
      *,
      products (*)
    `)
    .eq('id', boxId)
    .eq('customer_id', user.id)
    .single();

  if (!box) {
    redirect("/app/boxes");
  }

  const settings = await getTenantSettings(subdomain);
  const currency = settings?.operations?.currency || "USD";
  const currencySymbol = currency === "BRL" ? "R$" : currency === "EUR" ? "€" : currency === "JPY" ? "¥" : "$";
  const weightUnit = settings?.operations?.weightUnit || "kg";

  return <BoxDetailsClient box={box} currencySymbol={currencySymbol} weightUnit={weightUnit} />;
}
