# 🤖 Multi-Agent Team - START HERE

Welcome! This is a complete, platform-agnostic AI agent system for processing user stories through validation, coding, review, and QA.

**The best part?** It works with **any AI platform**: Claude, ChatGPT, Ollama, or anything else.

## ⚡ 30-Second Overview

7 AI agents that work together, **aware of your project context**:
1. **Story Writer** ✍️ - Creates user stories from ideas
2. **Story Validator** ✅ - Validates story quality with project-specific template rules
3. **Coder** 💻 - Writes code matching YOUR patterns
4. **Code Reviewer** 👀 - Reviews against YOUR standards (max 2 iterations)
5. **QA** 🧪 - Tests with YOUR test frameworks
6. **Code Documentor** 📚 - Documents code comprehensively
7. **Plan Skeptic** 🤔 - Alternative validation (legacy, use Story Validator instead)

The workflow is simple:
```
Idea → Story Writer → Story Validator → Coder → Reviewer → QA → Document → Done ✅
```

**Key difference**: All agents read **PROJECT-IMPLEMENTATION.md** to understand your codebase and apply that knowledge to everything they do.

## 🚀 Quick Start (5 Minutes)

### Option 1: Try it Right Now (Free!)

1. Go to [Claude.com](https://claude.com) or [ChatGPT.com](https://chatgpt.com)
2. First, create a story: Open `agents/prompts/story-writer.md` and follow the workflow
3. Then validate it: Open `agents/prompts/story-validator.md`
4. Copy the **entire** content of story-validator.md
5. Paste it into the AI chat
6. Add your user story where it says `[USER STORY WILL BE PROVIDED HERE]`
7. Hit Send
8. See the validation result (APPROVED or NEEDS REVISION)!

**That's it!** You just used Agent #1 (Story Writer) and Agent #2 (Story Validator).

### Option 2: Read First, Then Try

- Skip to **"What's Inside?"** section below
- Read through the structure
- Then follow Option 1

## 📁 What's Inside?

```
agents/
├── README.md                    ← Full documentation
├── START-HERE.md               ← You are here
├── PLATFORM-GUIDE.md           ← How to use with Claude, ChatGPT, Ollama, etc
│
├── prompts/                     ← The 4 agent prompts
│   ├── plan-skeptic.md         ← Agent 1: Validates stories
│   ├── coder.md                ← Agent 2: Writes code
│   ├── code-reviewer.md        ← Agent 3: Reviews code
│   └── qa.md                   ← Agent 4: Tests code
│
├── workflows/
│   └── standard-workflow.md    ← How to use all 4 agents in sequence
│
└── examples/
    ├── example-story.md        ← Sample story (Dark Mode feature)
    └── flow-walkthrough.md     ← Full end-to-end example
```

## 📖 How to Use

### The Simplest Way (Copy-Paste, Project-Aware)

For each phase, just:
1. Copy the prompt file from `agents/prompts/`
2. Paste into Claude/ChatGPT
3. The agent automatically reads **PROJECT-IMPLEMENTATION.md** for context
4. Paste your story/code at the placeholder
5. Send
6. Get results perfectly integrated with your codebase

**No code, no setup, just copy-paste. Agents understand your project automatically.**

### The Best Way (Read First)

1. Read `README.md` (10 min) - Understand the system
2. Read `workflows/standard-workflow.md` (5 min) - See the process
3. Read `examples/flow-walkthrough.md` (10 min) - See real example
4. Then use the prompts

### The Automated Way (Developers)

See `PLATFORM-GUIDE.md` for:
- Claude API integration
- OpenAI API integration
- Ollama (local models)
- Other platforms

## 🎯 The 4 Agents Explained

### 1️⃣ Plan Skeptic (Story Validation)

**What**: Validates your user story
**File**: `prompts/plan-skeptic.md`
**Input**: Your raw user story
**Output**: Validation report (VALID or NEEDS REVISION)

Checks:
- Clear title? ✓
- Good description? ✓
- Testable criteria? ✓
- Realistic? ✓

### 2️⃣ Coder (Implementation)

**What**: Writes production-ready code
**File**: `prompts/coder.md`
**Input**: Validated story + tech context
**Output**: Code implementation with reasoning

Provides:
- Complete code
- File-by-file breakdown
- Design explanation
- Testing strategy

### 3️⃣ Code Reviewer (Quality Control)

**What**: Reviews code quality
**File**: `prompts/code-reviewer.md`
**Input**: Implementation code + story
**Output**: Approval or feedback
**Limit**: Max 2 iterations then proceed

Checks:
- Does it work? ✓
- Good code quality? ✓
- Tests included? ✓
- No security issues? ✓

### 4️⃣ QA (Testing)

**What**: Comprehensive testing
**File**: `prompts/qa.md`
**Input**: Final code + acceptance criteria
**Output**: Test report with results

Tests:
- Unit tests ✓
- Integration tests ✓
- Edge cases ✓
- Performance ✓
- Security ✓

## 🔄 The Workflow

```
Step 1: Validate Story with Plan Skeptic
   ↓
Step 2: Code with Coder
   ↓
Step 3: Review with Code Reviewer (loop max 2x if needed)
   ↓
Step 4: Test with QA
   ↓
Result: ✅ Ready to deploy or ⚠️ Has issues
```

**Total time**: 30-60 minutes per story

## 💡 Example: Dark Mode Feature

See `examples/example-story.md` for a complete user story.

See `examples/flow-walkthrough.md` for the full walkthrough with:
- What you paste into Claude
- What Claude responds
- Next steps

## 🛠️ Choose Your Platform

### Option A: Free, Web Interface (Recommended to Start)
- Claude.com (use free tier)
- ChatGPT.com (use free tier)
- Just copy-paste prompts
- No setup needed

### Option B: API Integration
- Claude API - Best quality
- OpenAI API - GPT-4
- Ollama - Local open-source models
- See `PLATFORM-GUIDE.md` for setup

### Option C: Other Platforms
- Works with any LLM
- See `PLATFORM-GUIDE.md` for options
- Groq, Vertex AI, Together AI, etc.

## ✅ Success Checklist

After using all 4 agents, you should have:

- ✅ Story validation report (Plan Skeptic)
- ✅ Working code implementation (Coder)
- ✅ Code review feedback (Reviewer)
- ✅ QA test report (QA)
- ✅ Decision: Deploy or Fix Issues

## ⚠️ Common Questions

**Q: Do I need to code?**
A: No! The AI agents write all the code. You just copy-paste prompts.

**Q: Can I use with ChatGPT?**
A: Yes! These prompts work with Claude, ChatGPT, Ollama, or any LLM.

**Q: How long does it take?**
A: 30-60 minutes per story (if you do it manually with copy-paste).
Can be faster with API automation.

**Q: Can I skip phases?**
A: Not recommended. Plan Skeptic catches issues early. Skipping saves time but lowers quality.

**Q: What if the AI doesn't follow format?**
A: The prompts are designed to get structured output. If needed, ask it to reformat.

**Q: Can I customize the prompts?**
A: Yes! Edit the .md files directly. They're plain text.

**Q: Does it cost money?**
A: Free to start (claude.com / chatgpt.com). Optional API costs if you automate.

## 🚀 Try It Now

### Right This Second:

1. Open [claude.com](https://claude.com)
2. Start new chat
3. Copy this entire prompt:
   ```
   You are a critical user story validator. Validate this story:

   Title: Add Dark Mode
   Description: Users want dark theme option
   Acceptance Criteria:
   - Toggle button in header
   - Theme persists on reload
   ```
4. Send it
5. See what Claude says

**That's the idea!** (Real prompts are longer but same concept)

### Next Steps:

1. Read `README.md` - Full reference
2. Try `examples/example-story.md` - Complete example
3. Follow `workflows/standard-workflow.md` - Process guide
4. Use `PLATFORM-GUIDE.md` - For automation

## 📚 Files to Read (In Order)

1. **START-HERE.md** ← You are here (overview)
2. **README.md** - Full documentation (10 min read)
3. **workflows/standard-workflow.md** - Process flow (5 min read)
4. **examples/flow-walkthrough.md** - Real example (15 min read)
5. **PLATFORM-GUIDE.md** - How to integrate (reference)

Then use the prompts in:
- `prompts/plan-skeptic.md`
- `prompts/coder.md`
- `prompts/code-reviewer.md`
- `prompts/qa.md`

## 🎓 Learning Path

### Beginner (Copy-Paste)
1. Try one story manually
2. Use Claude.com
3. Copy prompts, paste stories
4. See results

### Intermediate (Automation)
1. Read PLATFORM-GUIDE.md
2. Set up with API (Claude or OpenAI)
3. Write simple script to call prompts
4. Process multiple stories

### Advanced (Full Workflow)
1. Build complete pipeline
2. Integrate with your project
3. Auto-process stories
4. Track results over time

## 💬 One More Thing

**These are just prompts.** They're not magic, they're intelligent templates that:

1. Guide the AI on what to do
2. Ask for structured output
3. Set expectations
4. Make the AI act like each role

You can:
- Modify them
- Extend them
- Create new agents
- Share with team
- Use with any LLM

## 🎯 Your First Story

Ready? Here's what to do:

1. **Pick a user story** you want to process
2. **Open Claude or ChatGPT**
3. **Copy `prompts/plan-skeptic.md`**
4. **Paste your story** where it says `[USER STORY WILL BE PROVIDED HERE]`
5. **Send and see results!**

Then repeat with the other 3 prompts.

---

## 📞 Support

Questions?
- Read `README.md` for detailed info
- Check `PLATFORM-GUIDE.md` for platform-specific help
- See `examples/` for working examples
- Review `workflows/` for process help

---

**You're ready!** 🚀

Start with one story, see how it works, then scale up.

The prompts are in `agents/prompts/`.

Pick `plan-skeptic.md` and go! ✨