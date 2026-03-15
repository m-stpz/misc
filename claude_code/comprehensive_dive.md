# Full course

https://www.youtube.com/watch?v=QoQBzR1NIqI

## Cool resources

- https://godly.website/: Has a bunch of really great websites
  - To take a screenshot of the website, open the dev tools
  - Make it full screen
  - CMD + SHIFT + P: take screenshot
  - You can then feed this into claude code
  - Also copy styles
- https://wisprflow.ai/: Allows speech in a correct manner, correcting grammar and punctuation
  - We can build this locally for free
- https://21st.dev/home: Cool components

- Good loop
  - Set the task
  - Do the task
  - Verify its results

## `.claude` directory

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

1. `CLAUDE.md`: project manifesto
   1.1 Build/test commands
   1.2 Style guidelines
   1.3 Architecture notes

2. `commands/`: workflow shortcuts

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

3. `agents/`: specialized workforce

- The auditor: finds flaws. can't write, only read
- The librarian: only has access to `@docs` folder and external mcp tools. Answers "how do I...?"
- The refactor: used to refactor complex logic
