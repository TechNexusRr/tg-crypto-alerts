# Code Expert Documentor Agent

The **Code Expert Documentor** generates comprehensive documentation for your code - docstrings, comments, API docs, architecture guides, and usage examples.

## 📖 What It Does

Transforms raw code into **fully documented, maintainable code** with:

✓ Comprehensive docstrings
✓ Clear inline comments
✓ Usage examples
✓ API documentation
✓ Architecture explanation
✓ Integration guides
✓ Performance notes
✓ Error handling docs

## 🎯 When to Use It

Use the **Code Documentor** when you have:
- Implemented code that needs documentation
- Complex algorithms that need explanation
- New modules/features without docs
- Public APIs that need reference docs
- Code that integrates with other systems
- Performance-critical code that needs notes
- New developers on the team who need context

## 🚀 How to Use

### Step 1: Prepare Your Code

Gather:
- The code you want documented
- Brief description of what it does
- Where it fits in the project
- Who uses it
- Any special considerations

### Step 2: Copy the Documentor Prompt

Open `agents/prompts/code-documentor.md`
Copy the entire file

### Step 3: Paste into Claude/ChatGPT

1. Go to [claude.com](https://claude.com) or [ChatGPT.com](https://chatgpt.com)
2. Start a new conversation
3. Paste the entire Code Documentor prompt
4. Scroll to "Now, Please Document This Code" section

### Step 4: Provide Your Code

Paste:
```
# CODE TO DOCUMENT

[Your code here]

# CONTEXT

What this code does: [Description]
Where it fits: [Module/component name]
Who uses it: [Other parts that depend on it]
Why it matters: [Business or technical importance]

# DOCUMENTATION LEVEL

[ ] Level 1: Quick docstrings
[ ] Level 2: With inline comments
[x] Level 3: Full architecture doc  (pick your level)
[ ] Level 4: Everything

# ADDITIONAL NOTES

[Any special context]
```

### Step 5: Get Documented Code

Claude will:
1. Read PROJECT-IMPLEMENTATION.md for project context
2. Analyze your code deeply
3. Generate comprehensive docstrings
4. Add inline comments where needed
5. Create usage examples
6. Explain architecture if complex
7. Document all APIs and parameters
8. Return fully documented code

### Step 6: Use the Result

Copy the documented code back into your project

## 📚 Documentation Levels

### Level 1: Quick Docstrings
```typescript
/**
 * Check if price has moved enough to trigger alert
 * @param current Current price
 * @param anchor Reference price
 * @param amount Movement threshold
 * @returns true if should fire
 */
function shouldFire(current: number, anchor: number, amount: number): boolean {
  return Math.abs(current - anchor) >= amount;
}
```

**Good for**: Simple functions, getters/setters, straightforward logic

### Level 2: With Inline Comments
```typescript
/**
 * Check if price has moved enough to trigger alert
 *
 * Movement alerts use absolute value to detect moves in either direction.
 * If anchor is $2000 and amount is $10, fires at $2010 or $1990.
 *
 * @param current Current price
 * @param anchor Reference price
 * @param amount Movement threshold
 * @returns true if should fire
 */
function shouldFire(current: number, anchor: number, amount: number): boolean {
  // Calculate absolute difference from anchor
  const difference = Math.abs(current - anchor);

  // Fire if difference meets or exceeds threshold
  return difference >= amount;
}
```

**Good for**: Core logic, important functions, slightly complex operations

### Level 3: Full Architecture Doc
```typescript
/**
 * Alert Evaluation Engine - Core alert processing loop
 *
 * This function is the heart of the crypto alerts system. It runs
 * approximately every 100ms, checking all active alerts against
 * current prices and triggering those that meet their conditions.
 *
 * Process Flow:
 * 1. Fetch all active alerts from database
 * 2. Get current prices from price bus (Binance/Bybit)
 * 3. For each alert:
 *    a. Evaluate if trigger condition is met
 *    b. If triggered: send notification, update state, log event
 *    c. Update database with new alert state
 * 4. Return count of triggered alerts for metrics
 *
 * Performance:
 * - Time Complexity: O(n) where n = number of active alerts
 * - Space Complexity: O(1) (processes in-place)
 * - Target execution: <50ms (runs every ~100ms)
 *
 * Error Handling:
 * - Database errors: Retried with exponential backoff
 * - Notification failures: Queued for later retry
 * - Price feed issues: Graceful degradation (alerts don't fire)
 *
 * Integration Points:
 * - Consumes: Price updates from price-bus (priceEmitter)
 * - Produces: Alert triggered events (alertEmitter)
 * - Reads: Database (alerts table)
 * - Writes: Database (alert_events table)
 *
 * @param prices Live price map from price bus {symbol: price}
 * @returns Number of alerts triggered
 * @throws {DatabaseError} If DB operations fail (caught and retried)
 * @throws {TelegramError} If notification fails (caught and queued)
 *
 * @example
 * // Runs continuously from price bus events
 * priceEmitter.on('prices', async (prices) => {
 *   const triggered = await evaluateAlerts(prices);
 *   logger.info(`Triggered ${triggered} alerts`);
 *   metrics.alertsTriggered.inc(triggered);
 * });
 *
 * @see {@link movement-alert.ts} for MovementAlert implementation
 * @see {@link price-bus.ts} for price event format
 * @see {@link alert-store.ts} for database operations
 */
async function evaluateAlerts(prices: Map<string, number>): Promise<number> {
  // Fetch all active alerts from database
  const alerts = await alertStore.getAllActive();
  let triggeredCount = 0;

  // Evaluate each alert against current prices
  for (const alert of alerts) {
    const currentPrice = prices.get(alert.symbol);

    // Skip if price unavailable (shouldn't happen, but be safe)
    if (!currentPrice) {
      logger.warn(`No price available for ${alert.symbol}`);
      continue;
    }

    // Check if this alert should fire
    if (alert.shouldFire(currentPrice)) {
      try {
        // Fire the alert (send notification, update state, log event)
        await alert.fire(currentPrice);

        // Update database with new alert state
        await alertStore.update(alert.id, alert);

        // Log event for audit trail and metrics
        await logEvent(alert.id, 'triggered', { triggerPrice: currentPrice });

        triggeredCount++;
      } catch (error) {
        // Log but don't crash - continue processing other alerts
        logger.error(`Failed to fire alert ${alert.id}`, error);
      }
    }
  }

  return triggeredCount;
}
```

**Good for**: Complex logic, important components, team onboarding

### Level 4: Everything
Level 3 + API reference, examples, troubleshooting, related code links

## 💡 Types of Documentation

### Docstrings (Always)
```typescript
/**
 * Brief one-line description
 *
 * Longer explanation of what this does, why it exists,
 * and important context.
 *
 * @param name Description of parameter
 * @returns What it returns
 * @throws Error conditions that can occur
 * @example How to use it
 * @see Related code or functions
 */
```

### Inline Comments (When Needed)
```typescript
// What this does and why it matters, not just what the code says
const difference = Math.abs(current - anchor);
```

### Architecture Documentation
Explain the bigger picture:
- What the component does
- How it fits in the system
- Data flows in and out
- Key design decisions
- Performance characteristics

### API Reference
For public functions/endpoints:
- Parameters and types
- Response format
- Possible errors
- Rate limiting
- Authentication
- Examples

### Usage Examples
Show how to use the code:
- Basic usage
- Common patterns
- Edge cases
- Integration with other modules

## 🎓 For tg-crypto-alerts Project

The documentor understands your project:

✓ Telegram bot structure and commands
✓ Alert types and how they work
✓ Database schema and Drizzle ORM
✓ WebSocket feeds (Binance, Bybit)
✓ Service layer patterns
✓ Event emitters and flows
✓ Error handling approach
✓ Logging and metrics

Can document:
- New bot commands
- Alert engine improvements
- Database service changes
- Price feed integrations
- New event types
- Service layer additions

## 📝 Example: Documenting an Alert Handler

### Input (Your Code)
```typescript
async function handleAlert(userId: string, alertId: string) {
  const alert = await db.get(alertId);
  if (!alert) throw new Error('Not found');
  if (alert.userId !== userId) throw new Error('Unauthorized');
  const price = await getPrice(alert.symbol);
  await notify(userId, `Alert fired: ${alert.symbol} at ${price}`);
}
```

### Output (Documented)
```typescript
/**
 * Process a triggered alert and notify user
 *
 * Called when an alert's trigger condition is met. Sends a Telegram
 * notification to the user with alert details and current price.
 *
 * Security: Validates user ownership before notifying
 * Errors: Queues notification for retry on failure
 *
 * @param userId User ID from Telegram
 * @param alertId ID of the alert that triggered
 * @returns void (sends notification as side effect)
 * @throws {NotFoundError} If alert doesn't exist
 * @throws {UnauthorizedError} If user doesn't own this alert
 * @throws {TelegramError} If notification fails (caught and queued)
 *
 * @example
 * // Called from alert evaluation loop
 * if (alert.shouldFire(currentPrice)) {
 *   await handleAlert(userId, alert.id);
 * }
 */
async function handleAlert(userId: string, alertId: string): Promise<void> {
  // Fetch alert from database
  const alert = await db.get(alertId);

  // Validate alert exists
  if (!alert) {
    throw new NotFoundError(`Alert ${alertId} not found`);
  }

  // Security: Ensure user owns this alert
  if (alert.userId !== userId) {
    throw new UnauthorizedError(`User ${userId} doesn't own alert ${alertId}`);
  }

  // Get current price for display
  const price = await getPrice(alert.symbol);

  // Send notification to user
  await notify(userId, `Alert fired: ${alert.symbol} at ${price}`);
}
```

## 🚀 Quick Start

1. **Identify code to document**
   - New features
   - Complex functions
   - Public APIs
   - Integration points

2. **Copy the prompt**
   ```
   Open: agents/prompts/code-documentor.md
   Copy entire content
   ```

3. **Paste in Claude**
   - Go to claude.com
   - Paste the prompt
   - Scroll to "Now, Please Document This Code"

4. **Provide your code**
   ```
   # CODE TO DOCUMENT
   [Your code]

   # CONTEXT
   What: Brief description
   Where: Module/component
   Who: Users of this code
   Why: Business importance

   # DOCUMENTATION LEVEL
   [Choose 1-4]
   ```

5. **Get documented code back**
   - Copy result
   - Paste into your project
   - Commit with the code change

## 📊 When to Document What

### High Priority (Always Document)
- Public functions and classes
- Complex algorithms
- API endpoints
- Service layer methods
- Database operations
- Event handlers

### Medium Priority (Should Document)
- Internal utility functions
- Business logic
- Error handling code
- Async operations
- Integration code

### Low Priority (Optional)
- Simple getters/setters
- One-liner functions
- Self-explanatory code
- Tests (usually self-documenting)

## 💬 Documentation Standards for Your Project

Documentor creates docs that match:

✓ Your project's style (based on PROJECT-IMPLEMENTATION.md)
✓ TypeScript conventions
✓ Existing docstring patterns
✓ Code comment style
✓ Example format
✓ Error handling approach

## 🔗 Integration with Other Agents

**Workflow**:
```
Story Writer → creates story
Plan Skeptic → validates
Coder → implements code
Code Reviewer → reviews code
QA → tests code
Code Documentor → documents code ← You are here
```

After code is approved by QA, run it through Code Documentor before merging!

## ✅ Documentation Checklist

For each documented code section:
- [ ] Purpose is crystal clear
- [ ] Parameters are documented
- [ ] Return values are explained
- [ ] Errors/exceptions listed
- [ ] At least one usage example
- [ ] Related code referenced
- [ ] Why (not just what) explained
- [ ] Side effects noted
- [ ] Performance noted if important
- [ ] Matches project style

## 🎓 Tips for Better Documentation

1. **Show, Don't Tell**
   - ✓ Include working examples
   - ✗ "This function calculates the price"

2. **Explain the Why**
   - ✓ "We use absolute value to detect moves in either direction"
   - ✗ "Math.abs() is used"

3. **Document Assumptions**
   - What does this code assume about inputs?
   - What guarantees does it provide?

4. **Include Limits**
   - Max concurrent calls?
   - Rate limits?
   - Performance constraints?

5. **Link Related Code**
   - Reference other modules
   - Link to related issues/PRs
   - Note dependencies

## 🚀 Try It Now

1. Pick a piece of code you want documented
2. Copy `agents/prompts/code-documentor.md`
3. Paste into Claude
4. Provide your code and context
5. Get back fully documented code!

---

**You now have a documentation expert on your team!** 📚✨

Create clear, maintainable code with comprehensive documentation that helps your team understand, use, and maintain your codebase.

Happy documenting! 📖🎉
