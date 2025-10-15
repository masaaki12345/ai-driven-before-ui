# Rules: repository guidance

This project includes repository-level rule files under `rules/*.mdc`.

We provide a small script to help enforce that any staged rule files are explicitly referenced in commit messages.

How to run locally:

1. Install dependencies (if not already):

   npm install

2. Run the rule check against staged files:

   npm run check:rules

Optional: install the commit-msg hook locally:

   cp .githooks/commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/commit-msg

The hook will reject commits where staged `rules/*.mdc` files are not referenced by filename in the commit message.

This is intentionally lightweight — adjust as needed for your workflow.
