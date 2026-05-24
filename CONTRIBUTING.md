# Contributing to Widely

All changes to `main` go through a pull request. Direct pushes are blocked.

---

## Workflow

### 1. Create a feature branch

```bash
git checkout -b feat/your-feature-name
# or: fix/bug-name, chore/task-name
```

### 2. Make your changes & commit

```bash
git add .
git commit -m "feat: describe what this does"
```

### 3. Push the branch

```bash
git push origin feat/your-feature-name
```

### 4. Open a PR

```bash
gh pr create --title "feat: your title" --body "What this does and why"
```

Or open it in the browser:
```bash
gh pr create --web
```

### 5. Approve & merge

```bash
# Approve (required — 1 approval enforced on main)
gh pr review --approve

# Merge (squash recommended to keep history clean)
gh pr merge --squash --delete-branch
```

---

## Branch naming

| Prefix | Use for |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Maintenance, deps, config |
| `docs/` | Documentation only |
| `refactor/` | Code restructure, no behavior change |

---

## Rules

- `main` is protected — no force pushes, no direct commits
- Every PR needs 1 approval before merging
- Delete the branch after merge (`--delete-branch` does this automatically)
