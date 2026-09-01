import ReportsClient from "./ReportsClient";

export default function ReportsPage({ params }: { params: { subdomain: string } }) {
  return <ReportsClient subdomain={params.subdomain} />;
}
