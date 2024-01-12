import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import db from "@/lib/db";

const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(30),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must have than 8 characters')
  })

export async function GET() {
  return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = userSchema.parse(body);

    // Check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return NextResponse.json({ user: null, message: 'User with this email already exists' }, { status: 409 })
    }

    // Check if username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username }
    });

    if (existingUserByUsername) {
      return NextResponse.json({ user: null, message: 'User with this username already exists' }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    })

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({ user: rest, message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}