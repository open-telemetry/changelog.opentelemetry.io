/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAllEntries } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const entries = await getAllEntries();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://changelog.opentelemetry.io";

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>OpenTelemetry Changelog</title>
        <link>${baseUrl}</link>
        <description>Latest changes across OpenTelemetry repositories</description>
        <atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml" />
        <language>en-US</language>
        ${entries
          .map(
            (entry) => `
          <item>
            <title><![CDATA[${entry.title}]]></title>
            <link>${baseUrl}/entry/${entry.id}</link>
            <guid isPermaLink="false">${entry.id}</guid>
            <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
            <description><![CDATA[${entry.description}]]></description>
            ${
              entry.metadata.sourceRepo
                ? `
              <category><![CDATA[${entry.metadata.sourceRepo}]]></category>
            `
                : ""
            }
          </item>
        `,
          )
          .join("")}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml;charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
