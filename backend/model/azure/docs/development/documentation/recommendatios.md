### **PEP 8 - Python's Style Guide: Documentation Summary**

PEP 8 is the official style guide for Python code. When it comes to **documentation**, it emphasizes:

#### Docstrings:

* Use **triple double quotes** (`"""`) for docstrings.
* Always document **modules, functions, classes**, and **methods**.
* The first line should be a **short summary**, followed by a more detailed explanation if necessary.
* Use **imperative mood** for function/method docstrings (e.g., *"Return the sum of..."*).

#### Comments:

* Should be **complete sentences**, capitalized and punctuated.
* Use comments **sparingly**, only to explain *why* something is done (not *what*—that's what clean code should show).
* Two main types:

  * **Inline comments**: Use `#` with a space after it.
  * **Block comments**: Explain complex logic in full sentences, often above the code.

#### Example:

```python
def calculate_area(radius):
    """Return the area of a circle given its radius."""
    return 3.14 * radius ** 2
```

---

### **Clean Code: Robert C. Martin’s guidelines**

Uncle Bob advocates for **self-explanatory code**, keeping documentation **minimal but meaningful**.

#### Key Principles:

1. **Code should be self-documenting**:

   * Use **descriptive names** for variables, functions, and classes.
   * Avoid misleading or outdated comments.

2. **Comments are a last resort**:

   * Only use comments to **explain intent**, not mechanics.
   * **Avoid noise comments** (e.g., `# increment i`).

3. **Good documentation lives close to code**:

   * Use **docstrings** to document purpose, not implementation.
   * Keep external documentation **synchronized** with code updates.

4. **Don’t repeat yourself**:

   * Avoid documenting what the code already says.

5. **Test code is also documentation**:

   * Unit tests describe usage and behavior clearly.

#### Example:

```python
class Order:
    def total_price(self):
        """Calculate total price including tax."""
        return self.subtotal * 1.2  # includes 20% VAT
```

---

### Development Flow Including Documentation

```text
dev (integration branch)
 ├── feature/1 (with docstrings + clean code)
 ├── feature/2 (includes unit tests as doc)
 └── bugfix/3 (includes explanatory comments if logic is tricky)
     ↓
     [Pull Request → dev]
     ↓
dev (after peer review: style, docs, tests checked)
     ↓
     [Pull Request → main]
main (production-ready, docstrings + tests reviewed)
```

---

### Summary Table

| Aspect        | PEP 8                          | Uncle Bob (Clean Code)              |
| ------------- | ------------------------------ | ----------------------------------- |
| Focus         | Style consistency              | Code readability & maintainability  |
| Docstrings    | Required for public APIs       | Short & meaningful only             |
| Comments      | Explain *why*, not *what*      | Use only when truly needed          |
| Naming        | Lower\_case\_with\_underscores | Descriptive and intention-revealing |
| External Docs | Rarely mentioned               | Keep in sync or don’t have them     |
| Tests as Docs | Optional                       | Highly encouraged                   |