import { NextResponse } from 'next/server';

export async function GET() {
  const userData = {
    name: "sahil",
    surname: "khan",
    age: 25,
    male: true
  }
  return NextResponse.json({
    message: "api res",
    userData
  }, { status: 200 })
}
