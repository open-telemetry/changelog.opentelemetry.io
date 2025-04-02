/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { getStore } from "@netlify/blobs";
import { ChangelogEntry } from "@/types/entry";

// Mock data for development/build
const MOCK_ENTRIES: ChangelogEntry[] = [
  {
    id: 1,
    title: "Add HTTP semantic conventions for GraphQL",
    description:
      "Introduces new semantic conventions for GraphQL operations including query names, operation types, and complexity metrics.",
    date: "2024-01-15T10:00:00Z",
    metadata: {
      sourceRepo: "open-telemetry/semantic-conventions",
      state: "merged",
      url: "https://github.com/open-telemetry/semantic-conventions/pull/123",
      author: "graphql-expert",
    },
  },
  {
    id: 2,
    title: "Update Trace API specification for batch operations",
    description:
      "Enhances the trace API to better support batch processing scenarios with new attributes and contexts.",
    date: "2024-01-14T15:30:00Z",
    metadata: {
      sourceRepo: "open-telemetry/opentelemetry-specification",
      state: "opened",
      url: "https://github.com/open-telemetry/opentelemetry-specification/pull/456",
      author: "trace-developer",
    },
  },
  {
    id: 3,
    title: "Release v1.2.0 of OpenTelemetry Protocol",
    description:
      "New stable release including performance improvements and bug fixes for the protocol implementation.",
    date: "2024-01-13T09:15:00Z",
    metadata: {
      sourceRepo: "open-telemetry/opentelemetry-proto",
      state: "released",
      url: "https://github.com/open-telemetry/opentelemetry-proto/releases/tag/v1.2.0",
      author: "proto-maintainer",
    },
  },
  {
    id: 4,
    title: "Add new metrics for async operations",
    description:
      "Introduces standardized metrics for tracking async operation performance and queue depths.",
    date: "2024-01-12T14:45:00Z",
    metadata: {
      sourceRepo: "open-telemetry/opentelemetry-specification",
      state: "merged",
      url: "https://github.com/open-telemetry/opentelemetry-specification/pull/789",
      author: "metrics-specialist",
    },
  },
  {
    id: 5,
    title: "Database semantic conventions revision",
    description:
      "Major update to database conventions including new attributes for cloud-native databases.",
    date: "2024-01-11T11:20:00Z",
    metadata: {
      sourceRepo: "open-telemetry/semantic-conventions",
      state: "opened",
      url: "https://github.com/open-telemetry/semantic-conventions/pull/234",
      author: "db-expert",
    },
  },
  {
    id: 6,
    title: "Protocol Buffers v3.0 Migration",
    description:
      "Migration guide and implementation details for updating to Protocol Buffers v3.0.",
    date: "2024-01-10T16:00:00Z",
    metadata: {
      sourceRepo: "open-telemetry/opentelemetry-proto",
      state: "opened",
      url: "https://github.com/open-telemetry/opentelemetry-proto/pull/567",
      author: "proto-specialist",
    },
  },
  {
    id: 7,
    title: "Community Governance Updates",
    description:
      "Updates to the governance model including new maintainer roles and decision processes.",
    date: "2024-01-09T13:30:00Z",
    metadata: {
      sourceRepo: "open-telemetry/community",
      state: "merged",
      url: "https://github.com/open-telemetry/community/pull/890",
      author: "community-lead",
    },
  },
  {
    id: 8,
    title: "Release v2.0.0 of Semantic Conventions",
    description:
      "Major release including breaking changes and new conventions for cloud-native environments.",
    date: "2024-01-08T10:45:00Z",
    metadata: {
      sourceRepo: "open-telemetry/semantic-conventions",
      state: "released",
      url: "https://github.com/open-telemetry/semantic-conventions/releases/tag/v2.0.0",
      author: "release-manager",
    },
  },
  {
    id: 9,
    title: "Specification v1.5.0 Release",
    description:
      "New stable release of the OpenTelemetry specification with enhanced debugging capabilities.",
    date: "2024-01-07T12:00:00Z",
    metadata: {
      sourceRepo: "open-telemetry/opentelemetry-specification",
      state: "released",
      url: "https://github.com/open-telemetry/opentelemetry-specification/releases/tag/v1.5.0",
      author: "spec-maintainer",
    },
  },
  {
    id: 10,
    title: "New Working Group Process",
    description:
      "Established new guidelines for creating and managing working groups within the community.",
    date: "2024-01-06T09:00:00Z",
    metadata: {
      sourceRepo: "open-telemetry/community",
      state: "opened",
      url: "https://github.com/open-telemetry/community/pull/345",
      author: "governance-expert",
    },
  },
];

// In-memory store for development
const devStore: ChangelogEntry[] = [];

export async function saveEntry(entry: ChangelogEntry) {
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: saving to in-memory store");
    // Add to start of array to match the sorting in getAllEntries
    devStore.unshift(entry);
    return;
  }

  try {
    const store = getStore("changelog-store");
    await store.setJSON(entry.id.toString(), entry);

    // Trigger revalidation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REVALIDATION_TOKEN}`,
      },
    });
  } catch (error) {
    console.warn("Failed to save entry:", error);
    console.log("Would have saved:", entry);
  }
}

export async function getAllEntries(): Promise<ChangelogEntry[]> {
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: reading from in-memory store");
    return devStore.length > 0 ? devStore : MOCK_ENTRIES;
  }

  try {
    const store = getStore("changelog-store");
    const list = await store.list();
    const entries = await Promise.all(
      list.blobs.map(async (item) => {
        const entry = (await store.get(item.key, {
          type: "json",
        })) as ChangelogEntry;
        return entry;
      }),
    );

    return entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.warn("Failed to get entries:", error);
    return MOCK_ENTRIES;
  }
}
