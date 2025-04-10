/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CommitSha } from "./commit-sha";
import { GitHubUsername } from "./github-username";

const isDev = process.env.NODE_ENV === "development";

function debugLog(message: string, ...args: unknown[]) {
  if (isDev) {
    console.log(`[ChangelogDescription] ${message}`, ...args);
  }
}

function truncateMarkdown(markdown: string, lines: number = 3): string {
  const allLines = markdown.split("\n");
  const truncated = allLines.slice(0, lines).join("\n");
  const hasMore = allLines.length > lines;
  return hasMore ? truncated : markdown;
}

function processGitHubLinks(text: string, repoFullName: string): string {
  debugLog("Processing text for repo:", repoFullName);
  let processedText = text;

  // Replace PR references first (including those in parentheses)
  const prPattern = /(?:^|\s|[([])#(\d+)(?=[\s\n\])]|$)/g;
  processedText = processedText.replace(prPattern, (match, issue) => {
    debugLog("Found PR reference:", issue);
    const prefix =
      match.startsWith("(") || match.startsWith("[") ? match[0] : " ";
    return `${prefix}[#${issue}](https://github.com/${repoFullName}/issues/${issue})`;
  });

  // Replace commit SHAs
  const shaPattern = /(\s|^)([0-9a-f]{40})(?=[\s\n]|$)/g;
  processedText = processedText.replace(shaPattern, (match, space, sha) => {
    debugLog("Found SHA:", sha);
    return `${space}[${sha}](https://github.com/${repoFullName}/commit/${sha})`;
  });

  // Replace user mentions
  const userPattern = /(?:^|\s)@([a-zA-Z0-9-]+)(?=[\s\n]|$)/g;
  processedText = processedText.replace(userPattern, (match, username) => {
    debugLog("Found username mention:", username);
    return ` [@${username}](https://github.com/${username})`;
  });

  // Replace repository references with issue numbers
  const repoPattern = /([a-zA-Z0-9-]+\/[a-zA-Z0-9-._-]+)#(\d+)(?=[\s\n]|$)/g;
  processedText = processedText.replace(repoPattern, (match, repo, issue) => {
    debugLog("Found cross-repo reference:", { repo, issue });
    return `[${repo}#${issue}](https://github.com/${repo}/issues/${issue})`;
  });

  if (isDev) {
    if (text !== processedText) {
      debugLog("Text was modified. Original:", text);
      debugLog("Processed:", processedText);
    } else {
      debugLog("No modifications were made to the text");
    }
  }

  return processedText;
}

interface ChangelogDescriptionProps {
  description: string;
  repoFullName: string;
}

export function ChangelogDescription({
  description,
  repoFullName,
}: ChangelogDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = description.split("\n");
  const hasMore = lines.length > 3;

  debugLog("Rendering description", {
    repoFullName,
    descriptionLength: description.length,
    numberOfLines: lines.length,
    isExpanded,
  });

  // Process the description to add GitHub-specific links
  const processedDescription = processGitHubLinks(description, repoFullName);

  return (
    <div className="space-y-2">
      <div className="text-sm text-black/70 dark:text-white/70 prose dark:prose-invert prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => {
              // Handle the case where children is an array of elements
              const text = Array.isArray(children)
                ? children
                    .map((child) =>
                      typeof child === "string"
                        ? child
                        : child.props?.children || "",
                    )
                    .join("")
                : children;

              debugLog("Rendering link", { href, text });

              // Handle commit SHAs
              if (typeof text === "string" && text.match(/^[0-9a-f]{40}$/)) {
                debugLog("Rendering as commit SHA");
                return <CommitSha sha={text} repoFullName={repoFullName} />;
              }

              // Handle usernames
              if (typeof text === "string" && text.startsWith("@")) {
                debugLog("Rendering as username");
                return <GitHubUsername username={text.slice(1)} />;
              }

              // Default link rendering
              debugLog("Rendering as default link");
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {isExpanded
            ? processedDescription
            : truncateMarkdown(processedDescription)}
        </ReactMarkdown>
      </div>
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
        >
          {isExpanded ? "Show less" : "Show more..."}
        </button>
      )}
    </div>
  );
}
