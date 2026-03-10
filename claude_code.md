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

## 3. Custom slash commands

- Slash commands are the key to adding your own workflows into Claude Code
- They live in `.claude/commands/`, and allow us to create reusable, parameterized workflows

### Built-in

```bash
/init           # generate initial CLAUDE.md
/permissions    # manage tool permissions
/clear          # clear context between tasks
/agents         # manage subagents
/help
```

### Custom command example

- e.g. repository analysis
  - performs comprehensive repo analysis to prime Claude code on your codebase

```bash
/primer
```

#### Create it

1. create a md file in `.claude/commands/<command>.md`

```md
# Command: analyze-performance

Analyze the performance of the file specified in $ARGUMENTS.

## Steps:

1. Read the file at path: $ARGUMENTS
2. Identify performance bottlenecks
3. Suggest optimizations
4. Create a benchmark script
```

2. Use command

```bash
/analyze-performance src/heavy-computation.js
```

### Some examples

#### Project management & git

```bash
/commit # automatically stages changes and writes a conventional commit message
/review-pr # analyses a specific PR branch against the main branch and identifies potential bugs or logic flaws
/catchup  # used after a `/clear` command. re-scans the current `git diff` and uncommited changes to restore claude's memory
```

#### Code quality and standards

```bash
/simplify # refactoring command that looks for redundant logic, improves variable naming, increses readability
/rtfm # read the fucking manual
```

#### Testing and debugging

```bash
/test-gen # identifies functions without test coverage and generates unit tests for them
/debug [logs] # tajes piped log outputs or a specific error message and performs root-cause analysis
```

## 4. MCP Servers

- MCP [Model Context Protocol] is a "USB-C port" for AI
  - Standardizes how AI models connect to software, dbs, and local files
- Allows enhanced functionality
- Add Serena MCP Server, a very powerful coding toolkit

```bash
# Install Serena for semantic code analysis and editing
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)
```

```bash
claude mcp list # list all configured servers
claude mcp get serena # get details about a specific server
claude mcp remove serena # remove server
```

### Core Concepts

- MCP Server: small program that "exposes" specific tools or data to the AI
- Tools: actions the server can perform (e.g, `create_issue`, `search_files`, `execute_query`)
- Resources: data sources the AI can read (e.g. specific log files, db table, documentation page)
- Transports: how the client and server talk

### Most useful MCPs

#### Essential development

- Github server
- PostgreSQL / MySQL / Supabase / Firebase: allows claude inspect your database schema and run safe read-only queries to understand your data model
- Docker toolkit: enables claude to spawn isolated containers to run your code, execute tests, and debug environment-specific issues without touching host machine

#### Search and research

- Brave search / tavily: gives claude "live" internet access to look up the latest API documentation
- Fetch: simple, but powerful server that converts any website into markdown, allowing claude to read documentation pages you link to

### How to add them to claude code

```bash
claude mcp add [name] [command]
```
