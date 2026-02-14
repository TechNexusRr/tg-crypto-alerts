# Story Validator Agent - Quality Gate for User Stories

The **Story Validator Agent** is your quality gate. It runs **immediately after Story Writer** to validate that every user story is bulletproof before it goes to the Coder.

## 📋 What It Does

Validates user stories with ruthless precision:
- ✓ Template structure is **exactly** correct
- ✓ All 8 mandatory sections present and in order
- ✓ User stories are specific and testable
- ✓ Acceptance criteria are measurable
- ✓ Edge cases and error handling covered
- ✓ Integrates properly with the Telegram bot architecture
- ✓ No gaps or ambiguities that developers would question

## 🎯 When to Use It

Use **Story Validator** immediately after:
- Story Writer creates a new user story
- You want to ensure quality before passing to Coder
- You want to catch missing requirements
- You need to verify the story fits the project

## 🚀 How to Use

### Step 1: Get a Story from Story Writer

Follow the Story Writer workflow to create a user story:
1. Copy `agents/prompts/story-writer.md`
2. Paste into Claude
3. Describe your feature idea
4. Get back a user story

### Step 2: Run Story Validator

1. Go to [claude.com](https://claude.com)
2. Open `agents/prompts/story-validator.md`
3. Copy the entire file
4. Start a new conversation
5. Paste the Story Validator prompt
6. At the bottom where it says "Paste the user story below:", paste the story from Story Writer

### Step 3: Get Validation Result

The Story Validator will:
1. Read PROJECT-IMPLEMENTATION.md context
2. Check template structure (sections, order, format)
3. Validate each section against quality criteria
4. Check for project-specific requirements
5. Detect red flags and issues
6. Provide clear feedback: **APPROVED** or **NEEDS REVISION**

### Step 4: Handle the Result

**If APPROVED** ✅
- Story is ready for the Coder
- No changes needed
- Proceed to implementation

**If NEEDS REVISION** ❌
- Story needs fixes before going to Coder
- Send revisions back to Story Writer
- Story Writer refines the story
- Run Validator again
- Repeat until APPROVED

### Step 5: Update Story Status

Once approved, mark the story status in the file:

```markdown
## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | ✅ |  ← Mark as validated
| Implement | |
| Code Review | |
| QA | |
```

## 📊 Complete Workflow

```
Your Idea
   ↓
Story Writer (creates user story)
   ↓ [save to user-stories/]
Story Validator (validates quality) ← YOU ARE HERE
   ↓ [if valid]
Coder (implements feature)
   ↓
Code Reviewer (reviews code)
   ↓
QA (tests thoroughly)
   ↓
Feature Complete ✅
```

## 🔍 What Story Validator Checks

### Template Structure ✅
- Title format: `# US-XX: Feature Name`
- All 8 sections present: Workflow, Description, User Stories, Command/API, Acceptance Criteria, Depends On, Notes
- Sections in exact order
- No missing or extra sections

### Description Quality ✅
- 1-2 paragraphs (not too short, not too long)
- Explains the "why" not the "how"
- No implementation details
- Fits the project context

### User Stories Quality ✅
- 3-5 stories (not 2, not 6+)
- Each starts with "As a user, I want"
- Each includes "so that" clause
- Each is specific and testable
- Covers main flow and edge cases

### Acceptance Criteria Quality ✅
- 5-8 testable criteria (not 3, not 10+)
- No vague language ("should work", "should be efficient")
- Includes validation and error handling
- Includes logging requirements
- Includes database/persistence checks
- Mentions Telegram notifications where relevant

### Project Fit ✅
- Command syntax matches project patterns
- Alert integrates with price bus
- Fits the Telegram bot architecture
- References correct dependencies
- Mentions proper logging and notifications

### Red Flags ✅
Catches problems like:
- Missing sections
- Wrong section order
- Too few or too many user stories
- Vague acceptance criteria
- Missing error handling
- Non-existent dependencies

## 💡 Example: What Gets Approved

Here's what a story that **PASSES** validation looks like:

```markdown
# US-05: Price Threshold Alerts

## Workflow
| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | |
| Implement | |
| Code Review | |
| QA | |

## Description
Users want to receive alerts when a price crosses a specific threshold value (e.g., BTC goes above $100k or ETH drops below $2k). Unlike movement alerts which keep firing, threshold alerts fire once and then deactivate to prevent spam.

## User Stories
- As a user, I want to set an alert when BTC crosses above $100,000, so I get notified the moment it happens
- As a user, I want to set an alert when ETH drops below $2,000, so I can buy the dip
- As a user, I want threshold alerts to fire once and deactivate, so I don't get spammed
- As a user, I want to reactivate a fired threshold alert, so I can be notified if the price crosses again

## Command
`/threshold <SYMBOL> <DIRECTION> <PRICE>` — e.g. `/threshold BTC above 100000`, `/threshold ETH below 2000`

## Acceptance Criteria
- [ ] `/threshold BTC above 100000` creates a threshold alert
- [ ] Alert fires exactly once when price crosses threshold
- [ ] After firing, alert status changes to "inactive"
- [ ] User can reactivate with `/reactivate <ID>`
- [ ] Invalid input (missing args, unknown symbol) returns error with usage hint
- [ ] alert_event logged on creation with full threshold details
- [ ] alert_event logged on trigger with trigger price and timestamp
- [ ] Telegram notification sent with threshold details

## Depends On
- US-00 (Bootstrap) — needs price bus and bot running
- US-01 (Movement Alerts) — follows existing alert pattern

## Notes
Threshold alerts are independent of movement alerts. Consider whether users can set multiple threshold alerts for the same symbol.
```

**VALIDATION RESULT**: ✅ APPROVED

---

## ❌ Example: What Gets Rejected

Here's what a story that **FAILS** validation looks like and why:

```markdown
# Alert System Enhancement

## Description
Let's improve the alert system to be more flexible and support more use cases.

## User Stories
- Alerts should work better
- System should be flexible

## Acceptance Criteria
- [ ] Should work efficiently
- [ ] Should handle edge cases well
```

**VALIDATION RESULT**: ❌ NEEDS REVISION

**Why it fails**:
1. ❌ Title format wrong (no US-XX number)
2. ❌ No Workflow table
3. ❌ Missing Command/API section
4. ❌ Only 2 user stories (need 3-5)
5. ❌ User stories don't start with "As a user, I want"
6. ❌ User stories are too vague
7. ❌ Only 2 acceptance criteria (need 5-8)
8. ❌ Acceptance criteria are not testable ("should work efficiently")
9. ❌ Missing error handling criteria
10. ❌ Missing Depends On section

---

## ✅ Quality Checklist

After Story Validator approves, verify:

- [ ] Story has been validated and APPROVED
- [ ] Title format: `US-XX` where XX is numeric (01, 08, not 8)
- [ ] All 8 sections present and in correct order
- [ ] 3-5 user stories, each with "As a user..." and "so that..."
- [ ] 5-8 testable acceptance criteria
- [ ] Command syntax is clear and realistic
- [ ] Dependencies reference existing stories
- [ ] Error handling is included
- [ ] Logging is mentioned
- [ ] Fits the Telegram bot alert architecture

## 🔄 Revision Workflow

If Story Validator says **NEEDS REVISION**:

1. **Read the feedback** carefully
2. **Understand the issues** (specific problems listed)
3. **Send revisions** back to Story Writer:
   > "Story Validator found these issues: [list issues]. Please revise the story to address them."
4. **Story Writer refines** the story
5. **Run Validator again** on the revised story
6. **Repeat** until APPROVED

This cycle usually takes 1-2 rounds.

## 🏆 Tips for Getting Approved Faster

### ✓ DO
1. **Follow the template exactly** — All 8 sections, in order
2. **Be specific** — "Users can set a price threshold alert" not "improve alerts"
3. **Include error handling** — "Invalid direction returns error message"
4. **Reference the project** — "Follows movement alert pattern", "Uses price bus"
5. **Write testable criteria** — Can verify true/false, not "should be efficient"
6. **List dependencies** — Reference other US stories (US-00, US-01, etc.)
7. **Mention logging** — "alert_event logged on creation"

### ✗ DON'T
1. **Don't include implementation** — User stories are not technical
2. **Don't be too vague** — "Make alerts better" won't pass
3. **Don't skip sections** — All 8 are mandatory
4. **Don't add extra sections** — No "Implementation", "Architecture", etc.
5. **Don't have too many stories** — Keep it to 3-5 user stories
6. **Don't forget error handling** — Always include validation and error cases
7. **Don't reference non-existent stories** — Check existing US numbers

## 📞 Questions?

### Q: How long does validation take?
**A**: Minutes if the story is well-structured. Usually returns feedback immediately.

### Q: What if I disagree with the feedback?
**A**: The feedback is usually right! But you can ask Validator to clarify why a specific point matters. The goal is to make stories that developers can implement without confusion.

### Q: Can I skip validation?
**A**: Not recommended. Stories that pass Validator always go faster in development because there are no ambiguities.

### Q: What if the story is complex?
**A**: Break it into multiple stories. Each story should be 1-3 days of work. If it's bigger, it's too big for one story.

### Q: Can I use a different format?
**A**: No. The template is mandatory for this project. Validator will catch any deviations.

---

## 🚀 Next Steps

1. **Get a story from Story Writer** (see STORY-WRITER.md)
2. **Run it through Story Validator** (this agent)
3. **If approved**: Pass to Coder for implementation
4. **If needs revision**: Send back to Story Writer with feedback
5. **Repeat until approved**

---

## Summary

- 📝 **Story Writer** creates the story
- ✅ **Story Validator** ensures quality (YOU ARE HERE)
- 💻 **Coder** implements the story
- 👀 **Code Reviewer** reviews the code
- 🧪 **QA** tests the implementation

**Story Validator is the quality gate between ideas and implementation.**

No story goes to the Coder without passing Validator. This saves massive amounts of rework later.

---

**Ready to validate a story? Use `agents/prompts/story-validator.md`!** 🎯
