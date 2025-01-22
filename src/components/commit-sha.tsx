/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

interface CommitShaProps {
  sha: string;
  repoFullName: string;
}

export function CommitSha({ sha, repoFullName }: CommitShaProps) {
  return (
    <a
      href={`https://github.com/${repoFullName}/commit/${sha}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-blue-600 dark:text-blue-400 hover:underline"
    >
      {sha.slice(0, 7)}
    </a>
  );
}
