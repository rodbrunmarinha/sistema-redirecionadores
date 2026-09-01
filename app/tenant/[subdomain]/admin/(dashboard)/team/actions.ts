"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/utils/auth";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createTeamMember(formData: FormData, subdomain: string) {
  try {
    await requirePermission("team.create");
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const roleForm = formData.get("role") as string;

    // Resolve tenant id
    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (!tenant) throw new Error("Tenant not found");

    // Map form role to DB role
    let role = "SUPPORT";
    if (roleForm === "owner") role = "ADMIN";
    if (roleForm === "admin") role = "ADMIN";
    if (roleForm === "manager") role = "MANAGER";
    if (roleForm === "support") role = "SUPPORT";

    // Check limit
    const { count } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .neq('role', 'CUSTOMER');

    if (count !== null && count >= 3) {
      return { success: false, error: "Limite de membros atingido para o seu plano atual." };
    }

    // Create user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        tenant_id: tenant.id,
        role: role
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      await supabaseAdmin.from('profiles').insert({
        id: authData.user.id,
        full_name: name,
        email: email,
        role: role,
        tenant_id: tenant.id
      });
    }

    revalidatePath(`/admin/team`);
    return { success: true };
  } catch (err: any) {
    console.error("Error creating team member:", err);
    return { success: false, error: err.message };
  }
}

export async function updateTeamMember(formData: FormData, memberId: string) {
  try {
    await requirePermission("team.edit");
    const name = formData.get("name") as string;
    const roleForm = formData.get("role") as string;
    const password = formData.get("password") as string;

    let role = "SUPPORT";
    if (roleForm === "admin") role = "ADMIN";
    if (roleForm === "manager") role = "MANAGER";
    if (roleForm === "support") role = "SUPPORT";

    const updateData: any = {
      user_metadata: { full_name: name, role: role }
    };
    
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(memberId, updateData);
    if (authError) throw authError;

    await supabaseAdmin.from('profiles').update({
      full_name: name,
      role: role
    }).eq('id', memberId);

    revalidatePath(`/admin/team`);
    return { success: true };
  } catch (err: any) {
    console.error("Error updating team member:", err);
    return { success: false, error: err.message };
  }
}
