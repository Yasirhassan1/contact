import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function remove(req: NextRequest) {
  try {
    const ROOT_URL = process.env.ROOT_URl;
    const secretKey = process.env.API_SECRET_KEY;

    // 1. Get the ID sent from your frontend
    const body = await req.json(); 
    const { id } = body;

    // 2. Call your REAL backend
    // Format: axios.delete(URL, CONFIG)
    const response = await axios.delete(`${ROOT_URL}/delete/${id}`, {
      headers: {
        'api-key': secretKey as string,
      },
    });

    // 3. Return the updated list to the frontend
    const contacts = response.data.contacts?.reverse() || [];
    return NextResponse.json(contacts);

  } catch (err: unknown) {
    console.error("Proxy DELETE Error:", err);
    return NextResponse.json(
      { error: "Failed to delete contact" }, 
      { status: 500 }
    );
  }
}