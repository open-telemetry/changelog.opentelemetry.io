"use client";

import { useState } from "react";

export function TestControls() {
  const [status, setStatus] = useState<string>("");

  const addTestEntry = async () => {
    try {
      setStatus("Adding test entry...");
      const response = await fetch("/api/test", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setStatus("Test entry added! Check if the page updates.");

      // Clear status after 3 seconds
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={addTestEntry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Test Entry
      </button>
      {status && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {status}
        </p>
      )}
    </div>
  );
}
