import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const apiUrl = process.env.ROOT_URL;
    const secretKey = process.env.API_SECRET_KEY;

    // 1. Get the data from the frontend
    const body = await req.json(); 
    const { id, name, phoneNo, email } = body;

    // 2. Forward to Express using PUT
    // axios.put(URL, DATA, CONFIG)
    const response = await axios.put(`${apiUrl}/edit/${id}`, 
      { name, phoneNo, email }, // This is the payload Express will see as req.body
      {
        headers: {
          'api-key': secretKey as string,
        },
      }
    );

    // 3. Return the reversed list (consistent with your other routes)
    const contacts = response.data.contacts?.reverse() || [];
    return NextResponse.json(contacts);

  } catch (err: unknown) {
    console.error("Proxy PUT Error:",err);
    return NextResponse.json(
      { error: "Failed to update contact" }, 
      { status: 500 }
    );
  }
}