---
prev:
  text: '9.5 AI-Native Development Mode'
  link: '/09-ai-agents/ai-native-dev'
next:
  text: '10.1 Multi-Agent Architecture'
  link: '/10-multi-agent/'
---

# 9.6 Browser Use & Web Agent

## What if AI Could Browse the Web for You?

Imagine this: you're lying on the couch and tell AI, "Help me check flights from Shanghai to Beijing tomorrow, under 1000 yuan, and fill in my passport info." Then you watch the browser automatically open Ctrip, enter dates, filter prices, fill forms, and send you screenshots of the results.

This isn't science fiction, this is what **Browser Use** and **Web Agent** are doing right now.

If Computer Use (Chapter 9.4) gives AI a mouse and keyboard to control your entire computer, then Browser Use gives AI a "browser license" to drive specifically in the web world. More precise, safer, and cheaper—after all, you don't want AI to accidentally delete your code while helping you book tickets, right?

## What is Browser Use?

**Browser Use** is a technology that lets AI control a real browser. Unlike traditional API calls or web scrapers, Browser Use allows AI to act like a human:

- **See** web pages (through screenshots or DOM trees)
- **Think** about what to do next (through LLM reasoning)
- **Operate** the browser (click, type, scroll, select dropdowns)
- **Verify** results (check if the page meets expectations)

It's like teaching an intern to use a computer, except this intern's "eyes" are vision models, "brain" is GPT-4, and "hands" are Playwright or Selenium.

### Core Capabilities

| Capability | Description | Analogy |
|------|------|------|
| **Visual Perception** | Understand page content through screenshots or DOM | Like you looking at the screen with your eyes |
| **Action Execution** | Click, type, scroll, navigate | Like you operating with mouse and keyboard |
| **Task Planning** | Break down goals into step sequences | Like mentally planning "login first, then search, then order" |
| **Error Recovery** | Handle captchas, popups, and other exceptions | Like pressing "back" when you click wrong |

## Three Major Projects

### 1. browser-use (Python)

[browser-use](https://github.com/browser-use/browser-use) is currently the most popular open-source Browser Use library, based on Playwright and LangChain.

**Features:**
- Ready to use, runs with just a few lines of code
- Supports multiple LLMs (OpenAI, Anthropic, Ollama, etc.)
- Built-in templates for common tasks (search, form filling, shopping)
- Automatically handles waiting, scrolling, iframes, and other complex scenarios

**Architecture:**
```
User Task → LangChain Agent → Playwright Browser → Web Page
              ↑                      ↓
              └─── Screenshot/DOM ──────────┘
```

### 2. Playwright + AI (Custom Solutions)

Many teams use **Playwright** (Microsoft's browser automation tool) + **Claude/GPT** to build custom Web Agents.

**Advantages:**
- Complete control, fine-tunable
- Can integrate into existing test frameworks
- Supports complex multi-step flows (login, state persistence, multi-page navigation)

**Disadvantages:**
- Need to handle prompt engineering, error retry, context management yourself
- High development cost

### 3. Anthropic Computer Use (Browser Mode)

Anthropic's **Computer Use** API launched a dedicated browser control mode at the end of 2024, powered by Claude 3.5 Sonnet.

**Features:**
- No extra code needed, just call the API
- Built-in security sandbox (prevents AI from misbehaving)
- Supports screenshot + coordinate clicking (similar to Computer Use's general approach)

**Comparison:**
- **Browser Use**: Optimized for web pages, can read DOM, more precise element location
- **Computer Use browser mode**: General approach, relies on screenshot + coordinate clicking, flexible but may misclick

## How It Works: Screenshot Loop + Action Planning

Browser Use's core is a **"Perceive-Think-Execute"** loop:

```python
while not task_completed:
    # 1. Perceive: Screenshot or read DOM
    screenshot = browser.screenshot()
    dom_tree = browser.get_dom()
    
    # 2. Think: Let LLM decide next step
    action = llm.plan_next_action(
        task="Search Python tutorial",
        current_page=screenshot,
        dom=dom_tree
    )
    
    # 3. Execute: Call browser API
    if action.type == "click":
        browser.click(action.selector)
    elif action.type == "type":
        browser.type(action.selector, action.text)
    elif action.type == "navigate":
        browser.goto(action.url)
    
    # 4. Verify: Check if goal is achieved
    if verify_success(browser, task):
        break
```

### Key Technologies

#### 1. DOM Tree vs Screenshot

| Approach | Advantages | Disadvantages | Cost |
|------|------|------|------|
| **Screenshot** | See real rendering (color, layout) | Requires vision model (GPT-4V), expensive | High($) |
| **DOM Tree** | Clear structure, precise element location | Can't see styles, need to handle massive HTML | Low |
| **Hybrid** | Screenshot for understanding + DOM for precise operations | Complex implementation | Medium |

Best practice: **DOM tree + key step screenshots**. For example, use DOM for form filling (cheap and fast), use screenshots when encountering captchas or complex pages (accurate but expensive).

#### 2. Action Planning

LLM needs to break down vague tasks like "help me book a ticket" into:

```json
[
  {"action": "navigate", "url": "https://flights.ctrip.com"},
  {"action": "click", "selector": "#departure-input"},
  {"action": "type", "text": "Shanghai"},
  {"action": "click", "selector": "#arrival-input"},
  {"action": "type", "text": "Beijing"},
  {"action": "click", "selector": "#search-button"},
  {"action": "wait", "condition": "results loaded"},
  {"action": "filter", "criteria": "price < 1000"}
]
```

The challenge here is: **where do selectors come from?**

- **Method 1**: LLM directly generates CSS selectors (error-prone)
- **Method 2**: First extract all clickable elements → LLM selects → return index (more reliable)
- **Method 3**: Use AI to label each element (similar to SeeAct paper approach)

#### 3. Error Recovery

The web world is full of surprises:
- **Popup ads**: Detect overlay → click close button
- **Slow loading**: Wait for element to appear, retry on timeout
- **404 pages**: Detect error → go back or replan
- **Captchas**: Call captcha solving service or notify user

```python
try:
    browser.click("#submit-button")
except ElementNotFound:
    # Might be blocked by popup
    if browser.find("#ad-popup"):
        browser.click("#close-ad")
        browser.click("#submit-button")  # Retry
```

## Five Real-World Scenarios

### 1. Data Collection (Web Scraping 2.0)

Traditional scrapers: write XPath, handle anti-scraping, maintain scripts (breaks when website changes).

Browser Use scrapers:
```python
agent.run("Go to Douban Movie Top 250, scrape all movie names and ratings, save to CSV")
```

**Advantages:**
- Not afraid of page redesigns (AI adapts to new layouts)
- Automatically handles login, pagination, lazy loading
- Scrapes dynamic content (JS-rendered pages)

**Case**: An e-commerce company monitors competitor prices using Browser Use to automatically check 100 products daily, alerting when prices drop.

### 2. Form Auto-filling

HR filling job sites, finance filling expense systems, developers filling issue templates... the nemesis of repetitive labor is here:

```python
from browser_use import Agent

agent = Agent(
    task="Submit an issue on GitHub for python/cpython",
    model="gpt-4o"
)

agent.run({
    "title": "Suggestion to improve asyncio documentation",
    "body": "Current documentation lacks explanation of gather() timeout parameter...",
    "labels": ["documentation"]
})
```

**Real effect**: A SaaS company uses Browser Use to auto-fill customer onboarding forms, reducing time from 10 minutes (manual) to 1 minute (AI).

### 3. Automated Testing

Traditional E2E testing:
```javascript
// Hardcoded selectors, breaks when website changes
await page.click('#login-button-v2-new-final');
```

AI-driven testing:
```python
agent.run("Login with test account, create a new project, check if successful")
```

**Advantages:**
- No need to maintain selectors (AI finds elements itself)
- Can write test cases in natural language
- Automatically adapts to UI changes

**Limitations**: Slower than traditional tests (needs to call LLM each step), higher cost, suitable for smoke testing rather than full regression.

### 4. Competitive Analysis

```python
agent.run("""
Visit competitor website competitor.com:
1. Record featured functions on homepage
2. Check pricing page, save screenshots
3. Go to blog section, find titles of latest 3 articles
4. Compile into a report and email me
""")
```

Run it automatically once a week, even the boss loves it.

### 5. End-to-End Research

New academic trick: let AI search papers on arXiv, download PDFs, extract key passages, generate reviews.

```python
agent.run("""
Go to arXiv.org and search 'large language model agent',
find papers from 2024 onwards, download top 10 with citations > 50,
extract core contributions from each, write as a table
""")
```

## Code Practice: Using the browser-use Library

### Installation

```bash
pip install browser-use playwright
playwright install chromium
```

### Example 1: Auto Search

```python
from langchain_openai import ChatOpenAI
from browser_use import Agent

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o")

# Create Agent
agent = Agent(
    task="Go to Google and search 'Playwright vs Selenium', open first result, summarize main points",
    llm=llm,
)

# Run
result = agent.run()
print(result)
```

**Output:**
```
✓ Opened google.com
✓ Entered search term
✓ Clicked first link
✓ Read page content

Summary:
Playwright advantages over Selenium:
1. Faster (uses CDP protocol directly)
2. Auto-waits for elements
3. Supports multiple browser contexts
...
```

### Example 2: Fill Form

```python
from browser_use import Agent

agent = Agent(
    task="Visit https://example.com/contact, fill contact form",
    llm=ChatOpenAI(model="gpt-4o")
)

agent.run({
    "name": "Zhang San",
    "email": "zhangsan@example.com",
    "message": "Inquiring about product pricing"
})
```

**Internal flow:**
1. Agent navigates to URL
2. Identifies form fields (via DOM tree or vision)
3. Fills name, email, message sequentially
4. Clicks submit button
5. Verifies "submission successful" message appears

### Example 3: E-commerce Price Comparison

```python
from browser_use import Agent

agent = Agent(
    task="Search 'iPhone 15 Pro' on JD and Taobao, record prices of top 3 results",
    llm=ChatOpenAI(model="gpt-4o")
)

prices = agent.run()
# Output:
# {
#   "JD": [7999, 8199, 7899],
#   "Taobao": [7888, 8099, 7999]
# }
```

### Advanced: Custom Tools

```python
from browser_use import Agent, BrowserTool

class ScreenshotTool(BrowserTool):
    """Save screenshot when encountering image captcha"""
    def detect(self, page):
        return page.locator("img[alt*='captcha']").count() > 0
    
    def execute(self, page):
        page.screenshot(path="captcha.png")
        return "Captcha saved, please handle manually"

agent = Agent(
    task="Login to website",
    llm=llm,
    tools=[ScreenshotTool()]
)
```

## Browser Use vs Computer Use

These two technologies are often confused, but they're quite different:

| Dimension | Browser Use | Computer Use (Chapter 9.4) |
|------|-------------|---------------------|
| **Control Range** | Can only operate browser | Controls entire operating system |
| **Implementation** | Playwright/Selenium + LLM | VNC/screenshots + coordinate clicking |
| **Location Precision** | High (can read DOM tree) | Medium (relies on visual recognition) |
| **Cost** | Low (DOM is cheap) | High (needs vision model each step) |
| **Speed** | Fast (directly calls browser API) | Slow (screenshot→analyze→click) |
| **Security** | High (sandboxed within browser) | Low (may misoperate system files) |
| **Use Cases** | Web automation, scraping, testing | Desktop software operations, cross-app flows |

### Selection Guide

**Use Browser Use if:**
- ✅ Task entirely within web pages
- ✅ Need precise element location (e.g., form filling)
- ✅ Cost-sensitive
- ✅ Need to handle complex web interactions (iframes, shadow DOM)

**Use Computer Use if:**
- ✅ Need to cross multiple apps (browser + Excel + Email)
- ✅ Operating desktop software (Photoshop, VS Code)
- ✅ Web has no accessible DOM (Canvas-rendered games, complex Flash pages)

**Examples:**
- Auto download file and rename → **Computer Use** (involves browser + file system)
- Scrape e-commerce data → **Browser Use** (pure web operations)
- Auto send email (web Gmail) → **Browser Use** (completed within browser)
- Auto send email (Outlook desktop client) → **Computer Use** (desktop software)

### Technical Comparison: Element Location

**Browser Use:**
```python
# Precise location via DOM tree
button = page.locator("button:has-text('Submit')")
button.click()
```

**Computer Use:**
```python
# Identify coordinates via screenshot
screenshot = capture_screen()
coords = ai.find_button(screenshot, "Submit")
mouse.click(coords.x, coords.y)
```

Browser Use's location accuracy is close to 100%, Computer Use's visual recognition may be 85%-95%.

## Security Considerations

Letting AI control your browser sounds cool, but has risks:

### Risk 1: Sensitive Information Leakage

AI might send your passwords, credit card numbers to LLM API (then contaminate training data).

**Protection:**
- Use dedicated test accounts, not real passwords
- Manually fill sensitive fields, don't delegate to AI
- Use local models (Ollama) instead of APIs

```python
# Wrong approach
agent.run("Use my credit card 6225-8888-xxxx-1234 to buy something")

# Correct approach
agent.run("Fill order information, but wait for manual confirmation for payment step")
```

### Risk 2: Misoperations

AI might click wrong buttons:
- Delete important data
- Submit incomplete forms
- Click "Select All" → "Delete"

**Protection:**
- Run in sandboxed environment (VM, Docker)
- Screenshot confirmation before critical operations
- Set operation whitelist (allow read only, no delete)

```python
agent = Agent(
    task="Browse reports",
    allowed_actions=["click", "scroll"],  # Disable type, submit
)
```

### Risk 3: Website Bans

Frequent automated operations may be identified as bots, leading to IP bans.

**Protection:**
- Simulate human behavior (random delays, mouse trajectories)
- Use proxy IPs
- Control request frequency

```python
from browser_use import Agent

agent = Agent(
    task="Scrape data",
    human_mode=True,  # Enable human behavior simulation
    delay_range=(2, 5)  # Delay 2-5 seconds per action
)
```

### Risk 4: Cost Overruns

Each GPT-4V call to view a page may cost $0.01-0.05, if AI enters a loop (e.g., can't find button), can burn through tens of dollars in minutes.

**Protection:**
- Set maximum step limit
- Monitor token consumption
- Prefer DOM over screenshots

```python
agent = Agent(
    task="Search materials",
    max_steps=20,  # Max 20 operations
    budget_limit=1.0  # Max spend $1
)
```

## Real Case: Automated News Summary

Suppose you want to receive AI summaries of tech news every morning:

```python
from browser_use import Agent
from langchain_openai import ChatOpenAI
import schedule

def daily_news_summary():
    agent = Agent(
        task="""
        Visit Hacker News (news.ycombinator.com),
        find top 10 news items, extract titles and links,
        visit each news item, generate 2-sentence summary,
        organize into Markdown format
        """,
        llm=ChatOpenAI(model="gpt-4o")
    )
    
    summary = agent.run()
    
    # Send to email or Slack
    send_email("daily-summary@example.com", summary)

# Run daily at 8am
schedule.every().day.at("08:00").do(daily_news_summary)
```

**Effect:**
```markdown
# Today's Tech News (2026-02-22)

1. **New AI Chip Released**
   Performance increased 3x, power consumption reduced 50%, expected mass production next year.
   Link: https://...

2. **React 19 Officially Released**
   Supports server components, compiler optimization, backward compatible.
   Link: https://...

...
```

## Future Trends

### 1. Multimodal Fusion

Future Web Agents won't just view pages, but also:
- **Listen** to audio on web pages (podcasts, video explanations)
- **Speak** to interact with voice assistants
- **Understand** charts, maps, 3D models

### 2. Cross-Page Memory

Current Agents are typically single-task, future will have "resident Agents":
- Remember your preferences (e.g., always choose economy class)
- Cross-site coordination (check info on site A → order on site B)
- Long-term learning (understand you better over time)

### 3. Collaborative Browsing

Human + AI browsing together:
- You view pages, AI gives real-time tips ("this price is high, suggest looking around")
- AI helps fill forms, you make final confirmation
- For complex decisions (like choosing insurance), AI explains each option

### 4. Fusion with Computer Use

Browser Use and Computer Use will gradually merge:
- Use DOM location in browser (precise + cheap)
- Switch to visual mode when encountering Canvas, plugins, or complex elements
- Call Computer Use capabilities when needing cross-app operations

Ultimate form: a unified "digital workforce" that works on any interface.

## One-Sentence Summary

**Browser Use is giving AI a "browser license" to click around the web world for you, so you just give commands and let AI drive, but remember to buckle up—don't let it empty your shopping cart.**

---

:::tip Practical Advice
1. **Start with simple tasks**: Try searching, screenshots, data scraping first, don't jump into login/payment
2. **Monitor costs**: Set budget limits, prefer DOM over vision models
3. **Run in sandbox**: Use test accounts, don't practice on production
4. **Human-AI collaboration**: Let AI do repetitive work, keep critical decisions to humans
:::

:::warning Common Pitfalls
- **Infinite loops**: AI can't find elements and keeps retrying, remember to set `max_steps`
- **Captchas**: Encountering human verification is basically game over, needs manual intervention
- **Dynamic content**: SPA pages may need to wait for JS to load completely
- **Popup ads**: Some sites have too many popups, AI gets confused
:::

Next chapter we'll discuss **Multi-Agent Architecture**, letting multiple Browser Agents work in parallel for doubled efficiency!
