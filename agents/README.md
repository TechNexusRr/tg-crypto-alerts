# 🤖 Multi-Agent Team - Context-Aware & Platform Agnostic

A collection of AI agent prompts and workflows that work with **any LLM platform** (Claude, ChatGPT, Ollama, etc.) while being **fully aware of your project structure and context**.

Agents automatically read **PROJECT-IMPLEMENTATION.md** to understand your codebase, then make decisions that fit perfectly with your existing code.

## 🎯 Overview

This system defines seven specialized AI agents that work together to create, develop, and document features **with full awareness of your project**:

1. **Story Writer** ✍️ - Creates user stories from feature ideas
2. **Story Validator** ✅ - Validates story quality with project-specific template rules
3. **Coder** 💻 - Implements features matching YOUR patterns
4. **Code Reviewer** 👀 - Reviews against YOUR standards (max 2 iterations)
5. **QA** 🧪 - Tests with YOUR frameworks and patterns
6. **Code Documentor** 📚 - Documents code with comprehensive guides
7. **Plan Skeptic** 🤔 - Alternative validation (legacy, use Story Validator instead)

### Context-Aware = Better Results

Instead of generic solutions, agents:
- 📖 Read **PROJECT-IMPLEMENTATION.md** for project context
- 🏗️ Understand your architecture and file structure
- 📋 Know your coding standards and patterns
- 🔗 Integrate seamlessly with existing code
- ✅ Match your project's conventions

## 📁 Structure

```
agents/
├── prompts/                      # Agent prompt templates
│   ├── plan-skeptic.md          # Story validation prompt
│   ├── coder.md                 # Implementation prompt
│   ├── code-reviewer.md         # Code review prompt
│   └── qa.md                    # QA testing prompt
│
├── workflows/                    # Workflow definitions
│   └── standard-workflow.md     # How to use agents in sequence
│
├── examples/                     # Example files
│   ├── example-story.md         # Sample user story
│   └── flow-walkthrough.md      # Complete walkthrough
│
└── README.md                     # This file
```

## 🚀 Quick Start

### 1. Choose Your AI Platform

This works with:
- ✅ **Claude** (Claude.com or Claude API)
- ✅ **ChatGPT** (ChatGPT.com or OpenAI API)
- ✅ **Ollama** (Local open-source models)
- ✅ **Any LLM** with a text interface

### 2. Follow the Workflow

```
Your Idea
↓
Story Writer: Copy prompts/story-writer.md
↓
Story Validator: Copy prompts/story-validator.md
↓
Coder: Copy prompts/coder.md
↓
Code Reviewer: Copy prompts/code-reviewer.md (max 2 iterations)
↓
QA: Copy prompts/qa.md
↓
Done! 🎉
```

### 3. Use Example

See `examples/example-story.md` for a complete sample story.
See `examples/flow-walkthrough.md` for a full end-to-end walkthrough.

## 📋 How It Works

### Phase 0: Story Writer (Story Creation)

**What**: Creates user stories from feature ideas
**Input**: Feature idea, requirement, or enhancement description
**Output**: Well-structured user story (US-XX-name.md)
**Storage**: Saves to `user-stories/` folder
**Tool**: Copy prompt from `prompts/story-writer.md`

Creates:
- ✓ Clear user perspective stories
- ✓ Acceptance criteria
- ✓ Dependencies and context
- ✓ Integration with existing features
- ✓ Proper file structure and naming

### Phase 1: Story Validator (Story Validation) ⭐ **NEW**

**What**: Validates user story quality with project-specific template rules
**Input**: Raw user story from Story Writer
**Output**: Validation report (APPROVED / NEEDS REVISION)
**Tool**: Copy prompt from `prompts/story-validator.md`

Checks:
- ✓ Mandatory 8-section template structure
- ✓ Correct section order
- ✓ User story format (As a user, I want... so that...)
- ✓ 3-5 user stories (not 2, not 6+)
- ✓ 5-8 testable acceptance criteria
- ✓ Project integration (price bus, alerts, Telegram)
- ✓ No gaps or ambiguities

### Phase 2: Coder (Implementation) 💻

**What**: Implements feature code
**Input**: Validated story + tech context
**Output**: Code implementation with reasoning
**Tool**: Copy prompt from `prompts/coder.md`

Provides:
- ✓ Complete implementation
- ✓ File-by-file breakdown
- ✓ Reasoning for decisions
- ✓ Testing strategy

### Phase 3: Code Reviewer (Review Loop) 👀

**What**: Reviews code quality
**Input**: Implementation + Original story
**Output**: Feedback (APPROVED or NEEDS REVISION)
**Tool**: Copy prompt from `prompts/code-reviewer.md`
**Limit**: Maximum 2 iterations

Checks:
- ✓ Functionality completeness
- ✓ Code quality
- ✓ Test coverage
- ✓ Architecture
- ✓ Security

After iteration 1:
- If approved → Proceed to Phase 4
- If needs changes → Ask Coder to fix, then review again
- After iteration 2 → Proceed to Phase 4 regardless

### Phase 4: QA (Testing) 🧪

**What**: Comprehensive testing
**Input**: Final code + Story + Acceptance criteria
**Output**: Test report with pass/fail results
**Tool**: Copy prompt from `prompts/qa.md`

Tests:
- ✓ Unit tests
- ✓ Integration tests
- ✓ Acceptance criteria coverage
- ✓ Performance
- ✓ Security
- ✓ Edge cases
- ✓ Code coverage

### Phase 5: Code Documentor (Documentation) ⭐ Optional

**What**: Generates comprehensive code documentation
**Input**: Final approved code from QA
**Output**: Fully documented code with docstrings, comments, examples
**Tool**: Copy prompt from `prompts/code-documentor.md`

Creates:
- ✓ JSDoc/TypeScript docstrings
- ✓ Inline comments explaining logic
- ✓ Usage examples
- ✓ API documentation
- ✓ Architecture guides
- ✓ Integration notes
- ✓ Performance documentation

**When to use**: New features, complex code, public APIs, team onboarding

## 💡 Usage Examples

### Using Claude.com (Free)

1. Go to claude.com
2. Open a new conversation
3. Copy the **plan-skeptic.md** prompt (entire file)
4. Paste your user story at the bottom
5. Hit send
6. Review the validation
7. If valid, repeat steps 2-6 with **coder.md**
8. Continue through all phases

### Using ChatGPT

Same process as Claude, works with GPT-4 or GPT-4o.

### Using Claude API (Programmatic)

```bash
# Example with curl
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 4096,
    "system": "[COPY plan-skeptic.md CONTENT HERE]",
    "messages": [
      {"role": "user", "content": "[YOUR USER STORY HERE]"}
    ]
  }'
```

### Using OpenAI API

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "system", "content": "[COPY plan-skeptic.md CONTENT HERE]"},
      {"role": "user", "content": "[YOUR USER STORY HERE]"}
    ]
  }'
```

## 📊 Workflow Modes

### Sequential Mode (Recommended)

Agents process one after another:
```
Plan Skeptic validates → Coder implements → Reviewer reviews → QA tests
```

**Best for**: Single stories, detailed feedback
**Time**: 30-60 minutes per story

### Parallel Mode

Start multiple phases while waiting:
```
Plan Skeptic validates
↓
Coder implements AND Reviewer prepares
↓
Review happens as soon as code is ready
↓
QA tests
```

**Best for**: Batch processing, speed
**Time**: 20-40 minutes per story

## ✅ Success Criteria

A story is **complete** when:

1. ✓ Story Validator: Story is APPROVED
2. ✓ Coder: Implementation provided
3. ✓ Code Reviewer: APPROVED (after max 2 iterations)
4. ✓ QA: Tests PASS with no critical blockers

## 🔄 When Issues Occur

| Phase | Issue | Action |
|-------|-------|--------|
| Story Validator | Story not approved | Revise story with Story Writer, restart validator |
| Coder | Can't implement | Clarify story, restart Phase 2 |
| Code Reviewer | Issues found | Ask Coder to fix, restart Phase 3 |
| Code Reviewer | Still issues after 2x | Proceed to QA with notes |
| QA | Tests fail | Ask Coder to fix, restart QA |

## 📝 Prompts Included

### story-validator.md ⭐ **NEW**
- Validates 8-section template structure
- Verifies exact section order
- Checks user story format (As a user... so that...)
- Validates 3-5 user stories (not 2, not 6+)
- Validates 5-8 testable acceptance criteria
- Project-specific validation (price bus, alerts, Telegram)
- Provides clear APPROVED/NEEDS REVISION feedback

### plan-skeptic.md (Legacy)
- Alternative validation approach
- Validates story structure
- Checks clarity and completeness
- Provides improvement suggestions

### coder.md
- Analyzes requirements
- Designs architecture
- Writes production-ready code
- Documents reasoning
- Lists affected files
- Suggests improvements

### code-reviewer.md
- Reviews functionality
- Checks code quality
- Verifies test coverage
- Identifies security issues
- Provides actionable feedback
- Clear approval/rejection

### qa.md
- Tests acceptance criteria
- Runs unit/integration tests
- Checks performance
- Verifies security
- Calculates coverage
- Identifies blockers

## 🎯 Key Features

✅ **Platform Agnostic** - Works with any LLM (Claude, GPT, Ollama, etc.)
✅ **No Setup Required** - Just copy prompts and paste them
✅ **Proven Structure** - 4 agents with clear responsibilities
✅ **Iteration Control** - Max 2 code review iterations
✅ **Conversation History** - Agents remember context
✅ **Sequential + Parallel** - Choose your workflow mode
✅ **Markdown Native** - All prompts are plain text

## 📚 Examples

See the `examples/` folder:

- **example-story.md** - Sample "Dark Mode" user story
- **flow-walkthrough.md** - Complete end-to-end walkthrough with expected outputs

## 🚦 Decision Points

### After Story Writer
```
Is story created?
├─ YES → Save to user-stories/
└─ NO → Provide more context/clarification
```

### After Story Validator
```
Is story APPROVED?
├─ YES → Proceed to Coder
└─ NO → Revise story with Story Writer and retry
```

### After Code Reviewer (Iteration 1)
```
Is code APPROVED?
├─ YES → Proceed to QA
├─ NO (Iteration 1) → Ask Coder to fix, review again
└─ NO (Iteration 2) → Proceed to QA with notes
```

### After QA
```
Do tests PASS?
├─ YES → Ready for deployment ✅
└─ NO → Ask Coder to fix, retest
```

## 💬 Communication Pattern

Each phase follows this pattern:

1. **Input**: User provides story/code/requirements
2. **Processing**: AI agent analyzes and responds
3. **Output**: Clear structured response
4. **Decision**: Proceed or iterate based on output

## 🔐 Security & Prompts

- All prompts are public and readable
- No credentials stored in prompts
- Prompts don't contain API keys
- Customize prompts for your needs
- Prompts are tested with Claude, should work with other LLMs

## 🛠️ Customization

You can customize the prompts:

- **Adjust validation rules** in plan-skeptic.md
- **Change code style** in coder.md
- **Modify review criteria** in code-reviewer.md
- **Add test types** in qa.md

Just edit the .md files directly!

## 📊 Expected Output Examples

### Plan Skeptic Output
```
## Validation Result
Status: VALID
Issues: None
Suggestions: Add story points
Confidence: 95%
Summary: Ready for implementation
```

### Coder Output
```
## Implementation Plan
Architecture: [Design description]
Files: [list of affected files]
Implementation: [code in markdown blocks]
Why: [Reasoning]
```

### Code Reviewer Output
```
## Code Review
Assessment: APPROVED
Issues: 0 critical, 1 minor
Feedback: [detailed comments]
Approved: YES
```

### QA Output
```
## QA Test Report
Status: PASS (11/11 tests)
Coverage: 85%
Blockers: None
SignOff: YES
```

## ⚡ Tips & Tricks

1. **Be Specific**: Include tech stack and project context
2. **Copy Entire Prompts**: Don't paraphrase, use exact format
3. **Iterate Wisely**: Use the 2-iteration limit efficiently
4. **Document Results**: Save outputs in version control
5. **Reuse Workflows**: Same workflow for all stories
6. **Batch Processing**: Process multiple stories in parallel mode
7. **Custom Models**: Works with any model, not just Claude

## 🎓 Learning Resources

- See **flow-walkthrough.md** for detailed example
- See **example-story.md** for story template
- See **standard-workflow.md** for process reference
- Each prompt file has detailed instructions

## ❓ FAQ

**Q: Can I use this with OpenAI/ChatGPT?**
A: Yes! Works with any LLM. Just copy the prompts into ChatGPT.

**Q: What if the AI doesn't follow the format?**
A: The prompts are designed to get structured output. Rephrase your request if needed.

**Q: Can I modify the prompts?**
A: Yes! They're just markdown files. Customize for your needs.

**Q: How many iterations are allowed?**
A: Coder ↔ Reviewer: max 2. QA: no limit.

**Q: Do I need to pay?**
A: Works with free Claude.com or ChatGPT. Optional for API usage.

**Q: Can multiple people use this?**
A: Yes! Share the prompts folder with your team.

## 📄 License

Open source - use and modify freely.

---

## 🚀 Getting Started with Story Validator

1. Read `STORY-VALIDATOR.md` for detailed usage guide
2. Use `prompts/story-writer.md` to create a story
3. Use `prompts/story-validator.md` to validate it
4. Get story APPROVED
5. Pass to Coder for implementation

---

**Ready to start?**
1. Open `STORY-WRITER.md` to create a user story
2. Open `STORY-VALIDATOR.md` to validate quality
3. Copy `prompts/story-validator.md` and validate
4. Once approved, proceed to Coder
5. Follow the complete workflow! 🚀