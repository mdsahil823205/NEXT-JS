
import { NextResponse, NextRequest } from "next/server";
export async function GET() {
    const details = {
        name: "sahil",
        age: 24,
        year: "3rd year",
        state: "west bengal",
        city: "kolkata",
        male: true,
        female: false
    }
    return NextResponse.json({
        details
    }, {
        status: 200
    })
}

export async function POST(request) {
    const { name, email } = await request.json()
    console.log(name, email)
    return NextResponse.json({
        name,
        email
    }, {
        status: 200
    })
}