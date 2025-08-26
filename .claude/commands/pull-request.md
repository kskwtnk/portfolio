---
description: Create or update pull request with appropriate process and template adherence
argument-hint: [pull-request-number] (optional - if provided, updates existing pull request)
allowed-tools:
  - Bash(gh pr create:*)
  - Bash(gh pr edit:*)
  - Bash(gh pr view:*)
  - Bash(gh pr list:*)
  - Bash(git branch:*)
  - Bash(git checkout:*)
  - Bash(git diff:*)
  - Bash(git log:*)
  - Bash(git push:*)
  - Bash(git status:*)
---

## Pull Request Management Process

### Command Usage

- **Create new pull request**: `/pull-request`
- **Update existing pull request**: `/pull-request [number]`
  - Example: `/pull-request 123` to update pull request #123
  - The command will use `$ARGUMENTS` to identify the pull request number

### Basic Principles

- Always review changes before creating or updating pull request
- Follow the project's pull request template format
- Use descriptive titles and clear implementation summaries
- Ensure branch is properly pushed to remote before pull request operations
- When updating existing pull requests, compare current changes with pull request content

### Good Pull Request Examples

- ✅ Clear title: `feat: Claude Code設定の改善とカスタムコマンド追加`
- ✅ Structured body following template with "Implemented" and "Screenshots" sections
- ✅ Logical commit grouping with meaningful commit messages
- ✅ Appropriate use of Japanese for user-facing content

### Pull Requests to Avoid

- ❌ Vague titles: `fix stuff`, `update files`
- ❌ Empty or minimal descriptions without following template
- ❌ Mixed unrelated changes across multiple features
- ❌ Missing branch push or incorrect base/head specification

### Pull Request Management Criteria

1. **Change Completeness**: Are all related changes included and working?
2. **Template Compliance**: Does the pull request body follow the established template?
3. **Commit Quality**: Are commits well-structured and appropriately granular?
4. **Branch State**: Is the branch properly pushed and trackable?
5. **Content Accuracy**: For updates, does the pull request description reflect all current changes?

### Execution Examples

#### Creating New Pull Request

```bash
# Review current state
git status
git diff main...current-branch

# Check commit history
git log --oneline main..current-branch

# Ensure branch is pushed
git push -u origin feature-branch

# Create pull request following template
gh pr create --base main --head feature-branch \
  --title "feat: descriptive title in Japanese" \
  --body "# Implemented

- Feature 1 description
- Feature 2 description
- Configuration changes

# Screenshots

> [!NOTE]
> No screenshots attached as there is no change in appearance"

# Verify pull request creation
gh pr list --head feature-branch
```

#### Updating Existing Pull Request

When `$ARGUMENTS` is provided (e.g., `/pull-request 123`):

```bash
# Review existing pull request content using $ARGUMENTS
gh pr view $ARGUMENTS --json title,body

# Check current changes vs pull request base
git log --oneline origin/main..HEAD
git diff origin/main...HEAD

# Update pull request with new changes using $ARGUMENTS
gh pr edit $ARGUMENTS --title "feat: updated title with new changes" \
  --body "# Implemented

- Original feature 1
- Original feature 2
- Additional feature 3
- Configuration improvements

# Screenshots

> [!NOTE]
> No screenshots attached as there is no change in appearance"
```
