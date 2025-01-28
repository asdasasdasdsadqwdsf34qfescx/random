// app/api/fetchModelStatus/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl =
      "https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK";
    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data from Chaturbate API:", error);
    return NextResponse.json(
      { error: "Failed to fetch model status" },
      { status: 500 }
    );
  }
}
