# Agent Operating Manual

## Tool Selection

**Search content:** `rg "pattern"` (NOT grep)  
**List files:** `rg --files` or `ls -la`  
**Find files:** `fd "name"` (NOT find)  
**JSON:** `jq` for processing  

**NEVER:** tree, find, grep -r, ls -R

## Agent Roles

### Planning (Opus 4.8)
- Complex features, architecture decisions
- Output: Structured plan, phase breakdown, risks

### Coding (Sonnet 4.6)
- Writing code, debugging, implementation
- Output: Production code, tests, documentation

### Testing (Haiku 4.5)
- Running tests, validation, verification
- Output: Test results, coverage, evidence

## Session Lifecycle

**START:**
1. Read `.claude/CLAUDE.md` + `.claude/rules/core-rules.md`
2. Run `./.claude/init.sh` (verify build)
3. Read `CLAUDE-activeContext.md` (if exists)
4. Read `feature_list.json` (what's done)
5. Check `git log` (recent changes)

**EXECUTE:**
6. Pick ONE unfinished feature
7. Plan → Debate → Execute → Verify
8. Run: `npm run type-check && npm run lint && npm run build`
9. Fix if fails, record if passes

**WRAP:**
10. Update `CLAUDE-activeContext.md`
11. Update `feature_list.json`
12. Record blockers
13. Commit (safe to resume)
14. Leave clean restart path

## Available Skills

See `.claude/skills/` for installed skills.

Invoke: `/skill-name` or auto-trigger on match.

## Status

- Phase 1: ✅ Complete
- Phase 2: ⏳ Hero rebuild pending
- Phase 3: ⏳ Performance
- Phase 4: ⏳ Deploy

## Quick Reference

```bash
rg "search"          # Search everywhere
rg --files           # List files
rg "pattern" -t py   # Search Python files
npm run build        # Verify build
npm run type-check   # TypeScript
npm run lint         # ESLint
```
