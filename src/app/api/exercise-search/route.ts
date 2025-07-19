import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { query } = body;

  const appId = process.env.NUTRITIONIX_APP_ID;
  const appKey = process.env.NUTRITIONIX_APP_KEY;

  if (!query || !appId || !appKey) {
    return NextResponse.json({ error: 'Missing query or API credentials' }, { status: 400 });
  }

  // Create a Supabase client tied to the current session via cookies
  const supabase = createRouteHandlerClient({ cookies });

  // Get current user session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session || sessionError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // Fetch physical details from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('gender, weight_kg, height_cm, age')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }

  const { gender, weight_kg, height_cm, age } = profile;

  // Call Nutritionix API
  const response = await fetch('https://trackapi.nutritionix.com/v2/natural/exercise', {
    method: 'POST',
    headers: {
      'x-app-id': appId,
      'x-app-key': appKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      gender,
      weight_kg,
      height_cm,
      age,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: `Nutritionix request failed: ${errorText}` }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
