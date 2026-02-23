---
prev:
  text: '14.4 团队 AI 工具链搭建'
  link: '/zh/14-practice/team-toolchain'
next:
  text: '14.6 AI 驱动的文档与知识管理'
  link: '/zh/14-practice/doc-management'
---

# 14.5 AI 辅助数据分析

## 当产品经理不再需要"麻烦帮我查一下数据"

想象这样的场景:产品经理在群里 @你:"兄弟,帮我查一下上周新用户的留存率,按渠道分组,要去掉测试账号。"你看着电脑屏幕,深吸一口气,打开 SQL 客户端,开始写那个你这个月已经写了八次的类似查询...

等等!2026 年了,我们为什么还在做人肉 SQL 翻译机?AI 可以直接把"上周新用户留存率"这种人话转成 SQL 查询,甚至还能顺便画个图表。今天我们就来聊聊如何用 AI 让数据分析变得像聊天一样简单。

## Text-to-SQL:让 AI 成为你的 SQL 翻译官

Text-to-SQL 的核心思想很简单:用户用自然语言提问,AI 自动生成对应的 SQL 查询。听起来很科幻?其实现在的大模型已经能做得相当不错了。

### 工作原理

整个流程大概是这样的:

1. **用户提问**:"上个月销售额超过 10 万的客户有多少?"
2. **AI 理解意图**:识别出需要查询的表(customers、orders)、时间范围(上个月)、聚合条件(销售额 > 10万)
3. **生成 SQL**:根据数据库 schema 生成对应查询
4. **执行并返回结果**:可以直接展示数据或用自然语言总结

关键的技术点是:AI 需要知道你的数据库结构(schema)。就像你不能指望一个从没见过你代码库的人写出正确的查询,AI 也需要"认识"你的表和字段。

### 实战代码:用 OpenAI 构建 Text-to-SQL

让我们写一个简单但实用的 Text-to-SQL 函数:

```python
import openai
import sqlite3
from typing import Dict, Any

class TextToSQLAgent:
    def __init__(self, db_path: str, openai_api_key: str):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        openai.api_key = openai_api_key
        self.schema = self._extract_schema()
    
    def _extract_schema(self) -> str:
        """提取数据库 schema 供 AI 参考"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT sql FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        schema_description = "数据库结构:\n\n"
        for table in tables:
            schema_description += f"{table[0]}\n\n"
        
        return schema_description
    
    def query(self, natural_language_question: str) -> Dict[str, Any]:
        """
        将自然语言问题转换为 SQL 并执行
        
        Args:
            natural_language_question: 用户的自然语言问题
            
        Returns:
            包含 SQL、结果和解释的字典
        """
        # 构建 prompt
        prompt = f"""你是一个 SQL 专家。根据以下数据库结构,将用户的问题转换为 SQL 查询。

{self.schema}

用户问题: {natural_language_question}

请返回一个 JSON 对象,包含以下字段:
- sql: 生成的 SQL 查询
- explanation: 用中文简单解释这个查询做了什么

只返回 JSON,不要其他内容。"""

        # 调用 OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个数据库查询助手,精通 SQL。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2  # 低温度让生成更稳定
        )
        
        # 解析响应
        import json
        result = json.loads(response.choices[0].message.content)
        
        # 执行 SQL
        try:
            cursor = self.conn.cursor()
            cursor.execute(result['sql'])
            data = cursor.fetchall()
            columns = [description[0] for description in cursor.description]
            
            return {
                "sql": result['sql'],
                "explanation": result['explanation'],
                "data": data,
                "columns": columns,
                "success": True
            }
        except Exception as e:
            return {
                "sql": result['sql'],
                "explanation": result['explanation'],
                "error": str(e),
                "success": False
            }
    
    def __del__(self):
        self.conn.close()

# 使用示例
agent = TextToSQLAgent(
    db_path="company.db",
    openai_api_key="your-api-key"
)

# 自然语言查询
result = agent.query("过去 30 天内注册的用户中,完成过至少一次购买的有多少?")

if result['success']:
    print(f"SQL: {result['sql']}\n")
    print(f"解释: {result['explanation']}\n")
    print(f"结果:")
    print(f"{result['columns']}")
    for row in result['data']:
        print(row)
else:
    print(f"查询失败: {result['error']}")
```

### 进阶技巧

上面的代码是基础版,实际生产环境中你还需要考虑:

**1. Schema 优化**

不要把整个数据库结构都塞给 AI,那样 token 会爆炸。可以:
- 只包含相关表(通过关键词匹配预筛选)
- 添加字段注释和示例值
- 标注表之间的关系

```python
def _extract_schema_smart(self, question: str) -> str:
    """根据问题智能筛选相关表"""
    # 简单的关键词匹配
    keywords = question.lower().split()
    relevant_tables = []
    
    cursor = self.conn.cursor()
    cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")
    
    for name, sql in cursor.fetchall():
        # 如果表名或结构中包含问题关键词,就包含进来
        if any(keyword in name.lower() or keyword in sql.lower() for keyword in keywords):
            relevant_tables.append((name, sql))
    
    return "\n\n".join([f"表: {name}\n{sql}" for name, sql in relevant_tables])
```

**2. SQL 安全性检查**

AI 可能会生成危险的 SQL(比如 DROP TABLE),必须加白名单验证:

```python
def _is_safe_sql(self, sql: str) -> bool:
    """检查 SQL 是否安全(只允许 SELECT)"""
    sql_upper = sql.strip().upper()
    dangerous_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE']
    
    if not sql_upper.startswith('SELECT'):
        return False
    
    for keyword in dangerous_keywords:
        if keyword in sql_upper:
            return False
    
    return True
```

**3. 结果缓存**

相同的问题不需要重复调用 AI 和数据库:

```python
import hashlib
from functools import lru_cache

@lru_cache(maxsize=100)
def query_cached(self, question: str):
    return self.query(question)
```

## AI-Powered BI:不用写代码的数据分析

如果你不想自己搭建 Text-to-SQL 系统,市面上已经有不少现成的 AI 驱动 BI 工具:

### Julius AI

Julius AI 是一个专为数据分析设计的 AI 助手。你可以:
- 上传 CSV/Excel 文件
- 用自然语言提问:"按月份展示销售趋势"
- 自动生成图表和统计报告

特别适合不太懂 SQL 的产品经理或运营同学。

### ChatGPT Code Interpreter(高级数据分析)

OpenAI 的 Code Interpreter 功能现在改名叫"高级数据分析",可以:
- 上传数据文件
- 用自然语言描述分析需求
- AI 自动写 Python 代码做分析,生成可视化

我实测过,处理简单的数据清洗和可视化非常快,比自己写 pandas 代码快多了。

### Tableau Pulse / Power BI Copilot

传统 BI 工具也在拥抱 AI:
- **Tableau Pulse**:自动发现数据洞察,用自然语言解释趋势
- **Power BI Copilot**:自然语言生成 DAX 查询和可视化

如果你们公司已经在用这些工具,直接启用 AI 功能就行,不用重新搭建。

## 搭建内部"问数据库"机器人

最实用的场景是给团队搭建一个 Slack/企业微信 机器人,让任何人都能用自然语言查数据。

### 架构设计

```
[用户] -> [聊天平台 Bot] -> [Text-to-SQL 服务] -> [数据库]
                                      |
                                      v
                          [权限校验 & 结果格式化]
                                      |
                                      v
                          [返回结果给用户]
```

### 核心功能

1. **权限控制**:不同用户能查询的表不同
2. **结果限制**:自动加 LIMIT 防止查询量过大
3. **查询审计**:记录谁查了什么,方便追踪
4. **智能建议**:根据历史查询推荐常用问题

### 快速原型:Slack Bot 示例

```python
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

app = App(token="xoxb-your-token")

# 初始化 Text-to-SQL agent
sql_agent = TextToSQLAgent(db_path="company.db", openai_api_key="your-key")

@app.message("查询:")
def handle_query(message, say):
    """处理以'查询:'开头的消息"""
    question = message['text'].replace("查询:", "").strip()
    user = message['user']
    
    # 权限检查(简化版)
    if not is_user_allowed(user):
        say("抱歉,你没有查询权限。请联系管理员。")
        return
    
    # 执行查询
    say(f"正在查询: {question}...")
    result = sql_agent.query(question)
    
    if result['success']:
        # 格式化结果
        response = f"*SQL:*\n```{result['sql']}```\n\n*结果:*\n"
        
        # 简单的表格格式
        response += " | ".join(result['columns']) + "\n"
        response += "-" * 50 + "\n"
        for row in result['data'][:10]:  # 只显示前 10 行
            response += " | ".join(str(cell) for cell in row) + "\n"
        
        if len(result['data']) > 10:
            response += f"\n_(共 {len(result['data'])} 条结果,仅显示前 10 条)_"
        
        say(response)
    else:
        say(f"查询失败: {result['error']}")

def is_user_allowed(user_id: str) -> bool:
    """检查用户是否有查询权限"""
    # 实际项目中应该查询权限数据库
    allowed_users = ["U01234567", "U07654321"]
    return user_id in allowed_users

# 启动 bot
if __name__ == "__main__":
    handler = SocketModeHandler(app, "xapp-your-token")
    handler.start()
```

## 完整示例:一个生产级 Text-to-SQL 函数

把上面的所有最佳实践整合起来:

```python
import openai
import sqlite3
import hashlib
import json
from typing import Dict, Any, List, Optional
from datetime import datetime

class ProductionTextToSQL:
    def __init__(
        self,
        db_path: str,
        openai_api_key: str,
        allowed_tables: Optional[List[str]] = None
    ):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        openai.api_key = openai_api_key
        self.allowed_tables = allowed_tables
        self.query_log = []
    
    def _get_relevant_schema(self, question: str) -> str:
        """根据问题智能选择相关表的 schema"""
        cursor = self.conn.cursor()
        
        if self.allowed_tables:
            placeholders = ','.join('?' * len(self.allowed_tables))
            cursor.execute(
                f"SELECT name, sql FROM sqlite_master WHERE type='table' AND name IN ({placeholders})",
                self.allowed_tables
            )
        else:
            cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")
        
        all_tables = cursor.fetchall()
        
        # 简单的相关性评分
        keywords = set(question.lower().split())
        scored_tables = []
        
        for name, sql in all_tables:
            score = sum(1 for keyword in keywords if keyword in name.lower() or keyword in sql.lower())
            if score > 0:
                scored_tables.append((score, name, sql))
        
        # 返回最相关的前 5 个表
        scored_tables.sort(reverse=True)
        schema = "\n\n".join([
            f"表名: {name}\nDDL: {sql}"
            for _, name, sql in scored_tables[:5]
        ])
        
        return schema if schema else "未找到相关表"
    
    def _is_safe_query(self, sql: str) -> tuple[bool, str]:
        """检查 SQL 是否安全"""
        sql_upper = sql.strip().upper()
        
        # 必须是 SELECT
        if not sql_upper.startswith('SELECT'):
            return False, "只允许 SELECT 查询"
        
        # 禁止的关键词
        forbidden = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE']
        for keyword in forbidden:
            if keyword in sql_upper:
                return False, f"禁止使用 {keyword} 操作"
        
        # 必须有 LIMIT
        if 'LIMIT' not in sql_upper:
            sql += " LIMIT 100"  # 自动添加 LIMIT
        
        return True, sql
    
    def query(
        self,
        question: str,
        user_id: Optional[str] = None,
        explain: bool = True
    ) -> Dict[str, Any]:
        """
        执行自然语言查询
        
        Args:
            question: 自然语言问题
            user_id: 用户 ID(用于审计)
            explain: 是否返回 AI 的解释
            
        Returns:
            查询结果字典
        """
        start_time = datetime.now()
        
        # 获取相关 schema
        schema = self._get_relevant_schema(question)
        
        # 构建 prompt
        prompt = f"""你是 SQL 专家。根据数据库结构将问题转为 SQL。

{schema}

问题: {question}

返回 JSON:
\{\{
    "sql": "生成的 SQL 查询",
    "explanation": "用中文简要解释"
\}\}
注意:
1. 只生成 SELECT 语句
2. 如果需要聚合多条记录,使用 LIMIT
3. 日期相关查询使用 date() 函数"""

        try:
            # 调用 AI
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "你是数据库查询助手。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1
            )
            
            ai_result = json.loads(response.choices[0].message.content)
            sql = ai_result['sql']
            explanation = ai_result.get('explanation', '')
            
            # 安全检查
            is_safe, safe_sql = self._is_safe_query(sql)
            if not is_safe:
                return {
                    "success": False,
                    "error": safe_sql,
                    "question": question
                }
            
            # 执行 SQL
            cursor = self.conn.cursor()
            cursor.execute(safe_sql)
            data = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            
            # 记录日志
            duration = (datetime.now() - start_time).total_seconds()
            self._log_query(user_id, question, safe_sql, True, duration)
            
            return {
                "success": True,
                "sql": safe_sql,
                "explanation": explanation if explain else None,
                "columns": columns,
                "data": data,
                "row_count": len(data),
                "duration_seconds": duration
            }
            
        except json.JSONDecodeError:
            return {
                "success": False,
                "error": "AI 返回格式错误",
                "question": question
            }
        except sqlite3.Error as e:
            self._log_query(user_id, question, sql, False, 0)
            return {
                "success": False,
                "error": f"SQL 执行错误: {str(e)}",
                "sql": sql,
                "question": question
            }
    
    def _log_query(
        self,
        user_id: Optional[str],
        question: str,
        sql: str,
        success: bool,
        duration: float
    ):
        """记录查询日志"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "question": question,
            "sql": sql,
            "success": success,
            "duration": duration
        }
        self.query_log.append(log_entry)
        
        # 实际项目中应该写入持久化存储
        # 这里简化为内存列表
    
    def get_query_stats(self) -> Dict[str, Any]:
        """获取查询统计"""
        if not self.query_log:
            return {"total_queries": 0}
        
        total = len(self.query_log)
        success = sum(1 for log in self.query_log if log['success'])
        avg_duration = sum(log['duration'] for log in self.query_log) / total
        
        return {
            "total_queries": total,
            "success_rate": success / total,
            "avg_duration_seconds": avg_duration,
            "recent_queries": self.query_log[-5:]
        }

# 使用示例
if __name__ == "__main__":
    agent = ProductionTextToSQL(
        db_path="company.db",
        openai_api_key="your-api-key",
        allowed_tables=["users", "orders", "products"]  # 白名单
    )
    
    # 执行查询
    result = agent.query(
        question="过去 7 天每天的订单数量",
        user_id="user_123"
    )
    
    if result['success']:
        print(f"✓ 查询成功({result['duration_seconds']:.2f}s)")
        print(f"\nSQL:\n{result['sql']}\n")
        print(f"说明: {result['explanation']}\n")
        print(f"结果({result['row_count']} 行):")
        print(result['columns'])
        for row in result['data']:
            print(row)
    else:
        print(f"✗ 查询失败: {result['error']}")
    
    # 查看统计
    stats = agent.get_query_stats()
    print(f"\n统计: {stats}")
```

## 注意事项与最佳实践

### 1. 成本控制

每次调用 GPT-4 都要花钱,控制成本的方法:
- 使用 GPT-3.5-turbo 处理简单查询
- 缓存常见问题的 SQL
- 压缩 schema 信息,只传必要内容

### 2. 准确度优化

AI 生成的 SQL 不是 100% 准确,可以:
- 提供少量示例查询(few-shot learning)
- 添加字段和表的详细注释
- 让 AI 生成多个候选 SQL,用启发式规则选择最优

### 3. 用户体验

好的数据查询机器人应该:
- 响应速度快(< 5 秒)
- 支持追问("按地区再分组一下")
- 自动生成可视化(简单的条形图/折线图)
- 提供查询历史,方便重复使用

## 一句话总结

**AI 驱动的数据分析让「问数据」变得像聊天一样简单,Text-to-SQL 技术把自然语言直接转成 SQL 查询,配合权限控制和安全检查,你可以用不到 200 行代码搭建一个生产级的"问数据库"机器人,让团队里的任何人都能自助分析数据,再也不用排队找数据分析师了。**

:::tip 下一步
现在你知道怎么用 AI 查数据了,但查出来的数据怎么变成文档和知识?下一节我们聊聊 **AI 驱动的文档与知识管理**,看看 AI 如何自动生成 API 文档、会议纪要,甚至检测过时的文档。
:::
