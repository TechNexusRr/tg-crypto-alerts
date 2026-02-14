# Standard Story Processing Workflow

This document defines how to use the agent team to create and process user stories from creation to QA.

## 🔄 Complete Workflow (5 Phases)

### Phase 0: Story Creation (Story Writer) ⭐ NEW

1. **Input**: Feature idea or requirement
2. **Process**:
   - Copy the Story Writer prompt from `prompts/story-writer.md`
   - Provide your feature idea to the AI
   - Get a well-structured user story
3. **Output**: Markdown user story (US-XX-name.md)
4. **Storage**: Save to `user-stories/` folder
5. **Next**: Proceed to Phase 1 (Plan Skeptic)

**Example**:
```
Your Idea: "Users should be able to set percent-change alerts"
↓
Story Writer reads PROJECT-IMPLEMENTATION.md
↓
Creates: US-06-percent-change-alerts.md
↓
Save to: user-stories/US-06-percent-change-alerts.md
```

---

### Phase 1: Story Validation (Plan Skeptic)

1. **Input**: Raw user story
2. **Process**:
   - Copy the Plan Skeptic prompt from `prompts/plan-skeptic.md`
   - Provide the user story to the AI
   - Get validation feedback
3. **Output**: Validation report with issues and suggestions
4. **Decision**:
   - ✅ **Valid**: Proceed to Phase 2
   - ❌ **Needs Revision**: Send back to story author, restart at Phase 1
   - ⚠️ **Minor Issues**: Proceed to Phase 2 but note suggestions

### Phase 2: Implementation (Coder)

1. **Input**: Validated user story
2. **Process**:
   - Copy the Coder prompt from `prompts/coder.md`
   - Include the story and any technical context
   - Ask AI to implement the feature
3. **Output**: Implementation code with reasoning
4. **Quality Check**: Review before moving to Phase 3

### Phase 3: Code Review (Code Reviewer) - ITERATION LOOP (Max 2 times)

**Iteration 1:**

1. **Input**: Implementation code + Original story
2. **Process**:
   - Copy the Code Reviewer prompt
   - Specify "Iteration: 1"
   - Provide implementation + acceptance criteria
   - Get feedback
3. **Output**: Review feedback (APPROVED or NEEDS REVISION)
4. **Decision**:
   - ✅ **APPROVED**: Proceed to Phase 4
   - ❌ **NEEDS REVISION**: Go to Iteration 2

**Iteration 2 (if needed):**

1. **Input**: Original implementation + Iteration 1 feedback
2. **Process**:
   - Ask Coder to fix the issues
   - Then ask Code Reviewer again with "Iteration: 2"
3. **Output**: Final review feedback
4. **Decision**:
   - ✅ **APPROVED**: Proceed to Phase 4
   - ⚠️ **Needs Work But Approved**: Proceed to Phase 4
   - ❌ **Still Not Approved**: Flag for discussion, but proceed with notes

**Maximum 2 iterations** - After that, proceed to QA regardless of approval status.

### Phase 4: QA Testing (QA Agent)

1. **Input**: Final implementation + Story + Acceptance Criteria
2. **Process**:
   - Copy the QA prompt
   - Provide all code and requirements
   - Ask for comprehensive testing
3. **Output**: QA report with test results, issues, coverage
4. **Decision**:
   - ✅ **PASS**: Proceed to Phase 5 (Documentation)
   - ⚠️ **NEEDS ATTENTION**: Issues found but can proceed with caution to Phase 5
   - ❌ **FAIL**: Critical blockers, send back to development

### Phase 5: Code Documentation (Code Documentor) ⭐ OPTIONAL

1. **Input**: Final approved code
2. **Process**:
   - Copy the Code Documentor prompt from `prompts/code-documentor.md`
   - Provide your implementation code
   - Specify documentation level (1-4)
   - Ask for comprehensive documentation
3. **Output**: Fully documented code with:
   - Docstrings and JSDoc comments
   - Inline comments explaining complex logic
   - Usage examples
   - API documentation
   - Architecture explanation
4. **Result**: Code ready for team review and long-term maintenance

**Note**: This phase is optional but recommended for:
- New features
- Complex logic
- Public APIs
- Code that other developers will use or maintain
- Team onboarding

## 📊 Communication Pattern

### Sequential Mode (Recommended for small teams)
```
Phase 0: Story Writer creates story
    ↓ Save to user-stories/
Phase 1: Plan Skeptic validates story
    ↓ (decision: valid or needs revision)
Phase 2: Coder implements
    ↓
Phase 3: Code Reviewer reviews (up to 2 iterations)
    ↓
Phase 4: QA tests
    ↓
Phase 5: Code Documentor documents (optional)
    ↓
Final Result - Ready for Production ✅
```

### Parallel Mode (For faster processing)
```
Phase 0: Story Writer creates story
    ↓ Save to user-stories/
Phase 1: Plan Skeptic validates story
    ↓ (decision: valid)

Phase 2: Coder implements
    AND simultaneously
Phase 3: Reviewer prepares review

When Coder finishes → Review feedback loop starts
When Review approved → QA tests
When QA passes → Code Documentor documents (optional)
```

## 📋 Example Conversation Flow

### Step 0: Create Story (Story Writer)
```
User: [Copy story-writer.md prompt]
Then provide:

Feature/Idea: Add dark mode toggle to the application
Context: Users want to switch between light and dark themes
Constraints: Should persist preference in localStorage

AI: [Creates a well-structured user story with all details]
Saves as: user-stories/US-XX-add-dark-mode.md
```

### Step 1: Validate Story
```
User: [Copy plan-skeptic.md prompt]
Then paste:
---
# User Story: Add Dark Mode

**Title**: Add Dark Mode Toggle

**Description**: Users want the ability to switch between light and dark themes.
The preference should be saved and persist across sessions.

**Acceptance Criteria**:
- Toggle button visible in header
- Clicking toggles the theme
- Preference saved in localStorage
- Theme persists on page reload

**Priority**: Medium
**Points**: 5
---

AI: [Provides validation]
```

### Step 2: Implement Feature
```
User: [Copy coder.md prompt]
Then paste the story and:

Context: This is for a React/TypeScript web application.
Use React hooks and Tailwind CSS.

AI: [Provides implementation code]
```

### Step 3: Review Code (Iteration 1)
```
User: [Copy code-reviewer.md prompt]
Then paste:

Original Story: [story from step 1]
Implemented Code: [code from step 2]
Iteration: 1

AI: [Provides review feedback]
```

### Step 4: If Changes Needed - Reimplement
```
User: Ask Coder to address the feedback from Iteration 1

User: [Copy code-reviewer.md prompt again]
Then paste the updated code:

Iteration: 2

AI: [Provides final review]
```

### Step 5: QA Testing
```
User: [Copy qa.md prompt]
Then paste:

User Story: [original story]
Acceptance Criteria: [listed]
Implementation: [final approved code]
Tech Stack: React, TypeScript, Tailwind

AI: [Provides QA report with test results]
```

## 🎯 Success Criteria

A feature is **complete** when:

0. ✅ **Story Writer**: User story created and saved to user-stories/
1. ✅ **Plan Skeptic**: Story is valid (or minor issues noted)
2. ✅ **Coder**: Implementation provided
3. ✅ **Code Reviewer**: Approved (after max 2 iterations)
4. ✅ **QA**: Tests pass with no critical blockers
5. ✅ **Code Documentor**: Code documented (optional but recommended)

## 🔄 If Issues Found

| Phase | Issue | Action |
|-------|-------|--------|
| Story Writer | Needs clarification | Answer questions, get revised story |
| Plan Skeptic | Invalid story | Revise story, restart Phase 1 |
| Coder | Can't implement | Clarify requirements, restart Phase 2 |
| Code Reviewer | Issues found | Fix code, restart review (max 2x) |
| QA | Tests fail | Fix code, restart QA |

## ⏱️ Iteration Limits

- **Coder ↔ Reviewer Loop**: Maximum 2 iterations, then proceed to QA
- **QA Re-testing**: No limit - can iterate until issues resolved

## 📝 Record Keeping

Save results from each phase:
- Phase 0: user-stories/US-XX-story-name.md (main artifact)
- Phase 1: Optional - save validation feedback
- Phase 2: Optional - save implementation details
- Phase 3: Optional - save review feedback
- Phase 4: Optional - save QA report

**Primary artifact**: The user story file in `user-stories/` folder

## 🚀 Quick Start

1. Have a user story ready
2. Open this workflow as reference
3. Copy prompts in order (plan-skeptic → coder → code-reviewer → qa)
4. Follow decision points
5. Document results
6. Move to next story

## 💡 Tips

- **Be specific**: Provide context about tech stack, project type
- **Copy entire prompts**: Don't paraphrase, use exact format
- **Iterate wisely**: Use the 2-iteration limit for coder/reviewer efficiently
- **QA is final check**: Take QA results seriously
- **Document decisions**: Record why stories were approved/rejected

---

See individual prompts in `prompts/` folder for detailed agent instructions.