import { saveEntry } from "@/lib/store";
import { ChangelogEntry } from "@/types/entry";

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return new Response("Test endpoint only available in development", {
      status: 403,
    });
  }

  const testEntry: ChangelogEntry = {
    id: Date.now(), // Use timestamp as ID for test entries
    title: `Test Entry ${new Date().toISOString()}`,
    description: "This is a test entry to verify cache revalidation",
    date: new Date().toISOString(),
    metadata: {
      sourceRepo: "open-telemetry/test-repo",
      state: "opened",
      url: "https://github.com/open-telemetry/test-repo/pull/123",
      author: "test-user",
    },
  };

  try {
    await saveEntry(testEntry);
    return new Response("Test entry added", { status: 200 });
  } catch (error) {
    console.error("Error adding test entry:", error);
    return new Response("Error adding test entry", { status: 500 });
  }
}
