
## SVC management
### Pre-push
Before pushing changes pull the dev branch, **merge your code locally and resolve any conflicts**
  ```bash

# Switch to your feature branch
git checkout [your-branch]

# Fetch latest remote data
git fetch origin

# Rebase your work on top of latest dev
git rebase origin/dev

# Resolve conflicts if needed
git add .
git rebase --continue
  ```
### Push
After resolving conflicts, you can now push your changes to **your assigned branch**
```bash
# Push changes to your branch
git push origin [your branch]
```

### Post-Push
 
 #### PR
```
Local:
branch (your branch)
  ↓
git push
  ↓
origin/mine 
      ↓
Pull Request [your branch → dev] (not main)

```

- Got to URL and create a Pull Request
  - PR from **[YOUR branch]** to **[dev branch]**
- Make sure the PR contains the following:
    - **Title:** *Self explanatory*
        - Example: "Added new dependecy X and updated X"
    - **TL;DR:** *1 or 2 lines summary*
        - Example: "Added new dependency X to solve X, updated the business logic to fix bug X"
    - **Description:** *More detailed description that the code may not explain*
- Wait for the reviewers approval
  - If applicable:
    - Make any suggested changes
    - **Repeat the push workflow**
- If no changes, reviewers will merge the code to the parent branch [dev]

#### PR description template
you can copy this for quick reference
```
TL;DR: 

Description:
```

### Workflow Summary
```
(dev = developer, Rev = reviewer)

WORKFLOW
[dev] PR (with: Title, TL;DR, Description)
  ↓
[Rev] Code review
  ↓
[dev] Wait for the reviewers approval
  ↓
      [dev] If applicable:    
            Make any suggested changes
            Push changes
  ↓
[Rev] Parent branch code merge

```