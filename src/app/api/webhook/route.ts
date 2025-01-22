/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest } from "next/server";
import { saveEntry } from "@/lib/store";
import { ChangelogEntry } from "@/types/entry";
import {
  PullRequestEvent,
  ReleaseEvent,
  WebhookEvent,
} from "@octokit/webhooks-types";

const CHANGELOG_LABEL = "changelog.opentelemetry.io";

const ALLOWED_REPOSITORIES = [
  "open-telemetry/opentelemetry-specification",
  "open-telemetry/semantic-conventions",
  "open-telemetry/opentelemetry-proto",
  "open-telemetry/community",
  "open-telemetry/opentelemetry.io",
];

function isPullRequestEvent(event: WebhookEvent): event is PullRequestEvent {
  return "pull_request" in event;
}

function isReleaseEvent(event: WebhookEvent): event is ReleaseEvent {
  return "release" in event;
}

function isAllowedRepository(fullName: string): boolean {
  return ALLOWED_REPOSITORIES.includes(fullName);
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as WebhookEvent;

  if (isPullRequestEvent(payload)) {
    if (!isAllowedRepository(payload.repository.full_name)) {
      return new Response("Repository not in allowlist", { status: 200 });
    }

    if (
      payload.action === "labeled" &&
      payload.label?.name === CHANGELOG_LABEL &&
      !payload.pull_request.merged
    ) {
      const entry: ChangelogEntry = {
        id: payload.pull_request.id,
        title: payload.pull_request.title,
        description: payload.pull_request.body || "No description provided",
        date: payload.pull_request.updated_at,
        metadata: {
          sourceRepo: payload.repository.full_name,
          state: "opened",
          url: payload.pull_request.html_url,
          author: payload.pull_request.user.login,
        },
      };
      await saveEntry(entry);
    } else if (
      payload.action === "closed" &&
      payload.pull_request.merged &&
      payload.pull_request.labels.some(
        (label) => label.name === CHANGELOG_LABEL,
      )
    ) {
      const entry: ChangelogEntry = {
        id: payload.pull_request.id,
        title: payload.pull_request.title,
        description: payload.pull_request.body || "No description provided",
        date: payload.pull_request.merged_at || payload.pull_request.updated_at,
        metadata: {
          sourceRepo: payload.repository.full_name,
          state: "merged",
          url: payload.pull_request.html_url,
          author: payload.pull_request.user.login,
        },
      };
      await saveEntry(entry);
    }
  } else if (isReleaseEvent(payload)) {
    if (!isAllowedRepository(payload.repository.full_name)) {
      return new Response("Repository not in allowlist", { status: 200 });
    }

    if (payload.action === "published") {
      const entry: ChangelogEntry = {
        id: payload.release.id,
        title: payload.release.name,
        description: payload.release.body || "No description provided",
        date: payload.release.created_at || new Date().toISOString(),
        metadata: {
          sourceRepo: payload.repository.full_name,
          state: "released",
          url: payload.release.html_url,
          author: payload.release.author.login,
        },
      };
      await saveEntry(entry);
    }
  }
  return new Response("OK", { status: 200 });
}
