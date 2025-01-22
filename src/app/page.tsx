/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAllEntries } from "@/lib/store";
import { ChangelogList } from "@/components/list";
import { RiRssFill, RiGithubFill, RiExternalLinkLine } from "react-icons/ri";

export const revalidate = 60;

export default async function Home() {
  const entries = await getAllEntries();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header role="banner" className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            OpenTelemetry Changelog
          </h1>
          <div className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto space-y-4">
            <p>
              This site tracks pull requests to the OpenTelemetry Specification,
              Semantic Conventions, and Proto Definitions. The following items
              are tracked:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-left" role="list">
              <li>Non-trivial specification changes and releases.</li>
              <li>
                New semantic convention areas or stability changes, as well as
                releases.
              </li>
              <li>Updates and releases of the protos.</li>
            </ul>
            <p>
              The goal of this site is to give maintainers a single reference
              for important cross-functional changes.
            </p>
            <hr
              className="my-4 border-gray-200 dark:border-gray-700"
              role="presentation"
            />
            <p>
              To add a Pull Request to this feed, label it with{" "}
              <code
                className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                aria-label="Label name: changelog.opentelemetry.io"
              >
                changelog.opentelemetry.io
              </code>
            </p>
          </div>
        </header>

        <main
          id="main-content"
          role="main"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 p-6 sm:p-8"
          tabIndex={-1}
        >
          <div className="prose dark:prose-invert max-w-none">
            <ChangelogList entries={entries} />
          </div>
        </main>

        <footer role="contentinfo" className="mt-16 text-center">
          <nav aria-label="Footer navigation" className="space-x-6">
            <a
              href="/feed/"
              className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              aria-label="RSS Feed"
            >
              <RiRssFill className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>RSS Feed</span>
            </a>
            <a
              href="https://github.com/open-telemetry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              aria-label="OpenTelemetry on GitHub (opens in new tab)"
            >
              <RiGithubFill className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>GitHub</span>
              <RiExternalLinkLine className="w-3 h-3 ml-1" aria-hidden="true" />
            </a>
          </nav>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Built with Next.js and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
