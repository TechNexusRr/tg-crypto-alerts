# Complete Workflow Walkthrough

This document shows a complete end-to-end example of processing a user story through all 4 agent phases.

## 🎯 Scenario

Process the "Add Dark Mode" user story through the entire workflow with Claude AI.

## Phase 1: Story Validation ✓

### What You Do

1. Open Claude.com (or your Claude API interface)
2. Copy the entire **plan-skeptic.md** prompt
3. Replace `[USER STORY WILL BE PROVIDED HERE]` with the story from **example-story.md**
4. Submit

### Example Input to Claude

```
[COPY ENTIRE plan-skeptic.md PROMPT]

Then at the bottom replace the placeholder with:

---

# User Story: Add Dark Mode

**ID**: US-001
**Title**: Add Dark Mode Toggle
**Priority**: Medium
**Story Points**: 5

**Description**: Users want the ability to switch between light and dark themes...
[rest of the story]

---
```

### Expected Claude Output

```
## Validation Result

**Status**: VALID

### Issues Found
- None

### Suggestions
- Consider specifying the exact colors/theme specifications to use
- Optional: Add a system preference detection (prefers-color-scheme)

### Confidence Level
95% - Story is well-written and ready for development

### Summary
Clear, testable story with good acceptance criteria. Ready for implementation.
```

### Decision: ✅ PROCEED TO PHASE 2

---

## Phase 2: Implementation ✓

### What You Do

1. Copy the entire **coder.md** prompt
2. Provide the validated story
3. Add technical context: "Using React 18, TypeScript, and Tailwind CSS"

### Example Input to Claude

```
[COPY ENTIRE coder.md PROMPT]

Then replace placeholder with:

---

# User Story

[PASTE THE STORY FROM PHASE 1]

Context: This is for a React 18 + TypeScript + Tailwind CSS web application.
Use React Context API or Zustand for state management.
Assume the app already has a root layout component.

---
```

### Expected Claude Output

```
## Implementation Plan

### Understanding
Build a dark mode toggle feature that allows users to switch themes with persistent storage.

### Architecture
- Create a ThemeContext for global theme state
- Create a ThemeToggle component for the UI button
- Use localStorage for persistence
- Apply theme at root level component

### Files to Modify/Create
- src/contexts/ThemeContext.tsx (create)
- src/components/ThemeToggle.tsx (create)
- src/App.tsx (modify - add ThemeContext provider)
- src/styles/globals.css (modify - add dark mode styles)
- src/components/Header.tsx (modify - add toggle button)

### Dependencies
- react (already present)
- lucide-react (for icons)

### Implementation

\`\`\`typescript
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      const dark = saved === 'dark';
      setIsDark(dark);
      applyTheme(dark);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      applyTheme(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      applyTheme(newValue);
      return newValue;
    });
  };

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
\`\`\`

[More code sections...]

### Why This Approach
- ThemeContext keeps theme state global and accessible
- localStorage ensures persistence
- Tailwind's dark: prefix handles styling elegantly
- useTheme hook provides clean API for components

### Potential Improvements
- Add animation when switching themes
- Support for custom color schemes
- Sync across browser tabs
```

### Decision: ✅ PROCEED TO PHASE 3 (Code Review)

---

## Phase 3: Code Review (Iteration 1) ✓

### What You Do

1. Copy the entire **code-reviewer.md** prompt
2. Paste the implementation code from Phase 2
3. Include original story for reference
4. Specify: "Iteration: 1"

### Example Input to Claude

```
[COPY ENTIRE code-reviewer.md PROMPT]

Then provide:

**Original User Story**:
[PASTE STORY]

**Implemented Code**:
[PASTE CODE FROM PHASE 2]

This is iteration 1 of the review.
```

### Expected Claude Output

```
## Code Review

**Iteration**: 1
**Overall Assessment**: APPROVED WITH MINOR NOTES

### Strengths
- Clean separation of concerns with ThemeContext
- Good use of React hooks
- localStorage integration works correctly
- Handles system preference detection

### Critical Issues
- None

### Major Issues
- Consider adding error handling for localStorage quota exceeded
- The theme should apply immediately without page flicker

### Minor Issues / Suggestions
- Add JSDoc comments to ThemeContext functions
- Consider using a more robust theme detection library

### Approval Status
**Approved**: YES
**Requires Changes**: NO
**Ready for QA**: YES

### Next Steps
The implementation is approved. Proceed to QA testing with these notes in mind.
```

### Decision: ✅ APPROVED - PROCEED TO PHASE 4

---

## Phase 4: QA Testing ✓

### What You Do

1. Copy the entire **qa.md** prompt
2. Provide all code, story, and acceptance criteria
3. Specify tech stack

### Example Input to Claude

```
[COPY ENTIRE qa.md PROMPT]

Then provide:

**User Story**:
[PASTE STORY]

**Acceptance Criteria**:
1. Toggle button is visible in header
2. Clicking toggle switches theme
3. Preference saved in localStorage
4. Theme persists on reload
5. Dark theme has good contrast
6. Works on all modern browsers

**Implementation**:
[PASTE THE CODE]

**Tech Stack**: React 18, TypeScript, Tailwind CSS, localStorage

**What to test specifically**:
- Test dark mode toggle functionality
- Verify localStorage persistence
- Check accessibility compliance
- Verify on multiple browsers
- Check for console errors
```

### Expected Claude Output

```
## QA Test Report

### Summary
**Tests Passed**: 11/11
**Tests Failed**: 0
**Overall Status**: PASS
**Code Coverage**: 85%

### Acceptance Criteria Testing

#### ✓ Criteria 1: Toggle button visible in header
Status: PASS
Evidence: Button renders in Header component, properly styled and positioned

#### ✓ Criteria 2: Clicking toggles theme
Status: PASS
Evidence: Theme switches correctly on toggle click, DOM updates with dark class

#### ✓ Criteria 3: Preference saved in localStorage
Status: PASS
Evidence: localStorage.setItem called with correct key/value pairs

#### ✓ Criteria 4: Theme persists on reload
Status: PASS
Evidence: useEffect retrieves value from localStorage on mount, applies correctly

#### ✓ Criteria 5: Dark theme contrast
Status: PASS
Evidence: Tailwind dark mode colors meet WCAG AA standards

#### ✓ Criteria 6: Cross-browser support
Status: PASS
Evidence: Works on Chrome, Firefox, Safari, Edge

### Code Coverage
- Covered: ThemeContext, ThemeToggle, integration
- Not Covered: Error boundary edge cases
- Coverage Score: 85%

### Security Assessment
- Vulnerabilities Found: None
- No XSS risks
- No data exposure

### Sign-Off
**Ready for Production**: YES
**Approved by QA**: YES
```

### Decision: ✅ READY FOR DEPLOYMENT

---

## 📊 Complete Timeline

```
Phase 1: Plan Skeptic (5 min)     → Story VALID ✓
Phase 2: Coder (10 min)           → Code implemented ✓
Phase 3: Code Reviewer (5 min)    → Approved ✓
Phase 4: QA (8 min)               → Tests pass ✓

Total: ~30 minutes
Result: Ready for production ✅
```

## 💾 Files to Keep

After completing this workflow, you might save:

```
project/
├── user-stories/
│   └── US-001-dark-mode.md          (original story)
├── implementations/
│   └── US-001-implementation.md     (phase 2 output)
├── reviews/
│   └── US-001-review.md             (phase 3 output)
└── qa/
    └── US-001-qa-report.md          (phase 4 output)
```

## 🎓 Key Learnings

1. **Plan Skeptic catches issues early** - Better to fix story clarity than code later
2. **Coder needs context** - Tech stack and project info helps generate better code
3. **Code review has a limit** - 2 iterations keeps things moving while ensuring quality
4. **QA is the final safety net** - Comprehensive testing catches what code review misses

---

This complete workflow takes 30-60 minutes per story and works with any AI platform (Claude, ChatGPT, etc.).