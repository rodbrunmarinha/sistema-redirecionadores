import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !session) {
    redirect("/app/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, cpf, suite_number, phone, birth_date, created_at')
    .eq('id', user.id)
    .setHeader('Authorization', `Bearer ${session.access_token}`)
    .maybeSingle();

  return <ProfileClient profile={profile} email={user.email || ""} />;
}
