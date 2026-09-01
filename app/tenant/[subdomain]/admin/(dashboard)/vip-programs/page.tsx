import React from 'react';
import VipProgramsClient from './VipProgramsClient';
import { getVipPrograms } from './_actions/vip';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function VipProgramsPage(props: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await props.params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) return <div>Loja não encontrada.</div>;

  const programs = await getVipPrograms(tenant.id);

  return (
    <VipProgramsClient 
      tenantId={tenant.id}
      subdomain={subdomain}
      initialPrograms={programs}
    />
  );
}
