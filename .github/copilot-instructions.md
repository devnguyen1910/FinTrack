# FinTrack - AI Coding Guidelines

## Project Overview
FinTrack is a Vietnamese personal finance management app built with React 18 + TypeScript + Vite. It features AI-powered financial advice via Google Gemini and bilingual support (Vietnamese/English).

## Architecture Patterns

### Context-Driven State Management
- **Primary State**: `FinancialContext` manages all financial data (transactions, budgets, goals) with localStorage persistence via `useLocalStorage` hook
- **Theme/Language**: Separate contexts (`ThemeContext`, `LanguageContext`) handle UI preferences
- **Component Communication**: All financial operations flow through context providers, not prop drilling

### Data Flow & Types
- **Core Types**: Defined in `types.ts` - use `TransactionType` enum, `CategoryName` type alias
- **Vietnamese Default**: Categories and UI text default to Vietnamese (`DEFAULT_EXPENSE_CATEGORIES`, `DEFAULT_INCOME_CATEGORIES`)
- **Locale System**: Translation keys in `locales/en.json` and `locales/vi.json`, accessed via `useTranslation` hook

### Component Structure
```
components/
├── layout/     # Sidebar, Header - navigation components  
├── pages/      # Full page components (Dashboard, Transactions, etc.)
├── ui/         # Reusable components (Modal, Card, Icons)
└── widgets/    # Specialized components (MarketWidget)
```

## Key Development Patterns

### Modal Pattern
- Base `Modal` component with consistent styling and animations
- Specialized modals extend with specific form logic (e.g., `AddTransactionModal`)
- Use `isOpen`/`onClose` props, not direct DOM manipulation

### AI Integration
- **Gemini Service**: `services/geminiService.ts` handles all AI interactions
- **Environment**: API key via `GEMINI_API_KEY` in `.env.local`, exposed as `process.env.API_KEY`
- **Financial Advice**: Pass structured financial data JSON to AI prompts for context-aware responses
- **Bill Analysis**: Image analysis for automatic transaction categorization

### Styling & Animation
- **Framer Motion**: Used throughout for page transitions and component animations
- **CSS Classes**: Tailwind-style utility classes with dark mode support
- **Responsive**: Components use responsive containers and charts (Recharts library)

## Development Workflow

### Environment Setup
1. `npm install` - Dependencies include React 19, Framer Motion, Recharts, Google GenAI
2. Set `GEMINI_API_KEY` in `.env.local`
3. `npm run dev` - Vite dev server with HMR

### Local Storage Schema
- **Key Pattern**: Simple strings like `'transactions'`, `'budgets'`, `'language'`, `'theme'`
- **Data Format**: JSON-serialized objects, handled automatically by `useLocalStorage` hook
- **Default Values**: Contexts provide sensible defaults for first-time users

### Page Navigation
- **State-Based**: `currentPage` state in main `App.tsx` drives page rendering
- **Type Safety**: `Page` type union ensures valid page names
- **No Router**: Simple state-based navigation, not React Router

## Code Conventions

### TypeScript Patterns
- **Strict Types**: Use defined interfaces/enums, avoid `any`
- **Context Hooks**: Custom hooks like `useFinancials()`, `useTranslation()` provide typed context access  
- **Optional Props**: Extensive use of optional properties with sensible defaults

### Vietnamese-First Approach
- **UI Text**: Vietnamese is primary language, English is secondary
- **Categories**: Default financial categories use Vietnamese names
- **Currency**: Amounts displayed in VND format with comma separators

### Component Props
- **Consistent Naming**: `isOpen/onClose` for modals, `data` for data props
- **Event Handlers**: Use `on*` prefix (onSave, onDelete, onEdit)
- **Optional Editing**: Many components accept optional edit mode data

## External Dependencies
- **Google GenAI**: Financial advice and bill image analysis
- **Recharts**: All chart components (Bar, Pie, Radial charts)
- **Framer Motion**: Page transitions and micro-animations
- **Local Storage**: Primary persistence mechanism (no backend database)

## Critical Files for Changes
- `context/FinancialContext.tsx` - All financial data operations
- `types.ts` - Core type definitions
- `services/geminiService.ts` - AI integration logic
- `locales/*.json` - UI text translations
- `components/ui/` - Reusable component library