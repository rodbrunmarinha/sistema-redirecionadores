import { getCoupons } from "./_actions/coupons";
import CouponsClient from "./CouponsClient";

export default async function CouponsPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const coupons = await getCoupons(subdomain);

  // Mocking clients/customers for now as requested
  const clients: any[] = []; 

  return <CouponsClient initialCoupons={coupons} subdomain={subdomain} clients={clients} />;
}
