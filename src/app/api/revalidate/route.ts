import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization");

  if (token !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    revalidatePath("/", "page");
    revalidatePath("/feed", "page");

    return new Response("Revalidated", { status: 200 });
  } catch (error: unknown) {
    // Log the error and return a 500
    console.error("Revalidation error:", error);
    return new Response(
      `Error revalidating: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}
