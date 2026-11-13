import { getCompetitiveProfiles } from "@/lib/competitive-programming/service";

export const runtime = "nodejs";

export async function GET() {
  const profiles = await getCompetitiveProfiles();

  return Response.json({
    generatedAt: new Date().toISOString(),
    profiles,
  });
}
