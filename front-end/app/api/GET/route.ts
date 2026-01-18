import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Get your private variables (Server-side can see both)
    const ROOT_URL = process.env.ROOT_URL;
    const secretKey = process.env.API_SECRET_KEY;

    // 2. Wait for the backend response
    const response = await axios.get(`${ROOT_URL}/`, {
      headers: {
        "api-key": secretKey as string, // Your secret is safe here!
      },
    });

    // 3. Process the data (reversing contacts as you intended)
    const contacts = response.data.contacts?.reverse() || [];

    // 4. MUST return a NextResponse for the frontend to receive it
    return NextResponse.json(contacts);
  } catch (err: unknown) {
    console.error("Proxy Error:", err);

    // Return an error response so your frontend knows it failed
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}
