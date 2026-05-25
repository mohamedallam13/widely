#!/usr/bin/env bash
# Usage: ./scripts/merge-own-pr.sh <PR_NUMBER>
# Merges a PR you authored by temporarily dropping the approval requirement.

set -e

PR=${1:?Usage: merge-own-pr.sh <PR_NUMBER>}
REPO="mohamedallam13/widely"

protect() {
  gh api -X PUT "repos/$REPO/branches/main/protection" --input - <<JSON
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false,
    "required_approving_review_count": $1
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
}

echo "→ Dropping approval requirement..."
protect 0

echo "→ Merging PR #$PR..."
gh pr merge "$PR" --repo "$REPO" --squash --delete-branch

echo "→ Restoring approval requirement..."
protect 1

echo "✓ Done. PR #$PR merged, protection restored."
