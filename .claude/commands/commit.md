---
description: Commit changes with appropriate granularity
allowed-tools:
  - Bash(git add:*)
  - Bash(git commit:*)
  - Bash(git diff:*)
  - Bash(git log:*)
  - Bash(git status:*)
---

## Appropriate Commit Granularity

### Basic Principles

- Include only one logical change per commit
- Group related changes together, separate unrelated changes
- Ensure commit messages clearly convey the scope of changes

### Good Commit Examples

- ✅ Single feature addition: `feat: add new portfolio project to works collection`
- ✅ Single bug fix: `fix: resolve grainy gradient animation lag`
- ✅ Related refactoring: `refactor: optimize Three.js effects performance`

### Commits to Avoid

- ❌ Multiple unrelated changes: `feat: add new work entry, fix footer styling, refactor GLSL shaders`
- ❌ Changes too large: `feat: implement entire portfolio redesign`
- ❌ Changes too small: `fix: typo correction` (group multiple typos together)

### Commit Splitting Criteria

1. **Functional Independence**: Can it work without other changes?
2. **Review Ease**: Is the diff a manageable size for review?
3. **History Traceability**: Can specific changes be easily found later?

### Execution Example

```bash
# Check current changes
git status
git diff

# Stage only related changes for new work entry
git add src/content/works/new-project/index.md
git add src/content/works/new-project/cover.png

# Commit with descriptive message
git commit -m "feat: add new portfolio project

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"

# Separate commit for component changes
git add src/components/Footer.astro
git commit -m "refactor: update footer component styling

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"
```
