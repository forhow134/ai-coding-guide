---
prev:
  text: '14.5 AI 辅助数据分析'
  link: '/zh/14-practice/data-analysis'
next:
  text: '15.1 AI 编排平台全景'
  link: '/zh/15-ai-workflow/'
---

# 14.6 AI 驱动的文档与知识管理

## 为什么文档总是过时的?

你有没有遇到过这种场景:刚入职新公司,打开团队 Wiki,看到一篇标题是"新人必读"的文档,写着"最后更新于 2019 年"。你按照文档配置开发环境,发现一半的命令都报错,环境变量早就改名了,依赖版本也对不上...

或者这种:产品发布了新的 API,你兴冲冲地打开 API 文档,发现参数说明和实际接口完全不一样。你只好去翻源代码,然后在心里默默骂一句:"又是文档和代码不同步!"

文档过时、文档缺失、文档不准确,这三大问题困扰着每一个技术团队。根本原因是:**写文档是个苦差事,而且很难跟上代码的变化速度。**

但如果 AI 能帮我们自动生成文档、总结会议、检测过时内容呢?今天我们就来看看如何用 AI 让文档管理从"能躲就躲"变成"自动完成"。

## 从代码自动生成 API 文档

最常见也最实用的场景:你写了一堆 API 接口,但懒得手写文档。AI 可以分析代码,自动生成格式规范的 API 文档。

### 工作原理

1. **代码解析**:提取函数签名、参数、返回值、注释
2. **语义理解**:AI 理解函数用途,生成描述性文字
3. **格式化输出**:生成 Markdown、OpenAPI Spec 或 HTML

关键是:AI 不只是提取注释,还能理解代码逻辑,补充缺失的说明。

### 实战:FastAPI 自动文档生成器

假设你有一个 FastAPI 项目,想自动生成漂亮的 API 文档:

```python
import ast
import inspect
from pathlib import Path
from typing import List, Dict, Any
import openai

class APIDocGenerator:
    def __init__(self, openai_api_key: str):
        openai.api_key = openai_api_key
    
    def extract_routes(self, file_path: str) -> List[Dict[str, Any]]:
        """从 Python 文件中提取 FastAPI 路由"""
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        
        tree = ast.parse(source)
        routes = []
        
        for node in ast.walk(tree):
            # 查找装饰器为 @app.get/@app.post 等的函数
            if isinstance(node, ast.FunctionDef):
                for decorator in node.decorator_list:
                    if isinstance(decorator, ast.Call):
                        if hasattr(decorator.func, 'attr') and decorator.func.attr in ['get', 'post', 'put', 'delete']:
                            route_info = {
                                'method': decorator.func.attr.upper(),
                                'path': ast.literal_eval(decorator.args[0]) if decorator.args else '/',
                                'function_name': node.name,
                                'docstring': ast.get_docstring(node),
                                'source': ast.unparse(node)
                            }
                            routes.append(route_info)
        
        return routes
    
    def generate_doc_for_route(self, route: Dict[str, Any]) -> str:
        """使用 AI 为单个路由生成文档"""
        prompt = f"""分析以下 API 路由代码,生成规范的文档。

方法: {route['method']}
路径: {route['path']}
函数名: {route['function_name']}

代码:
```python
{route['source']}
```

原有文档字符串:
{route['docstring'] or '无'}

请生成 Markdown 格式的 API 文档,包含:
1. 简短描述(一句话)
2. 详细说明
3. 请求参数(路径参数、查询参数、请求体)
4. 响应格式(状态码、返回数据结构)
5. 示例请求

要求:
- 如果代码中已有 Pydantic 模型,详细说明字段
- 如果有异常处理,说明可能的错误响应
- 使用表格展示参数
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个 API 文档专家,擅长写清晰的技术文档。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        return response.choices[0].message.content
    
    def generate_full_docs(self, api_files: List[str], output_path: str):
        """为多个 API 文件生成完整文档"""
        all_docs = ["# API 文档\n\n自动生成于代码分析\n\n---\n\n"]
        
        for file_path in api_files:
            routes = self.extract_routes(file_path)
            
            if routes:
                all_docs.append(f"## 文件: {Path(file_path).name}\n\n")
                
                for route in routes:
                    print(f"生成文档: {route['method']} {route['path']}")
                    doc = self.generate_doc_for_route(route)
                    all_docs.append(doc + "\n\n---\n\n")
        
        # 写入文件
        full_doc = "".join(all_docs)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(full_doc)
        
        print(f"✓ 文档已生成: {output_path}")
        return output_path

# 使用示例
generator = APIDocGenerator(openai_api_key="your-api-key")

generator.generate_full_docs(
    api_files=["app/routes/users.py", "app/routes/orders.py"],
    output_path="docs/api-reference.md"
)
```

### 生成的文档示例

假设你有这样的代码:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class CreateUserRequest(BaseModel):
    username: str
    email: str
    age: int

@app.post("/users")
async def create_user(user: CreateUserRequest):
    """创建新用户"""
    if len(user.username) < 3:
        raise HTTPException(status_code=400, detail="用户名太短")
    # ... 创建用户逻辑
    return {"id": 123, "username": user.username}
```

AI 会生成:

````markdown
### POST /users

**快速说明**: 创建一个新用户账户

**详细描述**:
此接口用于注册新用户。接收用户名、邮箱和年龄,验证通过后创建用户并返回用户 ID。

**请求参数**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名,至少 3 个字符 |
| email | string | 是 | 邮箱地址 |
| age | integer | 是 | 用户年龄 |

**请求示例**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "age": 28
}
```

**响应**:

成功 (200):
```json
{
  "id": 123,
  "username": "john_doe"
}
```

错误 (400):
```json
{
  "detail": "用户名太短"
}
```

**注意事项**:
- 用户名必须至少包含 3 个字符
- 邮箱格式会自动验证
````

比你手写的文档还详细!

## 会议记录自动化:Whisper + 总结

开会是必要的,但写会议记录是痛苦的。AI 可以自动转录语音并生成结构化纪要。

### 技术栈

1. **Whisper**:OpenAI 的语音识别模型,支持中文,准确率极高
2. **GPT-4**:理解转录文本,提取关键信息,生成结构化纪要

### 完整流水线

```python
import openai
from pathlib import Path
from datetime import datetime

class MeetingMinutesGenerator:
    def __init__(self, openai_api_key: str):
        openai.api_key = openai_api_key
    
    def transcribe_audio(self, audio_file: str) -> str:
        """使用 Whisper 转录音频"""
        with open(audio_file, 'rb') as f:
            transcript = openai.Audio.transcribe(
                model="whisper-1",
                file=f,
                language="zh"  # 指定中文
            )
        return transcript['text']
    
    def generate_minutes(self, transcript: str, meeting_context: str = "") -> Dict[str, Any]:
        """从转录文本生成会议纪要"""
        prompt = f"""你是一个专业的会议记录助手。根据以下会议转录,生成结构化的会议纪要。

会议背景: {meeting_context or '常规技术会议'}

转录内容:
{transcript}

请生成包含以下部分的会议纪要(Markdown 格式):

1. **会议概要** (3-5 句话总结核心内容)
2. **关键决策** (列表形式,标注决策者)
3. **行动项** (待办事项,包含负责人和截止时间)
4. **讨论要点** (按主题分组)
5. **后续跟进** (需要在下次会议确认的事项)

要求:
- 使用清晰的标题和列表
- 提取具体的人名、时间、数字
- 区分事实陈述和个人观点
- 如果提到代码或技术细节,保留原样
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是专业的会议记录员,擅长提取关键信息。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        
        minutes = response.choices[0].message.content
        
        return {
            "transcript": transcript,
            "minutes": minutes,
            "generated_at": datetime.now().isoformat()
        }
    
    def process_meeting(
        self,
        audio_file: str,
        output_dir: str,
        meeting_title: str = "技术会议",
        context: str = ""
    ) -> str:
        """处理完整流程:转录 -> 生成纪要 -> 保存"""
        print(f"[1/3] 转录音频: {audio_file}")
        transcript = self.transcribe_audio(audio_file)
        
        print(f"[2/3] 生成会议纪要...")
        result = self.generate_minutes(transcript, context)
        
        print(f"[3/3] 保存结果...")
        # 创建输出目录
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # 保存转录
        transcript_path = f"{output_dir}/transcript.txt"
        with open(transcript_path, 'w', encoding='utf-8') as f:
            f.write(result['transcript'])
        
        # 保存纪要
        date_str = datetime.now().strftime("%Y%m%d")
        minutes_path = f"{output_dir}/{date_str}-{meeting_title}.md"
        
        full_minutes = f"""# {meeting_title}

**日期**: {datetime.now().strftime("%Y-%m-%d %H:%M")}
**自动生成**: {result['generated_at']}

---

{result['minutes']}

---

## 完整转录

<details>
<summary>点击查看完整转录文本</summary>

{result['transcript']}

</details>
"""
        
        with open(minutes_path, 'w', encoding='utf-8') as f:
            f.write(full_minutes)
        
        print(f"✓ 会议纪要已保存: {minutes_path}")
        return minutes_path

# 使用示例
generator = MeetingMinutesGenerator(openai_api_key="your-api-key")

generator.process_meeting(
    audio_file="meeting-recording.m4a",
    output_dir="docs/meetings/2026-02",
    meeting_title="API 重构讨论",
    context="讨论用户服务 API 的重构方案,包括数据库迁移和向后兼容性"
)
```

### 生成的纪要示例

```markdown
# API 重构讨论

**日期**: 2026-02-22 14:30
**自动生成**: 2026-02-22T14:45:32

---

## 会议概要

团队讨论了用户服务 API 的重构计划。决定采用渐进式迁移策略,保持 v1 API 6 个月的支持期。数据库迁移将在 3 月第一周完成,由后端组负责。前端团队需要在 4 月前完成新 API 的适配。

## 关键决策

- **[张三]** 批准采用 GraphQL 作为 v2 API 的核心技术
- **[李四]** 确定 v1 API 的废弃时间为 2026 年 8 月 31 日
- **[王五]** 同意增加 2 名后端资源支持迁移工作

## 行动项

- [ ] **张三** - 编写 GraphQL schema 设计文档 (截止: 2026-03-01)
- [ ] **李四** - 完成数据库迁移脚本并测试 (截止: 2026-03-05)
- [ ] **王五** - 发布 v2 API 预览版文档 (截止: 2026-03-10)
- [ ] **赵六** - 评估前端适配工作量 (截止: 2026-02-25)

## 讨论要点

### 技术选型
- GraphQL vs REST:团队更倾向 GraphQL 的灵活性
- 考虑使用 Apollo Server 作为 GraphQL 服务器
- 需要评估现有 ORM 的 GraphQL 集成方案

### 数据库迁移
- 用户表需要拆分为 users 和 user_profiles 两个表
- 历史数据迁移预计需要 2 小时停机窗口
- 计划在周日凌晨执行,准备回滚方案

### 向后兼容
- v1 API 保持 6 个月支持,只修复严重 bug
- 提供自动化迁移工具帮助客户端升级
- 在响应头中添加 `X-API-Version` 标识

## 后续跟进

- 下次会议确认 GraphQL schema 设计
- 复审数据库迁移方案的风险点
- 检查前端团队的适配进度
```

比你在会议室边听边记清楚太多了!

## 智能知识库维护:检测过时文档

文档写好了,但代码一直在变,怎么知道哪些文档已经过时了?

### 基本思路

1. **代码变更检测**:监控 Git commit,识别影响文档的改动
2. **语义对比**:AI 比较代码和文档,发现不一致
3. **自动提醒**:生成"文档更新任务"列表

### 实现:过时文档检测器

```python
import git
from pathlib import Path
from typing import List, Dict, Any
import openai

class StaleDocDetector:
    def __init__(self, repo_path: str, openai_api_key: str):
        self.repo = git.Repo(repo_path)
        openai.api_key = openai_api_key
        self.code_docs_mapping = self._build_mapping()
    
    def _build_mapping(self) -> Dict[str, List[str]]:
        """
        构建代码文件和文档的映射关系
        
        规则示例:
        - src/api/users.py -> docs/api/users.md
        - src/models/order.py -> docs/models.md
        """
        mapping = {}
        
        # 简化版:根据文件名匹配
        # 实际项目中可以解析文档中的代码引用
        docs_path = Path(self.repo.working_dir) / "docs"
        
        for doc_file in docs_path.rglob("*.md"):
            # 从文档内容中提取引用的代码文件
            with open(doc_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 简单的正则匹配代码文件路径
            # 更复杂的可以用 AST 解析文档中的代码块
            import re
            code_refs = re.findall(r'`([^`]+\.(py|js|ts|java))`', content)
            
            if code_refs:
                mapping[str(doc_file)] = [ref[0] for ref in code_refs]
        
        return mapping
    
    def get_recent_changes(self, days: int = 7) -> List[Dict[str, Any]]:
        """获取最近 N 天的代码变更"""
        since = f"{days}.days.ago"
        commits = list(self.repo.iter_commits(since=since))
        
        changes = []
        for commit in commits:
            for file_path in commit.stats.files.keys():
                if file_path.endswith(('.py', '.js', '.ts', '.java')):
                    changes.append({
                        'file': file_path,
                        'commit': commit.hexsha[:8],
                        'message': commit.message.strip(),
                        'date': commit.committed_datetime.isoformat()
                    })
        
        return changes
    
    def check_doc_staleness(
        self,
        doc_path: str,
        code_path: str
    ) -> Dict[str, Any]:
        """检查文档是否与代码一致"""
        # 读取文档
        with open(doc_path, 'r', encoding='utf-8') as f:
            doc_content = f.read()
        
        # 读取代码
        full_code_path = Path(self.repo.working_dir) / code_path
        if not full_code_path.exists():
            return {"stale": True, "reason": "代码文件不存在"}
        
        with open(full_code_path, 'r', encoding='utf-8') as f:
            code_content = f.read()
        
        # AI 分析
        prompt = f"""对比文档和代码,判断文档是否需要更新。

文档内容:
{doc_content[:2000]}  # 限制长度

代码内容:
{code_content[:2000]}

请返回 JSON:
\{\{
    "is_stale": true/false,
    "confidence": 0.0-1.0,
    "reasons": ["原因1", "原因2"],
    "suggested_updates": ["建议更新点1", "建议更新点2"]
\}\}

判断标准:
1. 函数签名是否匹配
2. 参数说明是否准确
3. 返回值描述是否正确
4. 示例代码是否还能运行
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是文档质量检查专家。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        
        import json
        result = json.loads(response.choices[0].message.content)
        result['doc_path'] = doc_path
        result['code_path'] = code_path
        
        return result
    
    def scan_all_docs(self) -> List[Dict[str, Any]]:
        """扫描所有文档,找出过时的"""
        stale_docs = []
        
        for doc_path, code_files in self.code_docs_mapping.items():
            print(f"检查: {doc_path}")
            
            for code_file in code_files:
                result = self.check_doc_staleness(doc_path, code_file)
                
                if result.get('is_stale') and result.get('confidence', 0) > 0.7:
                    stale_docs.append(result)
        
        return stale_docs
    
    def generate_report(self, output_path: str = "docs/stale-docs-report.md"):
        """生成过时文档报告"""
        recent_changes = self.get_recent_changes(days=7)
        stale_docs = self.scan_all_docs()
        
        report = f"""# 过时文档检测报告

**生成时间**: {datetime.now().strftime("%Y-%m-%d %H:%M")}
**检测范围**: 近 7 天的代码变更

---

## 概要

- 代码变更: {len(recent_changes)} 个文件
- 检测文档: {len(self.code_docs_mapping)} 个
- 发现过时: {len(stale_docs)} 个

---

## 需要更新的文档

"""
        
        for i, doc in enumerate(stale_docs, 1):
            report += f"""
### {i}. {Path(doc['doc_path']).name}

**置信度**: {doc['confidence']:.0%}
**相关代码**: `{doc['code_path']}`

**过时原因**:
{chr(10).join(f"- {reason}" for reason in doc['reasons'])}

**建议更新**:
{chr(10).join(f"- {update}" for update in doc['suggested_updates'])}

---
"""
        
        report += f"""
## 近期代码变更

| 文件 | 提交 | 说明 | 日期 |
|------|------|------|------|
"""
        
        for change in recent_changes[:20]:  # 只显示最近 20 条
            report += f"| `{change['file']}` | {change['commit']} | {change['message'][:50]} | {change['date'][:10]} |\n"
        
        # 保存报告
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"✓ 报告已生成: {output_path}")
        return output_path

# 使用示例
detector = StaleDocDetector(
    repo_path="/path/to/your/repo",
    openai_api_key="your-api-key"
)

detector.generate_report()
```

### 生成的报告示例

```markdown
# 过时文档检测报告

**生成时间**: 2026-02-22 15:30
**检测范围**: 近 7 天的代码变更

---

## 概要

- 代码变更: 23 个文件
- 检测文档: 15 个
- 发现过时: 3 个

---

## 需要更新的文档

### 1. users-api.md

**置信度**: 85%
**相关代码**: `src/api/users.py`

**过时原因**:
- 文档中的 `create_user` 函数签名缺少新增的 `phone` 参数
- 返回值中新增了 `created_at` 字段,文档未提及
- 示例代码中的错误处理方式已改为返回 422 而不是 400

**建议更新**:
- 添加 `phone` 参数说明(可选参数,字符串类型)
- 更新响应示例,包含 `created_at` 时间戳字段
- 修改错误响应示例,状态码改为 422

---

### 2. database-schema.md

**置信度**: 92%
**相关代码**: `src/models/order.py`

**过时原因**:
- `orders` 表新增了 `payment_method` 字段
- `status` 字段的枚举值增加了 'refunded' 状态
- 文档中提到的 `discount` 字段已被重命名为 `discount_amount`

**建议更新**:
- 添加 `payment_method` 字段说明(VARCHAR(20), 可选值: credit_card, paypal, alipay)
- 更新 `status` 字段的枚举值列表
- 将所有 `discount` 引用改为 `discount_amount`
```

这样你就能及时知道哪些文档需要更新了!

## 终极示例:从代码结构自动生成 README

最后来个实用的大招:为项目自动生成 README.md。

```python
import os
from pathlib import Path
from typing import List, Dict, Any
import openai

class ReadmeGenerator:
    def __init__(self, repo_path: str, openai_api_key: str):
        self.repo_path = Path(repo_path)
        openai.api_key = openai_api_key
    
    def analyze_structure(self) -> Dict[str, Any]:
        """分析项目结构"""
        structure = {
            "directories": [],
            "main_files": [],
            "languages": set(),
            "has_tests": False,
            "has_docs": False,
            "config_files": []
        }
        
        for root, dirs, files in os.walk(self.repo_path):
            # 跳过常见的忽略目录
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', 'venv']]
            
            rel_root = Path(root).relative_to(self.repo_path)
            
            for file in files:
                file_path = rel_root / file
                ext = file_path.suffix
                
                # 识别语言
                if ext in ['.py', '.js', '.ts', '.java', '.go', '.rs']:
                    structure["languages"].add(ext[1:])
                
                # 识别配置文件
                if file in ['package.json', 'requirements.txt', 'Cargo.toml', 'pom.xml', 'go.mod']:
                    structure["config_files"].append(str(file_path))
                
                # 识别主文件
                if file in ['main.py', 'app.py', 'index.js', 'main.go']:
                    structure["main_files"].append(str(file_path))
            
            # 识别测试和文档目录
            if 'test' in str(rel_root).lower():
                structure["has_tests"] = True
            if 'doc' in str(rel_root).lower():
                structure["has_docs"] = True
        
        return structure
    
    def read_key_files(self) -> Dict[str, str]:
        """读取关键文件内容"""
        key_files = {}
        
        # 尝试读取主入口文件
        for pattern in ['main.py', 'app.py', 'index.js', 'main.go', 'src/main.*']:
            matches = list(self.repo_path.glob(pattern))
            if matches:
                with open(matches[0], 'r', encoding='utf-8', errors='ignore') as f:
                    key_files['main'] = f.read()[:2000]  # 只读前 2000 字符
                break
        
        # 读取配置文件
        for config in ['package.json', 'requirements.txt', 'Cargo.toml']:
            config_path = self.repo_path / config
            if config_path.exists():
                with open(config_path, 'r', encoding='utf-8') as f:
                    key_files[config] = f.read()
        
        return key_files
    
    def generate_readme(self) -> str:
        """生成 README 内容"""
        structure = self.analyze_structure()
        key_files = self.read_key_files()
        
        prompt = f"""为这个项目生成一个专业的 README.md。

项目结构分析:
- 编程语言: {', '.join(structure['languages'])}
- 主文件: {', '.join(structure['main_files'])}
- 配置文件: {', '.join(structure['config_files'])}
- 包含测试: {'是' if structure['has_tests'] else '否'}
- 包含文档: {'是' if structure['has_docs'] else '否'}

关键代码片段:
{chr(10).join(f"=== {name} ===\n{content[:500]}\n" for name, content in key_files.items())}

请生成包含以下部分的 README.md:

1. **项目名称和简短描述** (一句话说明项目做什么)
2. **功能特性** (列表形式,3-5 个核心功能)
3. **技术栈** (基于分析的语言和配置文件)
4. **快速开始**
   - 环境要求
   - 安装步骤
   - 运行命令
5. **项目结构** (简要说明主要目录)
6. **使用示例** (如果能从代码推断出用法)
7. **测试** (如果有测试目录)
8. **贡献指南** (简短说明)
9. **许可证** (如果能识别出)

要求:
- 使用 Markdown 格式
- 代码块要标注语言
- 命令要准确(基于配置文件推断)
- 语气专业但友好
- 包含适当的 badge(如果适用)
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个技术文档专家,擅长写清晰的 README。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6
        )
        
        return response.choices[0].message.content
    
    def save_readme(self, output_path: str = None):
        """生成并保存 README"""
        if output_path is None:
            output_path = self.repo_path / "README-GENERATED.md"
        
        print("分析项目结构...")
        readme_content = self.generate_readme()
        
        print("保存 README...")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        print(f"✓ README 已生成: {output_path}")
        print("\n预览:\n")
        print(readme_content[:500] + "...\n")
        
        return output_path

# 使用示例
generator = ReadmeGenerator(
    repo_path="/path/to/your/project",
    openai_api_key="your-api-key"
)

generator.save_readme()
```

### 生成的 README 示例

````markdown
# FastAPI User Service

一个基于 FastAPI 的高性能用户管理微服务,提供 RESTful API 用于用户注册、认证和资料管理。

![Python Version](https://img.shields.io/badge/python-3.9+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 功能特性

- 用户注册和登录(JWT 认证)
- 邮箱验证和密码重置
- 用户资料 CRUD 操作
- 基于角色的访问控制(RBAC)
- 完整的 API 文档(自动生成)

## 技术栈

- **框架**: FastAPI 0.100+
- **数据库**: PostgreSQL + SQLAlchemy ORM
- **认证**: JWT (python-jose)
- **测试**: pytest + pytest-asyncio
- **文档**: 自动生成的 OpenAPI/Swagger

## 快速开始

### 环境要求

- Python 3.9 或更高
- PostgreSQL 12+
- Redis (用于缓存和会话)

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourname/user-service.git
cd user-service
```

2. 创建虚拟环境
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

4. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件,设置数据库连接等
```

5. 运行数据库迁移
```bash
alembic upgrade head
```

### 运行

开发模式(热重载):
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

生产模式:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

访问 API 文档: http://localhost:8000/docs

## 项目结构

```
user-service/
├── app/
│   ├── main.py          # 应用入口
│   ├── routes/          # API 路由
│   ├── models/          # 数据库模型
│   ├── schemas/         # Pydantic 模型
│   ├── services/        # 业务逻辑
│   └── utils/           # 工具函数
├── tests/               # 测试文件
├── alembic/             # 数据库迁移
└── requirements.txt     # Python 依赖
```

## 使用示例

### 注册新用户

```python
import requests

response = requests.post(
    "http://localhost:8000/users",
    json={
        "username": "john_doe",
        "email": "john@example.com",
        "password": "secure_password"
    }
)

print(response.json())
# {"id": 1, "username": "john_doe", "email": "john@example.com"}
```

### 登录获取 Token

```python
response = requests.post(
    "http://localhost:8000/auth/login",
    json={
        "email": "john@example.com",
        "password": "secure_password"
    }
)

token = response.json()["access_token"]
```

更多示例请查看 [API 文档](http://localhost:8000/docs)。

## 测试

运行所有测试:
```bash
pytest
```

生成覆盖率报告:
```bash
pytest --cov=app tests/
```

## 贡献指南

欢迎贡献!请遵循以下步骤:

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

请确保代码通过所有测试,并遵循项目的代码风格。

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。
````

这样的 README 比你自己写的还详细专业!

## 最佳实践与注意事项

### 1. 文档生成时机

- **CI/CD 集成**:每次 push 到主分支时自动检查文档
- **Pre-commit hook**:提交代码前检查是否需要更新文档
- **定期扫描**:每周运行一次过时文档检测

### 2. 质量控制

- **人工审核**:AI 生成的内容需要人工最终确认
- **版本控制**:自动生成的文档也要提交到 Git
- **A/B 测试**:对比手写和 AI 生成的文档的用户满意度

### 3. 成本优化

- **增量生成**:只为变更的代码重新生成文档
- **本地缓存**:缓存 AI 的输出,相同输入不重复调用
- **混合模式**:简单文档用模板,复杂文档才用 AI

## 工具推荐

如果不想自己实现,这些工具可以直接用:

- **Mintlify Writer**:浏览器插件,自动为代码生成注释和文档
- **Swimm**:AI 驱动的代码文档工具,自动检测过时文档
- **Scribe**:录制操作流程自动生成 how-to 文档
- **Notion AI**:在 Notion 中用 AI 整理会议记录

## 一句话总结

**AI 驱动的文档管理让"文档跟不上代码"成为历史,从自动生成 API 文档、会议纪要,到智能检测过时内容、自动生成 README,AI 可以承担 80% 的文档工作,让团队把精力集中在真正需要人类智慧的地方——你只需提供代码和语音,剩下的交给 AI,文档永远是最新、最准确的状态。**

:::tip 下一步
现在你已经掌握了 AI 在日常开发中的实战技能,从代码生成到数据分析,从工具链搭建到文档管理。下一章我们将升级视角,探讨 **AI 编排平台全景**,看看如何用 LangChain、AutoGPT 等框架构建更复杂的 AI 工作流。
:::
