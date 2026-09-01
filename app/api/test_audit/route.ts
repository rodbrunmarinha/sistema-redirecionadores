
import { NextResponse } from 'next/server';
import { logProductAudit } from '@/utils/auditLogger';

export async function GET() {
  try {
    // Just a dummy log
    await logProductAudit(
      '00000000-0000-0000-0000-000000000000', // invalid uuid might fail fk constraint
      null as any,
      null as any,
      'test_field',
      'old',
      'new'
    );
    return NextResponse.json({ success: true });
  } catch(e:any) {
    return NextResponse.json({ error: e.message });
  }
}
