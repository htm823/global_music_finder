#!/bin/bash

chmod +x .github/hooks/*

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