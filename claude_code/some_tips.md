# 50 tips

https://www.youtube.com/watch?v=mZzhfPle9QU

## Foundations

1. Run from root

- Run from your project's root directory
- It works better when it can your whole project structure

2. Run `/init` immediately

- Creates a CLAUDE.md file
- Claude's long-term memory

```bash
/init  # to start `CLAUDE.md`
```

3. CLAUDE.md is hierarchical

```bash
~/.claude/CLAUDE.md # global
./CLAUDE.md # project level
# subdirectory for module rules
# most specific wins
```

```bash
/memory # to check the memory
```

4. Keep CLAUDE.md concise

- It gets prepended to every prompt
- Bloated eats context window and degrades performance
- Around 300 lines is good

5. Structure: What, Domain, Validation

- What = tech stack
- Domain context = what each part does
- Validation steps = tests, linters, type checkers
  - it's important to allow the AI to fix itself, meaning the could should "compile" and "run"

## Keyboard shortcuts

6. Shift + tab: toggles modes

- Normal, auto-accept, and plan mode
- Plan mode is where you naturally should be most of the time

7. Escape interrupts

- If the thinking starts to go off-rails, stop it

8. Double escape clears input

## Essential commands

```bash
@ # file
/btw # side question
ctrl + o # verbose output
/clear
/context # shows the current context that claude code is using to make assumptions
/compact
/model
/resume # recovers your session
/mcp # they eat tokens. every tool adds weight. be selective. project-scope over global
/help
```

9. Git is your safety net

## `CLAUDE.md` deep dive

10. Add a critical rule section

- Priority of top to bottom
- Never do this, but always do this

11. Ask claude to update the rules
12. Use workflow triggers
13. Commit `CLAUDE.md` to git

- Be mindful of the size of this file

14. Combine skip with allowlists

## Daily workflow

15. Start features in plan mode
16. Fresh context beats bloated context
17. Lazy load context.

- Index at root pointing to subdirectory docs. Claude code loads details when needed

18. Read thinking blocks

- Identify "I'm not sure..." , or "I assume.."

## Power use

19. There are 4 composable primitives

- Skills, Commands, MCPs and subagents

20. Skills = recurring workflow

- Templates that load context when triggered
- Lazy loaded. Don't eat tokens until needed

21. Commands = quick shorthand

22. Don't create commands manually

- Let claude manage the file structure

23. External service docs

- Not just API connections
- Structured documentation for databases, browsers, systems

24. Subagents = isolated contexts

- Good for parallel work and context management
- Things that are atomic in nature

25. Avoid instruction overload

- Context is best served fresh and condensed

## Advanced

26. Run multiple instances

- Different terminals, different tasks
- Not shared context

27. iTerm split panes
28. Enable notifications
29. Git worktrees for isolation

- Multiple claude instances, same repo, isolated files

30. Powerful for debugging

## Hooks & Automation

31. Explore the plugin ecosystem
