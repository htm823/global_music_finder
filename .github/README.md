# GitHub Workflow Automation Setup Guide

## Overview

This guide establishes an automated development workflow from Issue creation through branch generation, commits, PRs, and merging.

### Features

-   **Issue Creation → Automatic Branch Generation**
-   **Automatic Type Label Addition to Commit Messages** (`feat:`, `fix:`, etc.)
-   **Automatic PR Formatting**
-   **Automatic Issue Closure on Merge**

---

## 1. Creating Issue Labels

### Label List (Pastel Colours)

Create the following in your GitHub repository under **Issues** → **Labels**:

| Name       | Description                                | Colour    | Purpose             |
| ---------- | ------------------------------------------ | --------- | ------------------- |
| `feat`     | New feature                                | `#C5CAE9` | New features        |
| `fix`      | Bug fix, feature updates, and improvements | `#F8BBD0` | Bug fixes & updates |
| `docs`     | Documentation changes                      | `#B2DFDB` | Documentation       |
| `bugfix`   | Critical bug fix                           | `#FFCCBC` | Critical bug fixes  |
| `refactor` | Code refactoring                           | `#E1BEE7` | Refactoring         |

### Bulk Creation with GitHub CLI

```bash
gh label create "feat" --description "New feature" --color "C5CAE9" --force
gh label create "fix" --description "Bug fix, feature updates, and improvements" --color "F8BBD0" --force
gh label create "docs" --description "Documentation changes" --color "B2DFDB" --force
gh label create "bugfix" --description "Critical bug fix" --color "FFCCBC" --force
gh label create "refactor" --description "Code refactoring" --color "E1BEE7" --force
```

---

## 2. Creating Issue Templates

### Directory Structure

```
.github/
└── ISSUE_TEMPLATE/
    ├── config.yml
    ├── feature.yml
    ├── fix.yml
    ├── bugfix.yml
    ├── documentation.yml
    └── refactor.yml
```

### Template Example (Feature)

Create `.github/ISSUE_TEMPLATE/feature.yml`:

```yaml
name: Feature
description: Suggest a new feature for this project
title: 'Feat: '
labels: ['feat']
body:
    - type: textarea
      id: overview
      attributes:
          label: Overview
          description: What feature would you like to see?
          placeholder: Describe the feature and why it's needed
      validations:
          required: true

    - type: textarea
      id: tasks
      attributes:
          label: Tasks
          description: What needs to be done?
          placeholder: |
              -
              -
      validations:
          required: true
```

**Note**: Using `title: 'Feat: '` with an initial capital ensures consistent Issue titles.

Create similar templates for `fix.yml`, `bugfix.yml`, `documentation.yml`, and `refactor.yml`, adjusting the `title` and `labels` accordingly.

---

## 3. Creating GitHub Actions Workflows

### Directory Structure

```
.github/
└── workflows/
    ├── create-branch-from-issue.yml
    ├── create-pr-template.yml
    └── auto-merge-title.yml
```

### 3-1. Automatic Branch Creation from Issues

Create `.github/workflows/create-branch-from-issue.yml`:

```yaml
name: Create Branch from Issue

on:
    issues:
        types: [opened, labeled]

jobs:
    create-branch:
        runs-on: ubuntu-latest
        permissions:
            contents: write
            issues: write
        if: contains(github.event.issue.labels.*.name, 'feat') || contains(github.event.issue.labels.*.name, 'fix') || contains(github.event.issue.labels.*.name, 'docs') || contains(github.event.issue.labels.*.name, 'bugfix') || contains(github.event.issue.labels.*.name, 'refactor')

        steps:
            - name: Checkout repository
              uses: actions/checkout@v4
              with:
                  fetch-depth: 0
                  token: ${{ secrets.GITHUB_TOKEN }}

            - name: Determine branch type
              id: branch-type
              run: |
                  LABELS="${{ join(github.event.issue.labels.*.name, ',') }}"

                  if echo "$LABELS" | grep -q "feat"; then
                    echo "type=feat" >> $GITHUB_OUTPUT
                  elif echo "$LABELS" | grep -q "bugfix"; then
                    echo "type=bugfix" >> $GITHUB_OUTPUT
                  elif echo "$LABELS" | grep -q "fix"; then
                    echo "type=fix" >> $GITHUB_OUTPUT
                  elif echo "$LABELS" | grep -q "docs"; then
                    echo "type=docs" >> $GITHUB_OUTPUT
                  elif echo "$LABELS" | grep -q "refactor"; then
                    echo "type=refactor" >> $GITHUB_OUTPUT
                  else
                    echo "type=feat" >> $GITHUB_OUTPUT
                  fi

            - name: Create branch name
              id: branch-name
              run: |
                  ISSUE_NUMBER=${{ github.event.issue.number }}
                  ISSUE_TITLE="${{ github.event.issue.title }}"
                  BRANCH_TYPE="${{ steps.branch-type.outputs.type }}"

                  # Remove type prefix (Feat:, Fix:, etc.) from title
                  ISSUE_TITLE=$(echo "$ISSUE_TITLE" | sed -E 's/^(Feat|Fix|Docs|Bugfix|Refactor):\s*//')

                  # Convert title to kebab-case
                  BRANCH_SUFFIX=$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | cut -c1-50)

                  BRANCH_NAME="${BRANCH_TYPE}/#${ISSUE_NUMBER}_${BRANCH_SUFFIX}"
                  echo "name=${BRANCH_NAME}" >> $GITHUB_OUTPUT

            - name: Check if branch exists
              id: check-branch
              run: |
                  if git ls-remote --heads origin "${{ steps.branch-name.outputs.name }}" | grep -q "${{ steps.branch-name.outputs.name }}"; then
                    echo "exists=true" >> $GITHUB_OUTPUT
                  else
                    echo "exists=false" >> $GITHUB_OUTPUT
                  fi

            - name: Create branch
              if: steps.check-branch.outputs.exists == 'false'
              run: |
                  git config user.name "github-actions[bot]"
                  git config user.email "github-actions[bot]@users.noreply.github.com"
                  git checkout -b "${{ steps.branch-name.outputs.name }}"
                  git push origin "${{ steps.branch-name.outputs.name }}"

            - name: Comment on issue
              if: steps.check-branch.outputs.exists == 'false'
              uses: actions/github-script@v7
              with:
                  script: |
                      github.rest.issues.createComment({
                        issue_number: context.issue.number,
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        body: `🎉 Branch created: \`${{ steps.branch-name.outputs.name }}\`\n\n### Next steps:\n1. Check out the branch locally:\n\`\`\`bash\ngit fetch origin\ngit checkout "${{ steps.branch-name.outputs.name }}"\n\`\`\`\n2. Make your changes\n3. Commit: \`git commit -m "your message"\` (type will be auto-added!)\n4. Push: \`git push origin "${{ steps.branch-name.outputs.name }}"\`\n5. Create a Pull Request`
                      })
```

**Generated Branch Name Example**:

-   Issue Title: `Feat: add user authentication`
-   Branch Name: `feat/#5_add-user-authentication`

### 3-2. Automatic PR Formatting

Create `.github/workflows/create-pr-template.yml`:

```yaml
name: PR Template Assistant

on:
    pull_request:
        types: [opened]

jobs:
    update-pr-description:
        runs-on: ubuntu-latest
        permissions:
            pull-requests: write
            contents: read

        steps:
            - name: Checkout repository
              uses: actions/checkout@v4

            - name: Extract branch type
              id: extract
              run: |
                  BRANCH="${{ github.head_ref }}"

                  # Extract type (feat, fix, etc.)
                  TYPE=$(echo "$BRANCH" | grep -oP '^[a-z]+' || echo "feat")
                  echo "type=${TYPE}" >> $GITHUB_OUTPUT

                  # Extract issue number
                  ISSUE_NUM=$(echo "$BRANCH" | grep -oP '#\K[0-9]+' || echo "")
                  echo "issue=${ISSUE_NUM}" >> $GITHUB_OUTPUT

            - name: Update PR title and description
              uses: actions/github-script@v7
              with:
                  script: |
                      const type         = '${{ steps.extract.outputs.type }}';
                      const issueNum     = '${{ steps.extract.outputs.issue }}';
                      const currentTitle = context.payload.pull_request.title;

                      // Remove existing type prefix first
                      const cleanTitle = currentTitle.replace(/^(feat|fix|docs|bugfix|refactor):\s*/, '');

                      // Generate PR title with type prefix
                      const newTitle = `${type}: ${cleanTitle}`;

                      // Generate PR body
                      let body = `### What's new\n`;

                      if (issueNum) {
                        body += `- Closes #${issueNum}\n`;
                      } else {
                        body += `- \n`;
                      }

                      // Update PR
                      await github.rest.pulls.update({
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        pull_number: context.payload.pull_request.number,
                        title: newTitle,
                        body: body
                      });
```

**Auto-generated PR**:

-   Title: `feat: add user authentication`
-   Body:

```markdown
### What's new

-   Closes #5
```

### 3-3. Automatic Merge Title Formatting

Create `.github/workflows/auto-merge-title.yml`:

```yaml
name: Auto-format Merge Commit

on:
    pull_request:
        types: [closed]

jobs:
    format-merge:
        if: github.event.pull_request.merged == true
        runs-on: ubuntu-latest
        permissions:
            issues: write
            pull-requests: write

        steps:
            - name: Add merge comment
              uses: actions/github-script@v7
              with:
                  script: |
                      const fullTitle  = context.payload.pull_request.title;
                      const prTitle    = fullTitle.replace(/^(feat|fix|docs|bugfix|refactor):\s*/, '');
                      const mergeTitle = `Merge: ${prTitle}`;

                      await github.rest.issues.createComment({
                        issue_number: context.payload.pull_request.number,
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        body: `🎉 **Merged successfully**\n\nMerge commit title: \`${mergeTitle}\``
                      });
```

**Merge Title Example**:

-   PR Title: `feat: add user authentication`
-   Merge Title: `Merge: add user authentication`

---

## 4. GitHub Repository Settings

### Settings → Actions → General

1. **Actions permissions**: Select `Allow all actions and reusable workflows`
2. **Workflow permissions**:
    - ✅ Select `Read and write permissions`
    - ✅ Tick `Allow GitHub Actions to create and approve pull requests`

Without these settings, workflows will not function properly.

---

## 5. Automatic Commit Message Labelling (Local Environment)

### 5-1. File Structure

```
.github/
├── hooks/
│   ├── prepare-commit-msg
│   └── commit-msg
├── COMMIT_TEMPLATE.txt
└── (setup.sh in project root)
```

### 5-2. prepare-commit-msg

Create `.github/hooks/prepare-commit-msg`:

```bash
#!/bin/bash

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# Get the current branch name
BRANCH_NAME=$(git symbolic-ref --short HEAD 2>/dev/null)

# Skip if this is a merge commit or amend
if [ "$COMMIT_SOURCE" = "merge" ] || [ "$COMMIT_SOURCE" = "commit" ]; then
    exit 0
fi

# Extract type from branch name (e.g., feat/#123_branch-name -> feat)
if [[ $BRANCH_NAME =~ ^(feat|fix|docs|bugfix|refactor)/ ]]; then
    TYPE="${BASH_REMATCH[1]}"

    # Read the current commit message
    CURRENT_MSG=$(cat "$COMMIT_MSG_FILE")

    # Check if message already has a type prefix
    if [[ ! $CURRENT_MSG =~ ^(feat|fix|docs|bugfix|refactor): ]]; then
        # Prepend the type to the commit message
        echo "${TYPE}: ${CURRENT_MSG}" > "$COMMIT_MSG_FILE"
    fi
fi
```

### 5-3. commit-msg

Create `.github/hooks/commit-msg`:

```bash
#!/bin/bash

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Define valid types
VALID_TYPES="feat|fix|docs|bugfix|refactor"

# Check if commit message follows the format
if [[ ! $COMMIT_MSG =~ ^($VALID_TYPES):.+ ]]; then
    echo "❌ Error: Commit message must start with a valid type"
    echo ""
    echo "Valid types: feat, fix, docs, bugfix, refactor"
    echo "Format: <type>: <description>"
    echo ""
    echo "Examples:"
    echo "  feat: add user authentication"
    echo "  fix: resolve login redirect issue"
    echo "  bugfix: correct calculation in payment module"
    echo ""
    exit 1
fi

# Check message length (subject line should be under 72 characters)
SUBJECT_LINE=$(echo "$COMMIT_MSG" | head -n1)
if [ ${#SUBJECT_LINE} -gt 72 ]; then
    echo "⚠️  Warning: Subject line is longer than 72 characters"
    echo "Current length: ${#SUBJECT_LINE}"
    echo ""
fi

exit 0
```

### 5-4. COMMIT_TEMPLATE.txt

Create `.github/COMMIT_TEMPLATE.txt`:

```
# <type>: <subject>
#
# Types:
# feat: New feature
# fix: Bug fix (non-breaking)
# docs: Documentation changes
# bugfix: Bug fix
# refactor: Code refactoring
#
# Example: feat: add user authentication
#
# Keep the subject line under 50 characters
# Use imperative mood (e.g., "add" not "added" or "adds")
```

### 5-5. setup.sh

Create `setup.sh` in the project root:

```bash
#!/bin/bash

set -e

echo "========================================="
echo "🚀 Git Workflow Automation Setup"
echo "========================================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Set hooks path
echo "📁 Configuring Git hooks path..."
git config core.hooksPath .github/hooks

# Make all hooks executable
echo "🔧 Setting executable permissions on hooks..."
find .github/hooks -type f -exec chmod +x {} \;

# Set commit template
echo "📝 Configuring commit message template..."
git config commit.template .github/COMMIT_TEMPLATE.txt

echo ""
echo "========================================="
echo "✅ Setup completed successfully!"
echo "========================================="
echo ""
echo "📖 Quick Guide:"
echo ""
echo "1️⃣  Create an Issue with a label (feat/fix/docs/bugfix/refactor)"
echo "2️⃣  Branch is auto-created by GitHub Actions"
echo "3️⃣  Checkout: git checkout feat/#123_branch-name"
echo "4️⃣  Commit: git commit -m 'your message' (type auto-added!)"
echo "5️⃣  Push: git push origin feat/#123_branch-name"
echo ""
echo "🎯 Example:"
echo "  Branch: feat/#42_add-login"
echo "  You write: git commit -m 'add user authentication'"
echo "  Result: 'feat: add user authentication'"
echo ""
```

Grant execution permissions:

```bash
chmod +x setup.sh
```

### 5-6. Each Developer Runs Locally

After cloning the repository, run once:

```bash
./setup.sh
```

This enables automatic type label addition to commits.

---

## 6. PR Template (Optional)

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
### What's new

-
-

### Related Issue

Closes #
```

---

## 7. Workflow Usage

### Complete Development Flow

1. **Create Issue**

    - Create a new Issue on GitHub
    - Title: `Feat: add user authentication`
    - Label: Select `feat`
    - Submit

2. **Automatic Branch Generation**

    - GitHub Actions runs automatically
    - Branch `feat/#5_add-user-authentication` is created
    - Comment is added to the Issue

3. **Local Work**

```bash
   git fetch origin
   git checkout "feat/#5_add-user-authentication"

   # Make changes
   echo "code" > auth.js
   git add auth.js

   # Commit (type is auto-added)
   git commit -m "add JWT token validation"
   # Actual commit: "feat: add JWT token validation"

   git push origin "feat/#5_add-user-authentication"
```

4. **Create PR**

    - Create PR on GitHub
    - Title and description are auto-formatted
    - Title: `feat: add user authentication`
    - Body: `Closes #5`

5. **Merge**
    - Merge the PR
    - Merge comment is auto-added: `Merge: add user authentication`
    - Issue #5 is automatically closed

---

## Summary

This workflow automates:

✅ Issue → Automatic Branch Generation  
✅ Automatic Type Label Addition to Commit Messages  
✅ Automatic PR Formatting  
✅ Automatic Issue Closure on Merge

This establishes a consistent development workflow across the entire team.
