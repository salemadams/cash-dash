# Cash Dash

A modern personal finance dashboard built with React and TypeScript for tracking transactions, managing budgets, and analyzing spending patterns.

## Features

- **Dashboard** - Financial overview with interactive charts, period comparisons, and recent transactions
- **Transactions** - Searchable, filterable transaction history with sorting and pagination
- **Budget Management** - Create recurring or one-time budgets with category tracking and health indicators
- **Analytics** - Multiple chart types (line, doughnut, bar) with zoom/pan and detailed metrics
- **Dark/Light Theme** - Persistent theme preference

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: TanStack React Query, React Hook Form, Zod
- **UI**: Tailwind CSS, shadcn/ui (Radix UI), Lucide Icons
- **Charts**: Chart.js, react-chartjs-2, chartjs-plugin-zoom
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
# Terminal 1 - Start mock API
npm run json-server

# Terminal 2 - Start frontend
npm run dev
```

### Build for Production

```bash
npm run build
```
