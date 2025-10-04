export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("http://localhost:3001/model/sync", {
      method: "GET",
      headers: { Accept: "application/json" },
      // Ensure server-to-server, no caching
      cache: "no-store",
    });

    const text = await res.text();
    return new Response(text || (res.ok ? "OK" : ""), {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "text/plain" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Sync request failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
