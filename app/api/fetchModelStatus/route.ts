// app/api/fetchModelStatus/route.ts
import next from "next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl =
      "https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK";
    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {}
}

export default async function handler(
  req: { query: { modelName: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: { error?: string; html?: any }): void;
        new (): any;
      };
    };
  }
) {
  const { modelName } = req.query;
  if (!modelName) {
    res.status(400).json({ error: "Missing modelName parameter" });
    return;
  }
  try {
    const response = await fetch(`https://chaturbate.com/${modelName}`);
    console.log(response)
    // const html = await response.text();
    // res.status(200).json({html});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
