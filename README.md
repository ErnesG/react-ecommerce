#   Architecture — Performance-First Patterns: React E-commerce store usecase

> A technical showcase of scalable React design patterns for high-performance frontends, in this tutorial we are building a e-commerce web app.

This repository demonstrates how to architect a React e-commerce application using **performance-first principles** and **modern component design patterns**. It includes real-world applications of `React.memo`, `useCallback`, `useMemo`, and the **Compound Component Pattern** — all structured with **Atomic Design**. Feel free to take any of these principles into your own work — whether you're applying them on the job or just learning. Glad to help!

---

## 📦 Tech Stack

- **React 18 + TypeScript**
- **Vite** for fast development builds
- **TailwindCSS** for utility-first styling
- **Atomic Design** component architecture
- **React performance hooks** (`memo`, `useMemo`, `useCallback`)
- **Component Composition** via Compound Component Pattern
- **Strict Type Safety** via centralized prop interfaces

---

## 🗂️ Project Structure

```plaintext
src/
├── atoms/          # Stateless UI primitives (e.g., Button, Input, Badge)
├── molecules/      # Small composed components (e.g., ProductCard, SearchBar)
├── organisms/      # Higher-level UI sections (e.g., ProductGrid, Header)
├── templates/      # Layout components (e.g., Layout with slot-based regions)
├── model/          # TypeScript interfaces for props and entities
├── utils/          # Utility functions (placeholder for logic extraction)
├── test/           # Setup file for unit testing
├── App.tsx         # Main composition root
├── main.tsx        # App bootstrapper
```

---

## 🧠 Key Architectural Highlights

### 1. `React.memo` for UI Stability
Used in:
- `ProductCard.tsx`
- `Button.tsx`
- `ProductGrid.tsx`

**Why?** Prevents unnecessary re-renders of components with stable props, improving frame rendering consistency.

---

### 2. `useMemo` for Styling & Computation Optimization
Used in:
- Button styling class generation
- Complex layout rendering
- Product price formatting

**Why?** Reduces recomputation of expensive values across re-renders.

---

### 3. `useCallback` for Stable Event Handlers
Used in:
- `ProductCard`'s "Add to Cart" interaction
- `SearchBar` input handlers
- `Cart` quantity management

**Why?** Ensures child components using `memo` don't re-render due to unstable function references.

---

### 4. **Compound Component Pattern**
Used in:
- `Layout.tsx` (templating)
- `Modal` (custom usage possible via pattern)

**Why?** Encourages flexible composition of UI containers with optional slots (`header`, `sidebar`, `footer`, etc).

---

## 📚 Developer Onboarding Guide

| Concept | File/Example | Purpose |
|--------|--------------|---------|
| `React.memo` | `ProductCard.tsx` | Memoizes re-renders based on props |
| `useMemo` | `Button.tsx`, `ProductCard.tsx` | Prevents unnecessary recomputation |
| `useCallback` | `Cart.tsx`, `SearchBar.tsx` | Avoids re-rendering memoized children |
| Compound Layout | `Layout.tsx` | Slot-based flexible layout |
| Type Modeling | `model/*.ts` | Clear and reusable prop interfaces |
| Atomic Design | `atoms/`, `molecules/`, `organisms/` | Maintainable UI hierarchy |

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
