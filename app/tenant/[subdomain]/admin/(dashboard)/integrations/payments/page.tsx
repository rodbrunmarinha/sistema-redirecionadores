import { PaymentsClient } from './PaymentsClient';
import { getPaymentSettings } from './_actions/payments';

export const metadata = {
  title: 'Integrações de Pagamento',
};

export default async function PaymentsPage({ params }: { params: { subdomain: string } }) {
  const settings = await getPaymentSettings(params.subdomain);

  return <PaymentsClient subdomain={params.subdomain} initialSettings={settings || {}} />;
}
