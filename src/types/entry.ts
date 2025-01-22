/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChangelogEntry {
  id: number;
  title: string;
  description: string;
  date: string;
  metadata: {
    sourceRepo: string;
    state: "opened" | "merged" | "released";
    url: string;
    author: string;
  };
}
