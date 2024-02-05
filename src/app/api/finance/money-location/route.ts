import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

const userSchema = z
  .object({
    description: z.string().min(1, 'Description is required').max(60),
  })

export async function GET() {
  const session = await getServerSession(authOptions);

  return NextResponse.json({ authenticated: !!session })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = userSchema.parse(body);

    console.log(description);

    return NextResponse.json({ message: description }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}