import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
    const query = await request.nextUrl.searchParams.get("q");
    console.log(query)
    return NextResponse.json({ query });
}
