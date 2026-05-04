import { fetchProcessingTime } from "@/lib/uscis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const formKey = searchParams.get("form");

  if (!formKey) {
    return Response.json({ error: "Missing form parameter" }, { status: 400 });
  }

  const data = await fetchProcessingTime(formKey);
  return Response.json(data, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
