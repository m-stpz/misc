# Full course

https://www.youtube.com/watch?v=QoQBzR1NIqI

## 1. Cool resources

- https://godly.website/: Has a bunch of really great websites
  - To take a screenshot of the website, open the dev tools
  - Make it full screen
  - CMD + SHIFT + P: take screenshot
  - You can then feed this into claude code
  - Also copy styles
- https://wisprflow.ai/: Allows speech in a correct manner, correcting grammar and punctuation
  - We can build this locally for free
- https://21st.dev/home: Cool components
- https://github.com/hesreallyhim/awesome-claude-code: curated list of stuff related with claude

### Google new AI tools

https://shard-vole-c98.notion.site/List-of-Google-s-AI-Coding-Tools-2d27f8611d9f80ec94aec0d786c91346

- Antigrativity: google's IDE
- Google AI studio: generate prototypes quickly
- Stitch: UI/design tool
- Opal: n8n + lovable
- Jules: experimental coding agent
- Code wiki: documentation and self-explanaratory codebase
- Gemini CLI: similar to claude code
- Gemini canvas: shared visual space to brainstorm, code, and create with gemini models
- Data science agent that automates data cleaning, analysis, and visual charting
- Firebase studio: A visual, AI-boosted cockpit for managing backend data and cloud logic

## 2. `.claude` directory

- `.claude` has a project-scoped and a global-scope folder

`.claudeignore`: place it in your project root, then claude won't read those paths. Hugely important!

    - Claude already respects `.gitignore` by default, so you only need it for things that aren't in `gitignore`

```
~/.claude/                          # User-level (applies to ALL projects)
├── settings.json                   # Global settings & permissions
├── CLAUDE.md                       # Personal instructions for all projects
├── keybindings.json                # Custom keyboard shortcuts
├── projects/                       # Auto-memory storage (auto-generated)
│   └── <project-hash>/memory/
├── rules/                          # Scoped instruction files
│   ├── code-style.md
│   └── security.md
├── skills/                         # Personal slash commands
│   └── deploy/SKILL.md
├── agents/                         # Custom subagents
│   └── code-reviewer/agent.md
└── hooks/                          # Hook scripts
    ├── validate-bash.sh
    └── auto-format.py

your-project/.claude/               # Project-level (team-shared in git)
├── settings.json                   # Project permissions & hooks
├── settings.local.json             # Personal settings
├── CLAUDE.md                       # Project instructions
├── CLAUDE.local.md                 # Personal project notes
├── rules/                          # Path-scoped rules
├── skills/                         # Project-specific commands
└── agents/
```

### 1. `CLAUDE.md`: project manifesto

1.1 Build/test commands
1.2 Style guidelines
1.3 Architecture notes

### 2. `commands/`: workflow shortcuts

- Turn repetitive tasks into single slash commands

```bash
# examples

# debug.md
/debug # a command that pipes the last 50 lines of a log file into claude and asks for a root-cause analysis

# pr-prep.md
/pr-prep # automatically runs tests, checks linting, generates PR descriptions

# onboard
/onboard # a command for new devs that explains folder structure and setups local environment variables
```

### 3. `agents/`: specialized workforce

- The auditor: finds flaws. can't write, only read
- The librarian: only has access to `@docs` folder and external mcp tools. Answers "how do I...?"
- The refactor: used to refactor complex logic

### 4. `rules/`: scoped rules

- Break instructions into focused topic files, instead of one monolithic CLAUDE.md
- Designed for modular, path-specific, or domain-specific guidelines

```
.claude/rules/               # Project-level (team-shared in git)
├── code-style.md
├── testing.md
├── security.md
├── frontend/
    ├── react.md
    ├── styles.md
```

- Idea is to keep main `CLAUDE.md` under 200 lines

#### Core concepts

1. Scoped application: the path matcher

> Note: As of 2026, many teams use a rules.json or YAML-based frontmatter in their rule files to tell Claude: "Apply this rule only when editing files matching `src/components/*.tsx.`"

2. Topic specific modularity

Instead of one massive file, split the concerns so Claude only reads what's relevant to the task at hand. Ex:

- Architectural rules
- Language-specific rules
- Infrastructure rules

3. The `@` import system

- We can keep `CLAUDE.md` clean by importing the rules as needed

```md
# Project's CLAUDE.md

@./.claude/rules/testing.md
@./.claude/rules/styling.md
```

#### Common examples

1. `testing-conventions.md`: prevents claude from guessing how to write tests
   - Rule: use vitest over jest
   - Rule: mock the db using the `test-db-utils` helper
   - Rule: Every new feature requires a corresponding integration test in `tests/e2e/`

2. `ui-library-standards`: essential for frontend projects to ensure visual consistency
   - Rule: use only components from...
   - Rule: never use arbitrary Tailwind values (e.g, `w-[123px]`); use standard tokens
   - Rule: components must be exported as named exports, not defaults

## 3. Do's and Don'ts

### Do

- Run `/init` first
- Use bullet points & short headings
- Put most important guardrails at the top
- Version-control the root CLAUDE.md
- Periodically review & prune (treat it like living code)
- Leverage the prompt/remembrance ratio:
  - Beginning and end prompt are high-value real-state
    - Primacy bias
    - Recency bias
    - Human-beings are also like this
  - Middle, not so much

### Don't

- Dump entire style guides / API docs into it
- @-include huge files unless absolutely necessary
- Write vague / aspirational rules
- Make it > 500 lines without splitting

## 4. Memory

- Location: `~/.claude/projects/<project-hash>/memory/MEMORY.md`
- First 200 lines loaded into system prompt at session start
- Claude reads and writes during the session
  - Debugging insights, patterns, preferences
- Separate from CLAUDE.md, this is claude's own notes, not your instructions

## 5. Prompt structure

- Follows the pattern of layered-memories

```
=== 1. SYSTEM PROMPT (Fixed) ===
- Anthropic's "Tengu" instructions (safety, tool usage, conciseness rules)
- Global rules (~/.claude/CLAUDE.md)

=== 2. CONTEXT INJECTION (Automatic) ===
- Project-level rules (./CLAUDE.md or ./.claude/CLAUDE.md)
- Path-specific rules (./.claude/rules/*.md)
- Auto-Memory (The first ~200 lines of MEMORY.md)

=== 3. USER INTERACTION ===
└── your prompt (plus @references or piped data)
```

## 6. Context-management

- Basically, handling tokens in a prompt as effectively as possible
- To check your context:

```bash
/context
```

- Output

```txt
Context Usage
Model: claude-sonnet-4-6

Tokens: 15.2k / 200k (8%)

Estimated usage by category
Category	Tokens	Percentage
System prompt	6.3k	3.1%
System tools	8.5k	4.2%
System tools (deferred)	9.7k	4.9%
Skills	410	0.2%
Messages	8	0.0%
Free space	151.8k	75.9%
Autocompact buffer	33k	16.5%
Skills
Skill	Source	Tokens
update-config	undefined	173
keybindings-help	undefined	61
simplify	undefined	23
loop	undefined	77
claude-api	undefined	76
```

### Understanding this output

- System prompt: CLAUDE.md + rules
- Sytems tools: bash, websocket, create-plan
- MCP Tools: tools that we've added
- Memory files: MEMORY.md
- Skills
- Messages: the prompts we added
- Aim to keep CLAUDE.md under ~500 lines by including only essentials

### Work efficiently on complex tasks

- Use plan mode
- Course-correct early
  - Press escape to stop immediately
  - `/rewind` or double-tap Escape to restore conversation and code to previous checkpoint
- Give verification targets
  - Test cases, screenshots or define expected output
- Test incrementally
