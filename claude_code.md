# Claude code

Video: https://www.youtube.com/watch?v=amEUIuBKwvg
Guide: https://github.com/coleam00/context-engineering-intro/tree/main/claude-code-full-guide

## 1. Create and optimize Claude.md files

```bash
/init # instead of creating the file, we can simply have this
```

- Create a `CLAUDE.md`
- This is used in every conversation, it contains project-specific information, commands, and guidelines

### Tips

- `rg` (ripgrep) is faster than `grep` and `find` commands
- Ask it to follow TDD

```bash
# ❌ Don't use grep
grep -r "pattern" .

# ✅ Use rg instead
rg "pattern"

# ❌ Don't use find with name
find . -name "*.py"

# ✅ Use rg with file filtering
rg --files | rg "\.py$"
# or
rg --files -g "*.py"
```

- You can ask it about "what system instructions do you have?"
- We can have multiple `CLAUDE.md` at different levels of the repo
  - you can even have a "private" `CLAUDE.local.md`

#### File placement strategy

```bash
# Root of repository (most common)
./CLAUDE.md              # Checked into git, shared with team
./CLAUDE.local.md        # Local only, add to .gitignore

# Parent directories (for monorepos)
root/CLAUDE.md           # General project info
root/frontend/CLAUDE.md  # Frontend-specific context
root/backend/CLAUDE.md   # Backend-specific context

# Reference external files for flexibility
echo "Follow best practices in: ~/company/engineering-standards.md" > CLAUDE.md
```

## 2. Set up permission management

- Method 1: Configure it to streamline development while maintaining security for file operations and system commands

```bash
/permissions
```

- Method 2: Create a project settings file `.claude/settings.local.json`
