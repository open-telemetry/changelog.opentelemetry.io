/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

interface GitHubUsernameProps {
  username: string;
}

export function GitHubUsername({ username }: GitHubUsernameProps) {
  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      @{username}
    </a>
  );
}
