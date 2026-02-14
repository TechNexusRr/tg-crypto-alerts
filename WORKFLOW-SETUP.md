# Development Workflow Setup

## Single Source of Truth: Story Writer Workflow

This project uses **Story Writer workflow** for all feature development. No other workflows.

```
Your Idea
   ↓
Story Writer (creates user story)
   ↓
Saved to: user-stories/US-XX-kebab-case.md
   ↓
Plan Skeptic (validates story)
   ↓
Coder (implements)
   ↓
Code Reviewer (reviews code)
   ↓
QA (tests)
   ↓
Feature Complete ✅
```

## The Story Writer Agent

**Location**: `agents/prompts/story-writer.md`

**What it does**: Transforms your feature idea into a structured user story

**How to use**:
1. Copy `agents/prompts/story-writer.md`
2. Paste into Claude.com
3. Describe your feature idea
4. Get back a perfectly formatted user story
5. Save to `user-stories/US-XX-kebab-case.md`

## MANDATORY TEMPLATE

Every user story **MUST** follow this structure exactly:

```markdown
# US-[ID]: [Feature Name]

## Workflow
[Status table]

## Description
[1-2 paragraphs]

## User Stories
[3-5 items in "As a user... so that..." format]

## Command / API
[How users interact]

## Acceptance Criteria
[5-8 testable checkboxes]

## Depends On
[Prerequisites]

## Notes
[Additional context]
```

### Strict Compliance Rules

**MANDATORY** (every story must have):
- ✅ All 8 sections (Workflow, Description, User Stories, Command/API, Acceptance Criteria, Depends On, Notes)
- ✅ Sections in exact order
- ✅ ID format: `US-XX` (e.g., US-08, US-09)
- ✅ 3-5 user stories (each with "As a user..." and "so that...")
- ✅ 5-8 acceptance criteria (all testable with checkboxes)
- ✅ Filename: `user-stories/US-XX-kebab-case.md`

**FORBIDDEN** (never do these):
- ❌ Custom sections (no "Implementation", "Architecture", "Technical Notes", etc.)
- ❌ Change section order
- ❌ Skip sections
- ❌ Use different ID formats
- ❌ Use different filename patterns
- ❌ User stories without "so that" clauses
- ❌ Vague acceptance criteria ("should work", "should be fast")

## Story ID Management

### Current Story IDs in Use
```
US-00: Bootstrap
US-01: Price Movement Alerts
US-02: Alert Management
US-03: Symbol Discovery
US-04: System Health
US-05: Price Threshold Alerts (future)
US-06: Percent Change Alerts (future)
US-07: Price Watch / Ticks (future)
```

### Next Available ID
**US-08** — Use this for the next new feature

### ID Rules
- Always format as `US-XX` (leading zero: US-08, not US-8)
- Never skip numbers (if last is US-07, next is US-08)
- Never reuse IDs
- Always increment by 1

## File Organization

### Story Files Location
```
user-stories/
├── US-00-bootstrap.md
├── US-01-price-movement-alerts.md
├── US-02-alert-management.md
├── US-03-symbol-discovery.md
├── US-04-system-health.md
├── US-05-price-threshold-alerts.md
├── US-06-percent-change-alerts.md
├── US-07-price-watch-ticks-future.md
└── [New stories go here with US-08+]
```

**RULE**: Never delete existing stories. Only add new ones.

### Filename Format

**CORRECT**:
- `user-stories/US-08-reactivate-alerts.md`
- `user-stories/US-09-email-notifications.md`
- `user-stories/US-10-advanced-filtering.md`

**INCORRECT** (will be rejected):
- `user-stories/08-reactivate-alerts.md` (missing US-)
- `user-stories/US-8-reactivate-alerts.md` (no leading zero)
- `user-stories/US_08_reactivate_alerts.md` (underscores instead of hyphens)
- `user-stories/ReactivateAlerts.md` (no ID, wrong case)

## How to Create a New Story

### Step 1: Have a Feature Idea

Example: "Allow users to reactivate threshold alerts that have already fired"

### Step 2: Use Story Writer

```
1. Open Claude.com
2. Paste agents/prompts/story-writer.md
3. Provide your idea:
   Feature/Idea: Users should reactivate fired threshold alerts
   Context: Threshold alerts are one-shot and deactivate after firing
   Constraints: Should reset trigger state and log changes
```

### Step 3: Get Perfect Story

Story Writer returns a story that follows the template exactly:
- All 8 sections
- Proper formatting
- Testable criteria
- Appropriate ID (US-08 if that's next)

### Step 4: Save to File

Save the story to the suggested filename:
```
user-stories/US-08-reactivate-alerts.md
```

### Step 5: Proceed Through Workflow

The story now goes through:
1. **Plan Skeptic** — validates it's well-written
2. **Coder** — implements the feature
3. **Code Reviewer** — reviews the code
4. **QA** — tests the implementation

## Template Validation Checklist

Before accepting a story, verify it passes ALL checks:

- [ ] Title: `# US-[ID]: [Feature Name]`
- [ ] ID format: `US-XX` (e.g., US-08)
- [ ] Workflow table: exactly as template
- [ ] Description: 1-2 paragraphs
- [ ] User Stories: 3-5 items
- [ ] Each story: "As a user... so that..."
- [ ] Command/API: clear and specific
- [ ] Acceptance Criteria: 5-8 items
- [ ] Each criterion: testable with [ ] checkbox
- [ ] Depends On: lists prerequisites
- [ ] Notes: included (can be brief)
- [ ] No extra sections
- [ ] Filename: `user-stories/US-XX-kebab-case.md`

**If all pass**: Story is good to go.
**If any fail**: Story needs revision.

## Key Differences from Other Workflows

### NO Feature Planning Documents

- ❌ No separate `plans/` files for features
- ❌ No `feature-planner.md` output
- ❌ No `IMPLEMENTATION-PLAN.md`

All planning happens INSIDE the story:
- Description section = overview
- User Stories section = what users need
- Acceptance Criteria = how to verify
- Notes section = design decisions

### NO Task Lists

- ❌ No separate task breakdown
- ❌ No `TASKS.md` or task files

Tasks are created by the implementer based on story acceptance criteria.

### Story = Single Source

Each user story is:
- ✅ The planning document
- ✅ The requirement specification
- ✅ The test case definition
- ✅ The acceptance checklist

## Integration with Other Agents

All agents work FROM the stories:

- **Plan Skeptic** — Validates the story is clear
- **Coder** — Implements based on story and acceptance criteria
- **Code Reviewer** — Ensures code matches story requirements
- **QA** — Tests against acceptance criteria

They all reference the story as the source of truth.

## Best Practices

### ✓ DO

1. **Create one story per feature**
   - One clear scope per story
   - Can be completed in 1-3 days

2. **Follow the template exactly**
   - No deviations
   - Makes automation and consistency possible

3. **Write testable criteria**
   - "User can create alert" ✅
   - "System should work" ❌

4. **Reference existing patterns**
   - "Follows same pattern as movement alerts"
   - Links to similar existing work

5. **Be specific about commands**
   - `/alert ETH 10` ✅
   - "users can set alerts" ❌

### ✗ DON'T

1. **Don't create stories without using Story Writer**
   - Use the agent to ensure consistency
   - Don't manually write stories

2. **Don't modify the template**
   - It's strict for a reason
   - Consistency enables automation

3. **Don't mix multiple features in one story**
   - One feature per story
   - Split if it's too big

4. **Don't skip ID numbers**
   - US-08, US-09, US-10 (never jump)
   - Sequential is important

5. **Don't modify existing stories**
   - If you need to update one, create a new version
   - Preserve history

## Story Status Tracking

### Workflow Stages

Each story has this status table:

```markdown
| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | |
| Implement | |
| Code Review | |
| QA | |
```

**When creating**: Mark Draft as `OK`, leave others blank

**As it progresses**:
- Reviewed: ✅ when Plan Skeptic approves
- Implement: ✅ when Coder finishes
- Code Review: ✅ when Code Reviewer approves
- QA: ✅ when QA completes

## Questions & Answers

### Q: Can I use a different template?
**A**: No. The template is mandatory. This ensures consistency and enables automation.

### Q: What if my feature is complex?
**A**: Break it into multiple stories. Each story should be 1-3 days of work.

### Q: Should I write the story myself or use Story Writer?
**A**: Always use Story Writer. The agent ensures your story follows the template exactly.

### Q: Can I delete a story?
**A**: No. Never delete stories. They're the project history. If you need to replace one, create a new version (e.g., US-05a).

### Q: How do I know what ID to use?
**A**: Check the last story ID in `user-stories/`. Add 1. If last is US-07, next is US-08.

### Q: Can I modify a story after it's created?
**A**: Avoid it. If changes are needed, create a new story (e.g., US-08 "Original", then US-09 "Updated"). Keeps history clear.

### Q: What if Story Writer creates a story I don't like?
**A**: Tell it to revise. Ask for a different approach, scope, or structure. It will create a new version.

---

## Summary

- 📝 **Use Story Writer** for all feature development
- 📋 **Follow template strictly** (8 sections, exact format)
- 🆔 **Use sequential IDs** (US-08, US-09, US-10...)
- 📂 **Save to** `user-stories/US-XX-kebab-case.md`
- ✅ **Let agents handle** planning and validation
- 🚀 **Go from idea to shipped** through one clear workflow

**Questions?** Check the agents in `agents/prompts/` directory.

---

**This workflow is frozen.** All feature development follows this pattern. 🔒
