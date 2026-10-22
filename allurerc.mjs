// Allure 3 configuration. Docs: https://allurereport.org/docs/v3/configure/
import { defineConfig } from "allure";

// One category per Jev verdict. Triage writes the `jev_verdict` label
// on every failed result (triage/allure.ts); Allure groups by that label.
const jevCategory = (name, verdict) => ({
  name,
  id: `jev-${verdict}`,
  matchers: { statuses: ["failed", "broken"], labels: { jev_verdict: `^${verdict}$` } },
  expand: true,
});

export default defineConfig({
  name: "Finance App E2E",
  output: "./reports/allure-report",
  // Allure history (trends, flaky detection). In CI it is downloaded from GitHub Pages.
  historyPath: "./.history/allure.jsonl",
  historyLimit: 20,
  categories: {
    rules: [
      jevCategory("🐞 Bug (Jev)", "bug"),
      jevCategory("🎲 Flaky (Jev)", "flaky"),
      jevCategory("🔌 Environment (Jev)", "environment"),
      jevCategory("👀 Needs review (Jev)", "needs_review"),
      jevCategory("❔ Unclassified (no Jev)", "unclassified"),
    ],
  },
});
