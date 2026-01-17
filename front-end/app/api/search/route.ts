import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const apiUrl = process.env.ROOT_URL;
    const secretKey = process.env.API_SECRET_KEY;

    // 1. Get the name from the URL Query string (?name=...)
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ ids: [] });
    }

    // 2. Forward to Express (Check if your Express route is GET or POST)
    // Assuming your Express backend is: GET /search/:name
    const response = await axios.get(`${apiUrl}/search/${name}`, {
      headers: {
        'api-key': secretKey as string,
      },
    });

    // 3. Return the IDs to the frontend
    return NextResponse.json({ 
      success: true, 
      ids: response.data.ids 
    });

  } catch (err: unknown) {
    console.error("Search Proxy Error:", err);
    return NextResponse.json({ success: false, ids: [] }, { status: 500 });
  }
}