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
