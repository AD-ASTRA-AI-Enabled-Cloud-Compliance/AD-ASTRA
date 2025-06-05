### Development lifecycle
---
#### Contents
1. [Development lifecycle](/docs/development/README.md)
1. [Python recommendations summary](/docs/documentation/recommendatios.md)
1. [Code comments](/docs/development/documentation/comments.md)
1. [PR instructions](/docs/development/svc/pr_instructions.md)
---

##### General Workflow

```
main  (production)
  ↑
deployment  (pre-prod/testing)
  ↑
test  (pre-prod/testing)
  ↑
dev   (integration branch)  
    ↑
  REVIEW & MERGE
    ↑
    Pull request
        ↑
        └──  
            ├── branch developer-1
            ├── branch developer-2
            └── branch developer-(n)
```
##### Developer Instructions
- Make sure to locally commit each relevant code update and avoid an "unique big commit" with all changes.
- Make sure to update the README file with critical variables
- When developing and creating a PR, make sure you only focus on one scope, i.e.: "only bug fix"

- If you are a developer, to create a systematic approach follow these steps [Dev Cheatsheet](dev_lifecycle.md).
