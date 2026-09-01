import BehaviorClient from "./BehaviorClient";

export default async function AnalyticsBehaviorPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  
  return (
    <BehaviorClient subdomain={params.subdomain} />
  );
}
