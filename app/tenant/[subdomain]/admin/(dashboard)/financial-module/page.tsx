import FinancialModuleClient from "./FinancialModuleClient";

export default async function FinancialModulePage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  return <FinancialModuleClient subdomain={params.subdomain} />;
}
