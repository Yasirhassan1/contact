import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const ROOT_URL = process.env.ROOT_URL;
    const secretKey = process.env.API_SECRET_KEY;

    // 1. EXTRA STEP: You must read the data sent from your frontend
    const body = await req.json(); 

    // 2. CORRECT AXIOS CALL:
    // axios.post(URL, DATA, CONFIG)
    const response = await axios.post(`${ROOT_URL}/create`, body, {
      headers: {
        'api-key': secretKey as string,
      },
    });

    // 3. Handle response (assuming backend returns the full list)
    const contacts = response.data.contacts?.reverse() || [];
    return NextResponse.json(contacts);

  } catch (err: unknown) {
    console.error("Proxy POST Error:", err);
    return NextResponse.json(
      { error: "Failed to create contact" }, 
      { status: 500 }
    );
  }
}