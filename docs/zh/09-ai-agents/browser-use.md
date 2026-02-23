---
prev:
  text: '9.5 AI-Native 开发模式'
  link: '/zh/09-ai-agents/ai-native-dev'
next:
  text: '10.1 多 Agent 架构'
  link: '/zh/10-multi-agent/'
---

# 9.6 Browser Use & Web Agent

## 如果 AI 能替你上网会怎样?

想象一下:你躺在沙发上,对着 AI 说"帮我查一下明天上海到北京的航班,价格低于 1000 块的,顺便填好我的护照信息"。然后你就看着浏览器自己打开携程,输入日期,筛选价格,填写表单,最后把结果截图发给你。

这不是科幻片,这是 **Browser Use** 和 **Web Agent** 正在做的事情。

如果说 Computer Use(第 9.4 章)是给 AI 一个鼠标键盘让它控制你的整个电脑,那 Browser Use 就是给 AI 一个"浏览器驾照",让它专门在网页世界里开车。更精准,更安全,也更便宜——毕竟你不希望 AI 在帮你订票的时候不小心把你的代码删了吧?

## 什么是 Browser Use?

**Browser Use** 是一种让 AI 控制真实浏览器的技术。与传统的 API 调用或网页爬虫不同,Browser Use 让 AI 像人一样:

- **看**网页(通过截图或 DOM 树)
- **思考**下一步要做什么(通过 LLM 推理)
- **操作**浏览器(点击、输入、滚动、选择下拉框)
- **验证**结果(检查页面是否符合预期)

就像你教一个实习生用电脑一样,只不过这个实习生的"眼睛"是视觉模型,"大脑"是 GPT-4,"手"是 Playwright 或 Selenium。

### 核心能力

| 能力 | 描述 | 类比 |
|------|------|------|
| **视觉感知** | 通过截图或 DOM 理解页面内容 | 就像你用眼睛看屏幕 |
| **动作执行** | 点击、输入、滚动、导航 | 就像你用鼠标键盘操作 |
| **任务规划** | 分解目标为步骤序列 | 就像你心里想"先登录,再搜索,再下单" |
| **错误恢复** | 遇到验证码、弹窗等异常情况的应对 | 就像你点错了会按"后退" |

## 三大主流项目

### 1. browser-use (Python)

[browser-use](https://github.com/browser-use/browser-use) 是目前最火的开源 Browser Use 库,基于 Playwright 和 LangChain。

**特点:**
- 开箱即用,几行代码就能跑
- 支持多种 LLM(OpenAI、Anthropic、Ollama 等)
- 内置常见任务模板(搜索、表单填写、购物)
- 自动处理等待、滚动、iframe 等复杂场景

**架构:**
```
User Task → LangChain Agent → Playwright Browser → Web Page
              ↑                      ↓
              └─── 截图/DOM ──────────┘
```

### 2. Playwright + AI (自定义方案)

很多团队用 **Playwright**(微软出品的浏览器自动化工具)+ **Claude/GPT** 自建 Web Agent。

**优势:**
- 完全掌控,可以精细调优
- 可以集成到现有测试框架
- 支持复杂的多步骤流程(登录、状态保持、多页面跳转)

**劣势:**
- 需要自己处理 prompt 工程、错误重试、上下文管理
- 开发成本高

### 3. Anthropic Computer Use (浏览器模式)

Anthropic 的 **Computer Use** API 在 2024 年底推出了专门的浏览器控制模式,通过 Claude 3.5 Sonnet 驱动。

**特点:**
- 不需要额外代码,直接调 API
- 内置安全沙箱(防止 AI 乱操作)
- 支持截图 + 坐标点击(类似 Computer Use 的通用方案)

**对比:**
- **Browser Use**: 专为网页优化,可以读 DOM,定位元素更精准
- **Computer Use 浏览器模式**: 通用方案,靠截图+坐标点击,灵活但可能误点

## 工作原理:截图循环 + 动作规划

Browser Use 的核心是一个 **"感知-思考-执行"** 循环:

```python
while not task_completed:
    # 1. 感知:截图或读取 DOM
    screenshot = browser.screenshot()
    dom_tree = browser.get_dom()
    
    # 2. 思考:让 LLM 决定下一步
    action = llm.plan_next_action(
        task="搜索 Python 教程",
        current_page=screenshot,
        dom=dom_tree
    )
    
    # 3. 执行:调用浏览器 API
    if action.type == "click":
        browser.click(action.selector)
    elif action.type == "type":
        browser.type(action.selector, action.text)
    elif action.type == "navigate":
        browser.goto(action.url)
    
    # 4. 验证:检查是否达成目标
    if verify_success(browser, task):
        break
```

### 关键技术

#### 1. DOM 树 vs 截图

| 方案 | 优势 | 劣势 | 成本 |
|------|------|------|------|
| **截图** | 看到真实渲染效果(颜色、布局) | 需要视觉模型(GPT-4V),贵 | 高($) |
| **DOM 树** | 结构清晰,元素可精准定位 | 看不到样式,需要处理海量 HTML | 低 |
| **混合** | 截图辅助理解 + DOM 精准操作 | 实现复杂 | 中 |

最佳实践:**DOM 树 + 关键步骤截图**。比如填表单用 DOM(便宜快速),遇到验证码或复杂页面再截图(准确但贵)。

#### 2. 动作规划

LLM 需要把"帮我订票"这种模糊任务拆解为:

```json
[
  {"action": "navigate", "url": "https://flights.ctrip.com"},
  {"action": "click", "selector": "#departure-input"},
  {"action": "type", "text": "上海"},
  {"action": "click", "selector": "#arrival-input"},
  {"action": "type", "text": "北京"},
  {"action": "click", "selector": "#search-button"},
  {"action": "wait", "condition": "results loaded"},
  {"action": "filter", "criteria": "price < 1000"}
]
```

这里的挑战是:**selector 怎么来?**

- **方法 1**: LLM 直接生成 CSS selector(容易出错)
- **方法 2**: 先提取页面所有可点击元素 → LLM 选择 → 返回序号(更可靠)
- **方法 3**: 用 AI 给每个元素打标签(类似 SeeAct 论文的做法)

#### 3. 错误恢复

网页世界充满意外:
- **弹窗广告**: 检测到遮挡层 → 点击关闭按钮
- **加载慢**: 等待元素出现,超时重试
- **404 页面**: 检测到错误 → 返回上一页或重新规划
- **验证码**: 调用打码平台或通知用户

```python
try:
    browser.click("#submit-button")
except ElementNotFound:
    # 可能被弹窗挡住了
    if browser.find("#ad-popup"):
        browser.click("#close-ad")
        browser.click("#submit-button")  # 重试
```

## 五大实战场景

### 1. 数据采集(Web Scraping 2.0)

传统爬虫:写 XPath,处理反爬,维护脚本(网站一改就炸)。

Browser Use 爬虫:
```python
agent.run("去豆瓣电影 Top 250,把所有电影名和评分抓下来存成 CSV")
```

**优势:**
- 不怕页面改版(AI 会适应新布局)
- 自动处理登录、翻页、懒加载
- 抓取动态内容(JS 渲染的页面)

**案例**: 某电商监控竞品价格,用 Browser Use 每天自动巡检 100 个商品,发现降价就告警。

### 2. 表单自动填写

HR 填招聘网站、财务填报销系统、开发者填 issue 模板……重复劳动的天敌来了:

```python
from browser_use import Agent

agent = Agent(
    task="在 GitHub 上给 python/cpython 提一个 issue",
    model="gpt-4o"
)

agent.run({
    "title": "建议改进 asyncio 文档",
    "body": "当前文档缺少 gather() 的超时参数说明...",
    "labels": ["documentation"]
})
```

**实际效果**: 某 SaaS 公司用 Browser Use 自动填写客户 onboarding 表单,从人工 10 分钟降到 AI 1 分钟。

### 3. 自动化测试

传统 E2E 测试:
```javascript
// 写死的选择器,网站一改就挂
await page.click('#login-button-v2-new-final');
```

AI 驱动测试:
```python
agent.run("用测试账号登录,创建一个新项目,检查是否成功")
```

**优势:**
- 不需要维护 selector(AI 自己找元素)
- 可以用自然语言写测试用例
- 自动适应 UI 改动

**局限**: 比传统测试慢(每步都要调 LLM),成本高,适合冒烟测试而非全量回归。

### 4. 竞品分析

```python
agent.run("""
访问竞品网站 competitor.com:
1. 记录首页的主打功能
2. 看看定价页,截图保存
3. 去博客区,找最近 3 篇文章的标题
4. 整理成报告发我邮箱
""")
```

每周自动跑一次,老板看了都说好。

### 5. 端到端研究

学术圈新玩法:让 AI 自己上 arXiv 搜论文、下载 PDF、提取关键段落、生成综述。

```python
agent.run("""
去 arXiv.org 搜索 'large language model agent',
找 2024 年后的论文,下载引用量 > 50 的前 10 篇,
提取每篇的核心贡献,写成表格
""")
```

## 代码实战:用 browser-use 库

### 安装

```bash
pip install browser-use playwright
playwright install chromium
```

### 示例 1:自动搜索

```python
from langchain_openai import ChatOpenAI
from browser_use import Agent

# 初始化 LLM
llm = ChatOpenAI(model="gpt-4o")

# 创建 Agent
agent = Agent(
    task="去 Google 搜索 'Playwright vs Selenium',打开第一个结果,总结主要观点",
    llm=llm,
)

# 运行
result = agent.run()
print(result)
```

**输出:**
```
✓ 打开 google.com
✓ 输入搜索词
✓ 点击第一个链接
✓ 读取页面内容

总结:
Playwright 相比 Selenium 的优势:
1. 更快(直接用 CDP 协议)
2. 自动等待元素
3. 支持多浏览器上下文
...
```

### 示例 2:填写表单

```python
from browser_use import Agent

agent = Agent(
    task="访问 https://example.com/contact,填写联系表单",
    llm=ChatOpenAI(model="gpt-4o")
)

agent.run({
    "name": "张三",
    "email": "zhangsan@example.com",
    "message": "咨询产品价格"
})
```

**内部流程:**
1. Agent 导航到 URL
2. 识别表单字段(通过 DOM 树或视觉)
3. 依次填写 name、email、message
4. 点击提交按钮
5. 验证是否出现"提交成功"提示

### 示例 3:电商比价

```python
from browser_use import Agent

agent = Agent(
    task="在京东和淘宝搜索 'iPhone 15 Pro',记录前 3 个结果的价格",
    llm=ChatOpenAI(model="gpt-4o")
)

prices = agent.run()
# 输出:
# {
#   "京东": [7999, 8199, 7899],
#   "淘宝": [7888, 8099, 7999]
# }
```

### 高级:自定义工具

```python
from browser_use import Agent, BrowserTool

class ScreenshotTool(BrowserTool):
    """遇到图形验证码时截图保存"""
    def detect(self, page):
        return page.locator("img[alt*='captcha']").count() > 0
    
    def execute(self, page):
        page.screenshot(path="captcha.png")
        return "验证码已保存,请人工处理"

agent = Agent(
    task="登录网站",
    llm=llm,
    tools=[ScreenshotTool()]
)
```

## Browser Use vs Computer Use

这两个技术经常被混淆,但其实差别挺大:

| 维度 | Browser Use | Computer Use (9.4 章) |
|------|-------------|---------------------|
| **控制范围** | 只能操作浏览器 | 控制整个操作系统 |
| **实现方式** | Playwright/Selenium + LLM | VNC/屏幕截图 + 坐标点击 |
| **定位精度** | 高(可以读 DOM 树) | 中(靠视觉识别) |
| **成本** | 低(DOM 便宜) | 高(每步都要视觉模型) |
| **速度** | 快(直接调浏览器 API) | 慢(截图→分析→点击) |
| **安全性** | 高(沙箱限制在浏览器内) | 低(可能误操作系统文件) |
| **适用场景** | 网页自动化、爬虫、测试 | 桌面软件操作、跨应用流程 |

### 选择建议

**用 Browser Use 如果:**
- ✅ 任务全程在网页里完成
- ✅ 需要精准定位元素(比如填表单)
- ✅ 对成本敏感
- ✅ 需要处理复杂的网页交互(iframe、shadow DOM)

**用 Computer Use 如果:**
- ✅ 需要跨多个应用(浏览器 + Excel + Email)
- ✅ 操作的是桌面软件(Photoshop、VS Code)
- ✅ 网页没有可访问的 DOM(Canvas 渲染的游戏、复杂 Flash 页面)

**例子:**
- 自动下载文件并重命名 → **Computer Use**(涉及浏览器 + 文件系统)
- 抓取电商数据 → **Browser Use**(纯网页操作)
- 自动发邮件(网页版 Gmail) → **Browser Use**(浏览器内完成)
- 自动发邮件(Outlook 桌面客户端) → **Computer Use**(桌面软件)

### 技术对比:元素定位

**Browser Use:**
```python
# 通过 DOM 树精准定位
button = page.locator("button:has-text('提交')")
button.click()
```

**Computer Use:**
```python
# 通过截图识别坐标
screenshot = capture_screen()
coords = ai.find_button(screenshot, "提交")
mouse.click(coords.x, coords.y)
```

Browser Use 的定位准确率接近 100%,Computer Use 靠视觉识别可能在 85%-95%。

## 安全性考量

让 AI 控制浏览器听起来很酷,但也有风险:

### 风险 1:敏感信息泄露

AI 可能把你的密码、信用卡号发给 LLM API(进而被训练数据污染)。

**防护:**
- 用专门的测试账号,不用真实密码
- 敏感字段人工填写,不交给 AI
- 用本地模型(Ollama)而非 API

```python
# 错误示范
agent.run("用我的信用卡 6225-8888-xxxx-1234 买东西")

# 正确做法
agent.run("填写订单信息,但支付步骤等待人工确认")
```

### 风险 2:误操作

AI 可能点错按钮:
- 删除了重要数据
- 提交了未完成的表单
- 点了"全选" → "删除"

**防护:**
- 运行在沙箱环境(虚拟机、Docker)
- 关键操作前截图确认
- 设置操作白名单(只允许读取,不允许删除)

```python
agent = Agent(
    task="浏览报表",
    allowed_actions=["click", "scroll"],  # 禁止 type、submit
)
```

### 风险 3:网站封禁

频繁的自动化操作可能被识别为爬虫,导致 IP 被封。

**防护:**
- 模拟人类行为(随机延迟、鼠标轨迹)
- 使用代理 IP
- 控制请求频率

```python
from browser_use import Agent

agent = Agent(
    task="抓取数据",
    human_mode=True,  # 启用人类行为模拟
    delay_range=(2, 5)  # 每步操作延迟 2-5 秒
)
```

### 风险 4:成本失控

每次调用 GPT-4V 看一个页面可能花费 $0.01-0.05,如果 AI 陷入循环(比如一直找不到按钮),几分钟就能烧掉几十美元。

**防护:**
- 设置最大步数限制
- 监控 token 消耗
- 优先用 DOM 而非截图

```python
agent = Agent(
    task="搜索资料",
    max_steps=20,  # 最多 20 步操作
    budget_limit=1.0  # 最多花 $1
)
```

## 实战案例:自动化新闻摘要

假设你想每天早上收到科技新闻的 AI 摘要:

```python
from browser_use import Agent
from langchain_openai import ChatOpenAI
import schedule

def daily_news_summary():
    agent = Agent(
        task="""
        访问 Hacker News (news.ycombinator.com),
        找到前 10 条新闻,提取标题和链接,
        访问每条新闻,生成 2 句话摘要,
        整理成 Markdown 格式
        """,
        llm=ChatOpenAI(model="gpt-4o")
    )
    
    summary = agent.run()
    
    # 发送到邮箱或 Slack
    send_email("daily-summary@example.com", summary)

# 每天早上 8 点运行
schedule.every().day.at("08:00").do(daily_news_summary)
```

**效果:**
```markdown
# 今日科技新闻 (2026-02-22)

1. **新型 AI 芯片发布**
   性能提升 3 倍,功耗降低 50%,预计明年量产。
   链接: https://...

2. **React 19 正式发布**
   支持服务端组件,编译器优化,兼容旧版本。
   链接: https://...

...
```

## 未来趋势

### 1. 多模态融合

未来的 Web Agent 不只看页面,还能:
- **听**网页上的音频(播客、视频讲解)
- **说**与语音助手交互
- **理解**图表、地图、3D 模型

### 2. 跨页面记忆

当前 Agent 通常是单任务的,未来会有"常驻 Agent":
- 记住你的偏好(比如总是选经济舱)
- 跨网站协调(在 A 网站查信息 → B 网站下单)
- 长期学习(越用越懂你)

### 3. 协作式浏览

人类 + AI 一起浏览:
- 你看网页,AI 在旁边实时提示("这个价格偏高,建议再看看")
- AI 帮你填表单,你负责最后确认
- 遇到复杂决策(比如选保险),AI 解释每个选项

### 4. 与 Computer Use 融合

Browser Use 和 Computer Use 会逐渐合并:
- 在浏览器里用 DOM 定位(精准+便宜)
- 遇到 Canvas、插件等复杂元素切换到视觉模式
- 需要跨应用时调用 Computer Use 能力

最终形态:一个统一的"数字劳动力",在任何界面上都能工作。

## 一句话总结

**Browser Use 就是给 AI 发一张"浏览器驾照",让它在网页世界里替你点点点,从此你只管下命令,剩下的交给 AI 开车,不过记得系好安全带——别让它把你的购物车清空了。**

---

:::tip 实战建议
1. **从简单任务开始**: 先试试搜索、截图、抓数据,别一上来就搞登录支付
2. **监控成本**: 设置预算上限,优先用 DOM 而非视觉模型
3. **沙箱运行**: 用测试账号,别拿生产环境练手
4. **人机协作**: 让 AI 做重复劳动,关键决策留给人类
:::

:::warning 常见坑
- **无限循环**: AI 找不到元素会一直重试,记得设置 `max_steps`
- **验证码**: 遇到人机验证基本凉凉,需要人工介入
- **动态内容**: SPA 页面可能需要等待 JS 加载完成
- **弹窗广告**: 有些网站弹窗太多,AI 会被搞晕
:::

下一章我们会讲**多 Agent 架构**,让多个 Browser Agent 并行工作,效率翻倍!
