import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        return NextResponse.json(body);
    } catch (error) {
        return NextResponse.json(error);
    }
}

export async function GET() {
    return NextResponse.json({ "teste": "teste" });
}