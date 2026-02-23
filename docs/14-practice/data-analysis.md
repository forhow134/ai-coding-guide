---
prev:
  text: '14.4 Team AI Toolchain Setup'
  link: '/14-practice/team-toolchain'
next:
  text: '14.6 AI-Driven Documentation and Knowledge Management'
  link: '/14-practice/doc-management'
---

# 14.5 AI-Assisted Data Analysis

## When Product Managers No Longer Need to "Please Help Me Check the Data"

Imagine this scenario: The product manager @mentions you in the group: "Hey, can you check last week's new user retention rate, grouped by channel, excluding test accounts." You stare at your computer screen, take a deep breath, open the SQL client, and start writing that similar query you've already written eight times this month...

Wait! It's 2026—why are we still being human SQL translation machines? AI can directly convert "last week's new user retention rate" into SQL queries, and even draw charts for you. Today, let's talk about how AI can make data analysis as simple as chatting.

## Text-to-SQL: Let AI Be Your SQL Translator

The core idea of Text-to-SQL is simple: users ask questions in natural language, AI automatically generates corresponding SQL queries. Sounds sci-fi? Current large models can already do this quite well.

### How It Works

The entire process goes something like this:

1. **User Question**: "How many customers had sales exceeding 100,000 last month?"
2. **AI Understands Intent**: Identifies tables to query (customers, orders), time range (last month), aggregation conditions (sales > 100k)
3. **Generate SQL**: Generate corresponding query based on database schema
4. **Execute and Return Results**: Can directly display data or summarize in natural language

The key: AI needs to know your database structure (schema). Just as you can't expect someone who's never seen your codebase to write correct queries, AI also needs to "know" your tables and fields.

### Hands-On Code: Build Text-to-SQL with OpenAI

Let's write a simple but practical Text-to-SQL function:

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
        """Extract database schema for AI reference"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT sql FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        schema_description = "Database structure:\n\n"
        for table in tables:
            schema_description += f"{table[0]}\n\n"
        
        return schema_description
    
    def query(self, natural_language_question: str) -> Dict[str, Any]:
        """
        Convert natural language question to SQL and execute
        
        Args:
            natural_language_question: User's natural language question
            
        Returns:
            Dictionary containing SQL, results, and explanation
        """
        # Build prompt
        prompt = f"""You are a SQL expert. Based on the following database structure, convert the user's question into a SQL query.

{self.schema}

User question: {natural_language_question}

Please return a JSON object with the following fields:
- sql: The generated SQL query
- explanation: Brief explanation in English of what this query does

Return only JSON, nothing else."""

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a database query assistant, proficient in SQL."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2  # Lower temperature for more stable generation
        )
        
        # Parse response
        import json
        result = json.loads(response.choices[0].message.content)
        
        # Execute SQL
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

# Usage example
agent = TextToSQLAgent(
    db_path="company.db",
    openai_api_key="your-api-key"
)

# Natural language query
result = agent.query("Of users registered in the past 30 days, how many have completed at least one purchase?")

if result['success']:
    print(f"SQL: {result['sql']}\n")
    print(f"Explanation: {result['explanation']}\n")
    print(f"Results:")
    print(f"{result['columns']}")
    for row in result['data']:
        print(row)
else:
    print(f"Query failed: {result['error']}")
```

### Advanced Techniques

The above code is a basic version. In actual production environments, you also need to consider:

**1. Schema Optimization**

Don't stuff the entire database structure into the AI—that'll blow up your tokens. You can:
- Include only relevant tables (pre-filter by keyword matching)
- Add field comments and example values
- Mark relationships between tables

```python
def _extract_schema_smart(self, question: str) -> str:
    """Intelligently filter relevant tables based on question"""
    # Simple keyword matching
    keywords = question.lower().split()
    relevant_tables = []
    
    cursor = self.conn.cursor()
    cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")
    
    for name, sql in cursor.fetchall():
        # If table name or structure contains question keywords, include it
        if any(keyword in name.lower() or keyword in sql.lower() for keyword in keywords):
            relevant_tables.append((name, sql))
    
    return "\n\n".join([f"Table: {name}\n{sql}" for name, sql in relevant_tables])
```

**2. SQL Safety Check**

AI might generate dangerous SQL (like DROP TABLE), must add whitelist validation:

```python
def _is_safe_sql(self, sql: str) -> bool:
    """Check if SQL is safe (only allow SELECT)"""
    sql_upper = sql.strip().upper()
    dangerous_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE']
    
    if not sql_upper.startswith('SELECT'):
        return False
    
    for keyword in dangerous_keywords:
        if keyword in sql_upper:
            return False
    
    return True
```

**3. Result Caching**

Same questions don't need to call AI and database repeatedly:

```python
import hashlib
from functools import lru_cache

@lru_cache(maxsize=100)
def query_cached(self, question: str):
    return self.query(question)
```

## AI-Powered BI: Data Analysis Without Writing Code

If you don't want to build your own Text-to-SQL system, there are many ready-made AI-powered BI tools on the market:

### Julius AI

Julius AI is an AI assistant designed for data analysis. You can:
- Upload CSV/Excel files
- Ask questions in natural language: "Show sales trends by month"
- Auto-generate charts and statistical reports

Especially suitable for product managers or operations folks who aren't very SQL-savvy.

### ChatGPT Code Interpreter (Advanced Data Analysis)

OpenAI's Code Interpreter feature, now renamed "Advanced Data Analysis", can:
- Upload data files
- Describe analysis needs in natural language
- AI automatically writes Python code for analysis, generates visualizations

I've tested it—handles simple data cleaning and visualization very quickly, much faster than writing pandas code yourself.

### Tableau Pulse / Power BI Copilot

Traditional BI tools are also embracing AI:
- **Tableau Pulse**: Automatically discovers data insights, explains trends in natural language
- **Power BI Copilot**: Natural language generates DAX queries and visualizations

If your company already uses these tools, just enable AI features directly—no need to rebuild from scratch.

## Build an Internal "Ask the Database" Bot

The most practical scenario is building a Slack/Enterprise WeChat bot for your team, letting anyone query data with natural language.

### Architecture Design

```
[User] -> [Chat Platform Bot] -> [Text-to-SQL Service] -> [Database]
                                      |
                                      v
                          [Permission Check & Result Formatting]
                                      |
                                      v
                          [Return Results to User]
```

### Core Features

1. **Permission Control**: Different users can query different tables
2. **Result Limiting**: Auto-add LIMIT to prevent excessive queries
3. **Query Auditing**: Log who queried what, for tracking
4. **Smart Suggestions**: Recommend common questions based on query history

### Quick Prototype: Slack Bot Example

```python
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

app = App(token="xoxb-your-token")

# Initialize Text-to-SQL agent
sql_agent = TextToSQLAgent(db_path="company.db", openai_api_key="your-key")

@app.message("query:")
def handle_query(message, say):
    """Handle messages starting with 'query:'"""
    question = message['text'].replace("query:", "").strip()
    user = message['user']
    
    # Permission check (simplified version)
    if not is_user_allowed(user):
        say("Sorry, you don't have query permissions. Please contact administrator.")
        return
    
    # Execute query
    say(f"Querying: {question}...")
    result = sql_agent.query(question)
    
    if result['success']:
        # Format results
        response = f"*SQL:*\n```{result['sql']}```\n\n*Results:*\n"
        
        # Simple table format
        response += " | ".join(result['columns']) + "\n"
        response += "-" * 50 + "\n"
        for row in result['data'][:10]:  # Only show first 10 rows
            response += " | ".join(str(cell) for cell in row) + "\n"
        
        if len(result['data']) > 10:
            response += f"\n_(Total {len(result['data'])} results, showing first 10 only)_"
        
        say(response)
    else:
        say(f"Query failed: {result['error']}")

def is_user_allowed(user_id: str) -> bool:
    """Check if user has query permissions"""
    # Real projects should query permissions database
    allowed_users = ["U01234567", "U07654321"]
    return user_id in allowed_users

# Start bot
if __name__ == "__main__":
    handler = SocketModeHandler(app, "xapp-your-token")
    handler.start()
```

## Complete Example: Production-Grade Text-to-SQL Function

Integrating all the best practices above:

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
        """Intelligently select relevant table schemas based on question"""
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
        
        # Simple relevance scoring
        keywords = set(question.lower().split())
        scored_tables = []
        
        for name, sql in all_tables:
            score = sum(1 for keyword in keywords if keyword in name.lower() or keyword in sql.lower())
            if score > 0:
                scored_tables.append((score, name, sql))
        
        # Return top 5 most relevant tables
        scored_tables.sort(reverse=True)
        schema = "\n\n".join([
            f"Table name: {name}\nDDL: {sql}"
            for _, name, sql in scored_tables[:5]
        ])
        
        return schema if schema else "No relevant tables found"
    
    def _is_safe_query(self, sql: str) -> tuple[bool, str]:
        """Check if SQL is safe"""
        sql_upper = sql.strip().upper()
        
        # Must be SELECT
        if not sql_upper.startswith('SELECT'):
            return False, "Only SELECT queries allowed"
        
        # Forbidden keywords
        forbidden = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE']
        for keyword in forbidden:
            if keyword in sql_upper:
                return False, f"Use of {keyword} operation prohibited"
        
        # Must have LIMIT
        if 'LIMIT' not in sql_upper:
            sql += " LIMIT 100"  # Auto-add LIMIT
        
        return True, sql
    
    def query(
        self,
        question: str,
        user_id: Optional[str] = None,
        explain: bool = True
    ) -> Dict[str, Any]:
        """
        Execute natural language query
        
        Args:
            question: Natural language question
            user_id: User ID (for auditing)
            explain: Whether to return AI's explanation
            
        Returns:
            Query result dictionary
        """
        start_time = datetime.now()
        
        # Get relevant schema
        schema = self._get_relevant_schema(question)
        
        # Build prompt
        prompt = f"""You are a SQL expert. Convert the question into SQL based on the database structure.

{schema}

Question: {question}

Return JSON:
\{\{
    "sql": "generated SQL query",
    "explanation": "brief explanation in English"
\}\}
Notes:
1. Generate only SELECT statements
2. If aggregating multiple records, use LIMIT
3. For date-related queries, use date() function"""

        try:
            # Call AI
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a database query assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1
            )
            
            ai_result = json.loads(response.choices[0].message.content)
            sql = ai_result['sql']
            explanation = ai_result.get('explanation', '')
            
            # Safety check
            is_safe, safe_sql = self._is_safe_query(sql)
            if not is_safe:
                return {
                    "success": False,
                    "error": safe_sql,
                    "question": question
                }
            
            # Execute SQL
            cursor = self.conn.cursor()
            cursor.execute(safe_sql)
            data = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            
            # Log query
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
                "error": "AI return format error",
                "question": question
            }
        except sqlite3.Error as e:
            self._log_query(user_id, question, sql, False, 0)
            return {
                "success": False,
                "error": f"SQL execution error: {str(e)}",
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
        """Log query"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "question": question,
            "sql": sql,
            "success": success,
            "duration": duration
        }
        self.query_log.append(log_entry)
        
        # Real projects should write to persistent storage
        # Simplified here as in-memory list
    
    def get_query_stats(self) -> Dict[str, Any]:
        """Get query statistics"""
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

# Usage example
if __name__ == "__main__":
    agent = ProductionTextToSQL(
        db_path="company.db",
        openai_api_key="your-api-key",
        allowed_tables=["users", "orders", "products"]  # Whitelist
    )
    
    # Execute query
    result = agent.query(
        question="Number of orders per day for the past 7 days",
        user_id="user_123"
    )
    
    if result['success']:
        print(f"✓ Query successful ({result['duration_seconds']:.2f}s)")
        print(f"\nSQL:\n{result['sql']}\n")
        print(f"Explanation: {result['explanation']}\n")
        print(f"Results ({result['row_count']} rows):")
        print(result['columns'])
        for row in result['data']:
            print(row)
    else:
        print(f"✗ Query failed: {result['error']}")
    
    # View statistics
    stats = agent.get_query_stats()
    print(f"\nStatistics: {stats}")
```

## Notes and Best Practices

### 1. Cost Control

Every GPT-4 call costs money. Ways to control costs:
- Use GPT-3.5-turbo for simple queries
- Cache SQL for common questions
- Compress schema info, only pass essentials

### 2. Accuracy Optimization

AI-generated SQL isn't 100% accurate. You can:
- Provide few-shot examples (few-shot learning)
- Add detailed comments for fields and tables
- Have AI generate multiple candidate SQLs, use heuristic rules to select best

### 3. User Experience

A good data query bot should:
- Respond quickly (< 5 seconds)
- Support follow-ups ("group by region too")
- Auto-generate visualizations (simple bar/line charts)
- Provide query history for easy reuse

## One-Sentence Summary

**AI-driven data analysis makes "asking data" as simple as chatting—Text-to-SQL technology converts natural language directly into SQL queries. With permission control and safety checks, you can build a production-grade "ask the database" bot in under 200 lines of code, letting anyone on your team self-serve data analysis without waiting in line for data analysts.**

:::tip Next Steps
Now you know how to use AI to query data, but how do queried data become documentation and knowledge? In the next section, we'll discuss **AI-Driven Documentation and Knowledge Management**, looking at how AI can auto-generate API docs, meeting minutes, and even detect stale documentation.
:::
