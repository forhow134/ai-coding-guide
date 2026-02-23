---
prev:
  text: '14.5 AI-Assisted Data Analysis'
  link: '/14-practice/data-analysis'
next:
  text: '15.1 AI Orchestration Platform Overview'
  link: '/15-ai-workflow/'
---

# 14.6 AI-Driven Documentation and Knowledge Management

## Why Is Documentation Always Outdated?

Have you ever encountered this scenario: You just joined a new company, opened the team Wiki, and saw a document titled "New Hire Must-Read" with "Last updated in 2019" written on it. You followed the document to set up your development environment, only to find that half the commands threw errors, environment variables had been renamed long ago, and dependency versions didn't match...

Or this one: The product team released a new API, and you excitedly opened the API documentation, only to discover that the parameter descriptions were completely different from the actual interface. You had no choice but to dig through the source code, silently cursing in your mind: "Documentation and code out of sync again!"

Outdated documentation, missing documentation, inaccurate documentation—these three problems plague every technical team. The root cause is: **writing documentation is a thankless task, and it's hard to keep up with code changes.**

But what if AI could help us automatically generate documentation, summarize meetings, and detect outdated content? Today we'll look at how AI can transform documentation management from "avoid it if you can" to "automatically done."

## Auto-Generate API Documentation from Code

The most common and practical scenario: You've written a bunch of API endpoints but are too lazy to write documentation manually. AI can analyze your code and automatically generate properly formatted API documentation.

### How It Works

1. **Code Parsing**: Extract function signatures, parameters, return values, comments
2. **Semantic Understanding**: AI understands function purpose, generates descriptive text
3. **Formatted Output**: Generate Markdown, OpenAPI Spec, or HTML

The key: AI doesn't just extract comments—it understands code logic and fills in missing descriptions.

### Hands-On: FastAPI Auto-Documentation Generator

Suppose you have a FastAPI project and want to automatically generate beautiful API documentation:

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
        """Extract FastAPI routes from Python file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        
        tree = ast.parse(source)
        routes = []
        
        for node in ast.walk(tree):
            # Find functions decorated with @app.get/@app.post etc.
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
        """Use AI to generate documentation for a single route"""
        prompt = f"""Analyze the following API route code and generate standard documentation.

Method: {route['method']}
Path: {route['path']}
Function name: {route['function_name']}

Code:
```python
{route['source']}
```

Existing docstring:
{route['docstring'] or 'None'}

Please generate API documentation in Markdown format, including:
1. Brief description (one sentence)
2. Detailed explanation
3. Request parameters (path parameters, query parameters, request body)
4. Response format (status codes, returned data structure)
5. Example request

Requirements:
- If there are Pydantic models in the code, explain fields in detail
- If there's exception handling, describe possible error responses
- Use tables to display parameters
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an API documentation expert skilled at writing clear technical documentation."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        return response.choices[0].message.content
    
    def generate_full_docs(self, api_files: List[str], output_path: str):
        """Generate complete documentation for multiple API files"""
        all_docs = ["# API Documentation\n\nAuto-generated from code analysis\n\n---\n\n"]
        
        for file_path in api_files:
            routes = self.extract_routes(file_path)
            
            if routes:
                all_docs.append(f"## File: {Path(file_path).name}\n\n")
                
                for route in routes:
                    print(f"Generating docs: {route['method']} {route['path']}")
                    doc = self.generate_doc_for_route(route)
                    all_docs.append(doc + "\n\n---\n\n")
        
        # Write to file
        full_doc = "".join(all_docs)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(full_doc)
        
        print(f"✓ Documentation generated: {output_path}")
        return output_path

# Usage example
generator = APIDocGenerator(openai_api_key="your-api-key")

generator.generate_full_docs(
    api_files=["app/routes/users.py", "app/routes/orders.py"],
    output_path="docs/api-reference.md"
)
```

### Generated Documentation Example

Suppose you have this code:

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
    """Create new user"""
    if len(user.username) < 3:
        raise HTTPException(status_code=400, detail="Username too short")
    # ... user creation logic
    return {"id": 123, "username": user.username}
```

AI will generate:

````markdown
### POST /users

**Quick Summary**: Create a new user account

**Detailed Description**:
This endpoint is used to register new users. It accepts username, email, and age, validates them, creates the user, and returns the user ID.

**Request Parameters**:

| Field | Type | Required | Description |
|------|------|----------|-------------|
| username | string | Yes | Username, at least 3 characters |
| email | string | Yes | Email address |
| age | integer | Yes | User age |

**Request Example**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "age": 28
}
```

**Response**:

Success (200):
```json
{
  "id": 123,
  "username": "john_doe"
}
```

Error (400):
```json
{
  "detail": "Username too short"
}
```

**Notes**:
- Username must contain at least 3 characters
- Email format is automatically validated
````

Even more detailed than what you'd write manually!

## Automated Meeting Minutes: Whisper + Summarization

Meetings are necessary, but writing meeting minutes is painful. AI can automatically transcribe audio and generate structured minutes.

### Tech Stack

1. **Whisper**: OpenAI's speech recognition model, supports Chinese, extremely high accuracy
2. **GPT-4**: Understand transcribed text, extract key information, generate structured minutes

### Complete Pipeline

```python
import openai
from pathlib import Path
from datetime import datetime

class MeetingMinutesGenerator:
    def __init__(self, openai_api_key: str):
        openai.api_key = openai_api_key
    
    def transcribe_audio(self, audio_file: str) -> str:
        """Transcribe audio using Whisper"""
        with open(audio_file, 'rb') as f:
            transcript = openai.Audio.transcribe(
                model="whisper-1",
                file=f,
                language="zh"  # Specify Chinese
            )
        return transcript['text']
    
    def generate_minutes(self, transcript: str, meeting_context: str = "") -> Dict[str, Any]:
        """Generate meeting minutes from transcript"""
        prompt = f"""You are a professional meeting minutes assistant. Based on the following meeting transcript, generate structured meeting minutes.

Meeting context: {meeting_context or 'Regular technical meeting'}

Transcript:
{transcript}

Please generate meeting minutes in Markdown format with the following sections:

1. **Meeting Summary** (3-5 sentences summarizing core content)
2. **Key Decisions** (list format, note decision makers)
3. **Action Items** (to-do items, including responsible person and deadline)
4. **Discussion Points** (grouped by topic)
5. **Follow-up** (items to confirm in next meeting)

Requirements:
- Use clear headings and lists
- Extract specific names, times, numbers
- Distinguish factual statements from personal opinions
- If code or technical details are mentioned, preserve them as-is
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional meeting recorder skilled at extracting key information."},
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
        meeting_title: str = "Technical Meeting",
        context: str = ""
    ) -> str:
        """Process complete workflow: transcribe -> generate minutes -> save"""
        print(f"[1/3] Transcribing audio: {audio_file}")
        transcript = self.transcribe_audio(audio_file)
        
        print(f"[2/3] Generating meeting minutes...")
        result = self.generate_minutes(transcript, context)
        
        print(f"[3/3] Saving results...")
        # Create output directory
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Save transcript
        transcript_path = f"{output_dir}/transcript.txt"
        with open(transcript_path, 'w', encoding='utf-8') as f:
            f.write(result['transcript'])
        
        # Save minutes
        date_str = datetime.now().strftime("%Y%m%d")
        minutes_path = f"{output_dir}/{date_str}-{meeting_title}.md"
        
        full_minutes = f"""# {meeting_title}

**Date**: {datetime.now().strftime("%Y-%m-%d %H:%M")}
**Auto-generated**: {result['generated_at']}

---

{result['minutes']}

---

## Full Transcript

<details>
<summary>Click to view full transcript</summary>

{result['transcript']}

</details>
"""
        
        with open(minutes_path, 'w', encoding='utf-8') as f:
            f.write(full_minutes)
        
        print(f"✓ Meeting minutes saved: {minutes_path}")
        return minutes_path

# Usage example
generator = MeetingMinutesGenerator(openai_api_key="your-api-key")

generator.process_meeting(
    audio_file="meeting-recording.m4a",
    output_dir="docs/meetings/2026-02",
    meeting_title="API Refactoring Discussion",
    context="Discuss user service API refactoring plan, including database migration and backward compatibility"
)
```

### Generated Minutes Example

```markdown
# API Refactoring Discussion

**Date**: 2026-02-22 14:30
**Auto-generated**: 2026-02-22T14:45:32

---

## Meeting Summary

The team discussed the user service API refactoring plan. Decided to adopt a progressive migration strategy, maintaining v1 API support for 6 months. Database migration will be completed in the first week of March, led by the backend team. Frontend team needs to adapt to the new API by April.

## Key Decisions

- **[Zhang San]** Approved adoption of GraphQL as core technology for v2 API
- **[Li Si]** Confirmed v1 API deprecation date as August 31, 2026
- **[Wang Wu]** Agreed to add 2 backend resources to support migration work

## Action Items

- [ ] **Zhang San** - Write GraphQL schema design document (Due: 2026-03-01)
- [ ] **Li Si** - Complete database migration scripts and testing (Due: 2026-03-05)
- [ ] **Wang Wu** - Release v2 API preview documentation (Due: 2026-03-10)
- [ ] **Zhao Liu** - Assess frontend adaptation workload (Due: 2026-02-25)

## Discussion Points

### Technology Selection
- GraphQL vs REST: Team prefers GraphQL's flexibility
- Consider using Apollo Server as GraphQL server
- Need to evaluate existing ORM's GraphQL integration

### Database Migration
- Users table needs to be split into users and user_profiles tables
- Historical data migration expected to require 2-hour maintenance window
- Plan to execute Sunday morning, prepare rollback plan

### Backward Compatibility
- v1 API maintained for 6 months, only critical bugs fixed
- Provide automated migration tool to help clients upgrade
- Add `X-API-Version` header to responses

## Follow-up

- Confirm GraphQL schema design in next meeting
- Review risk points in database migration plan
- Check frontend team's adaptation progress
```

Much clearer than taking notes during the meeting!

## Smart Knowledge Base Maintenance: Detecting Outdated Documentation

Documentation is written, but code keeps changing—how do you know which docs are outdated?

### Basic Approach

1. **Code Change Detection**: Monitor Git commits, identify changes affecting documentation
2. **Semantic Comparison**: AI compares code and documentation, finds inconsistencies
3. **Automatic Reminders**: Generate "documentation update task" list

### Implementation: Stale Documentation Detector

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
        Build mapping between code files and documentation
        
        Example rules:
        - src/api/users.py -> docs/api/users.md
        - src/models/order.py -> docs/models.md
        """
        mapping = {}
        
        # Simplified version: match by filename
        # In real projects, parse code references in documentation
        docs_path = Path(self.repo.working_dir) / "docs"
        
        for doc_file in docs_path.rglob("*.md"):
            # Extract referenced code files from documentation
            with open(doc_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Simple regex matching for code file paths
            # More complex approach: parse code blocks in documentation with AST
            import re
            code_refs = re.findall(r'`([^`]+\.(py|js|ts|java))`', content)
            
            if code_refs:
                mapping[str(doc_file)] = [ref[0] for ref in code_refs]
        
        return mapping
    
    def get_recent_changes(self, days: int = 7) -> List[Dict[str, Any]]:
        """Get code changes from the last N days"""
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
        """Check if documentation is consistent with code"""
        # Read documentation
        with open(doc_path, 'r', encoding='utf-8') as f:
            doc_content = f.read()
        
        # Read code
        full_code_path = Path(self.repo.working_dir) / code_path
        if not full_code_path.exists():
            return {"stale": True, "reason": "Code file does not exist"}
        
        with open(full_code_path, 'r', encoding='utf-8') as f:
            code_content = f.read()
        
        # AI analysis
        prompt = f"""Compare documentation and code, determine if documentation needs updating.

Documentation content:
{doc_content[:2000]}  # Limit length

Code content:
{code_content[:2000]}

Please return JSON:
\{\{
    "is_stale": true/false,
    "confidence": 0.0-1.0,
    "reasons": ["reason1", "reason2"],
    "suggested_updates": ["suggested update1", "suggested update2"]
\}\}

Criteria:
1. Do function signatures match
2. Are parameter descriptions accurate
3. Are return value descriptions correct
4. Can example code still run
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a documentation quality checker."},
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
        """Scan all documentation, find stale ones"""
        stale_docs = []
        
        for doc_path, code_files in self.code_docs_mapping.items():
            print(f"Checking: {doc_path}")
            
            for code_file in code_files:
                result = self.check_doc_staleness(doc_path, code_file)
                
                if result.get('is_stale') and result.get('confidence', 0) > 0.7:
                    stale_docs.append(result)
        
        return stale_docs
    
    def generate_report(self, output_path: str = "docs/stale-docs-report.md"):
        """Generate stale documentation report"""
        recent_changes = self.get_recent_changes(days=7)
        stale_docs = self.scan_all_docs()
        
        report = f"""# Stale Documentation Detection Report

**Generated**: {datetime.now().strftime("%Y-%m-%d %H:%M")}
**Detection Range**: Code changes in last 7 days

---

## Summary

- Code changes: {len(recent_changes)} files
- Documentation checked: {len(self.code_docs_mapping)}
- Stale found: {len(stale_docs)}

---

## Documentation Needing Updates

"""
        
        for i, doc in enumerate(stale_docs, 1):
            report += f"""
### {i}. {Path(doc['doc_path']).name}

**Confidence**: {doc['confidence']:.0%}
**Related code**: `{doc['code_path']}`

**Stale reasons**:
{chr(10).join(f"- {reason}" for reason in doc['reasons'])}

**Suggested updates**:
{chr(10).join(f"- {update}" for update in doc['suggested_updates'])}

---
"""
        
        report += f"""
## Recent Code Changes

| File | Commit | Description | Date |
|------|--------|-------------|------|
"""
        
        for change in recent_changes[:20]:  # Only show latest 20
            report += f"| `{change['file']}` | {change['commit']} | {change['message'][:50]} | {change['date'][:10]} |\n"
        
        # Save report
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"✓ Report generated: {output_path}")
        return output_path

# Usage example
detector = StaleDocDetector(
    repo_path="/path/to/your/repo",
    openai_api_key="your-api-key"
)

detector.generate_report()
```

### Generated Report Example

```markdown
# Stale Documentation Detection Report

**Generated**: 2026-02-22 15:30
**Detection Range**: Code changes in last 7 days

---

## Summary

- Code changes: 23 files
- Documentation checked: 15
- Stale found: 3

---

## Documentation Needing Updates

### 1. users-api.md

**Confidence**: 85%
**Related code**: `src/api/users.py`

**Stale reasons**:
- Documentation's `create_user` function signature missing newly added `phone` parameter
- Return value includes new `created_at` field, not mentioned in documentation
- Example code's error handling method changed to return 422 instead of 400

**Suggested updates**:
- Add `phone` parameter description (optional parameter, string type)
- Update response example to include `created_at` timestamp field
- Modify error response example, change status code to 422

---

### 2. database-schema.md

**Confidence**: 92%
**Related code**: `src/models/order.py`

**Stale reasons**:
- `orders` table added new `payment_method` field
- `status` field enum values added 'refunded' status
- Documentation's `discount` field has been renamed to `discount_amount`

**Suggested updates**:
- Add `payment_method` field description (VARCHAR(20), values: credit_card, paypal, alipay)
- Update `status` field enum value list
- Change all `discount` references to `discount_amount`
```

Now you can promptly know which documentation needs updating!

## Ultimate Example: Auto-Generate README from Code Structure

Finally, let's tackle a practical power move: automatically generate README.md for a project.

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
        """Analyze project structure"""
        structure = {
            "directories": [],
            "main_files": [],
            "languages": set(),
            "has_tests": False,
            "has_docs": False,
            "config_files": []
        }
        
        for root, dirs, files in os.walk(self.repo_path):
            # Skip common ignored directories
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', 'venv']]
            
            rel_root = Path(root).relative_to(self.repo_path)
            
            for file in files:
                file_path = rel_root / file
                ext = file_path.suffix
                
                # Identify languages
                if ext in ['.py', '.js', '.ts', '.java', '.go', '.rs']:
                    structure["languages"].add(ext[1:])
                
                # Identify config files
                if file in ['package.json', 'requirements.txt', 'Cargo.toml', 'pom.xml', 'go.mod']:
                    structure["config_files"].append(str(file_path))
                
                # Identify main files
                if file in ['main.py', 'app.py', 'index.js', 'main.go']:
                    structure["main_files"].append(str(file_path))
            
            # Identify test and doc directories
            if 'test' in str(rel_root).lower():
                structure["has_tests"] = True
            if 'doc' in str(rel_root).lower():
                structure["has_docs"] = True
        
        return structure
    
    def read_key_files(self) -> Dict[str, str]:
        """Read key file contents"""
        key_files = {}
        
        # Try to read main entry file
        for pattern in ['main.py', 'app.py', 'index.js', 'main.go', 'src/main.*']:
            matches = list(self.repo_path.glob(pattern))
            if matches:
                with open(matches[0], 'r', encoding='utf-8', errors='ignore') as f:
                    key_files['main'] = f.read()[:2000]  # Only read first 2000 chars
                break
        
        # Read config files
        for config in ['package.json', 'requirements.txt', 'Cargo.toml']:
            config_path = self.repo_path / config
            if config_path.exists():
                with open(config_path, 'r', encoding='utf-8') as f:
                    key_files[config] = f.read()
        
        return key_files
    
    def generate_readme(self) -> str:
        """Generate README content"""
        structure = self.analyze_structure()
        key_files = self.read_key_files()
        
        prompt = f"""Generate a professional README.md for this project.

Project structure analysis:
- Programming languages: {', '.join(structure['languages'])}
- Main files: {', '.join(structure['main_files'])}
- Config files: {', '.join(structure['config_files'])}
- Includes tests: {'Yes' if structure['has_tests'] else 'No'}
- Includes docs: {'Yes' if structure['has_docs'] else 'No'}

Key code snippets:
{chr(10).join(f"=== {name} ===\n{content[:500]}\n" for name, content in key_files.items())}

Please generate a README.md with the following sections:

1. **Project Name and Brief Description** (one sentence explaining what the project does)
2. **Features** (list format, 3-5 core features)
3. **Tech Stack** (based on analyzed languages and config files)
4. **Quick Start**
   - Environment requirements
   - Installation steps
   - Run commands
5. **Project Structure** (brief explanation of main directories)
6. **Usage Examples** (if usage can be inferred from code)
7. **Testing** (if there's a test directory)
8. **Contributing Guidelines** (brief explanation)
9. **License** (if identifiable)

Requirements:
- Use Markdown format
- Code blocks should be language-tagged
- Commands should be accurate (inferred from config files)
- Professional but friendly tone
- Include appropriate badges (if applicable)
"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a technical documentation expert skilled at writing clear READMEs."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6
        )
        
        return response.choices[0].message.content
    
    def save_readme(self, output_path: str = None):
        """Generate and save README"""
        if output_path is None:
            output_path = self.repo_path / "README-GENERATED.md"
        
        print("Analyzing project structure...")
        readme_content = self.generate_readme()
        
        print("Saving README...")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        print(f"✓ README generated: {output_path}")
        print("\nPreview:\n")
        print(readme_content[:500] + "...\n")
        
        return output_path

# Usage example
generator = ReadmeGenerator(
    repo_path="/path/to/your/project",
    openai_api_key="your-api-key"
)

generator.save_readme()
```

### Generated README Example

````markdown
# FastAPI User Service

A high-performance user management microservice based on FastAPI, providing RESTful API for user registration, authentication, and profile management.

![Python Version](https://img.shields.io/badge/python-3.9+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- User registration and login (JWT authentication)
- Email verification and password reset
- User profile CRUD operations
- Role-based access control (RBAC)
- Complete API documentation (auto-generated)

## Tech Stack

- **Framework**: FastAPI 0.100+
- **Database**: PostgreSQL + SQLAlchemy ORM
- **Authentication**: JWT (python-jose)
- **Testing**: pytest + pytest-asyncio
- **Documentation**: Auto-generated OpenAPI/Swagger

## Quick Start

### Environment Requirements

- Python 3.9 or higher
- PostgreSQL 12+
- Redis (for caching and sessions)

### Installation Steps

1. Clone repository
```bash
git clone https://github.com/yourname/user-service.git
cd user-service
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or venv\Scripts\activate  # Windows
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env file, set database connection etc.
```

5. Run database migrations
```bash
alembic upgrade head
```

### Running

Development mode (hot reload):
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Production mode:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

Access API docs: http://localhost:8000/docs

## Project Structure

```
user-service/
├── app/
│   ├── main.py          # Application entry point
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic models
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── tests/               # Test files
├── alembic/             # Database migrations
└── requirements.txt     # Python dependencies
```

## Usage Examples

### Register New User

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

### Login and Get Token

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

For more examples, see [API Documentation](http://localhost:8000/docs).

## Testing

Run all tests:
```bash
pytest
```

Generate coverage report:
```bash
pytest --cov=app tests/
```

## Contributing Guidelines

Contributions welcome! Please follow these steps:

1. Fork this repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure code passes all tests and follows the project's code style.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.
````

This README is more detailed and professional than what you'd write yourself!

## Best Practices and Considerations

### 1. Documentation Generation Timing

- **CI/CD Integration**: Automatically check documentation on every push to main branch
- **Pre-commit hook**: Check if documentation needs updating before committing code
- **Periodic scanning**: Run stale documentation detection weekly

### 2. Quality Control

- **Human review**: AI-generated content needs final human confirmation
- **Version control**: Commit auto-generated documentation to Git too
- **A/B testing**: Compare user satisfaction between manual and AI-generated documentation

### 3. Cost Optimization

- **Incremental generation**: Only regenerate documentation for changed code
- **Local caching**: Cache AI outputs, don't call for same input repeatedly
- **Hybrid mode**: Use templates for simple documentation, AI only for complex ones

## Tool Recommendations

If you don't want to build your own Text-to-SQL system, there are many ready-made AI-powered BI tools:

- **Mintlify Writer**: Browser plugin, automatically generates code comments and documentation
- **Swimm**: AI-driven code documentation tool, automatically detects stale documentation
- **Scribe**: Record operation flows to automatically generate how-to documentation
- **Notion AI**: Use AI in Notion to organize meeting minutes

## One-Sentence Summary

**AI-driven documentation management makes "documentation lagging behind code" history—from auto-generating API docs and meeting minutes to intelligently detecting stale content and auto-generating READMEs, AI can handle 80% of documentation work, letting teams focus on areas truly requiring human intelligence—you just provide code and audio, leave the rest to AI, documentation stays current and accurate forever.**

:::tip Next Steps
Now you've mastered practical AI skills for daily development, from code generation to data analysis, from toolchain setup to documentation management. In the next chapter, we'll level up our perspective to explore the **AI Orchestration Platform Overview**, looking at how to build more complex AI workflows with frameworks like LangChain and AutoGPT.
:::
