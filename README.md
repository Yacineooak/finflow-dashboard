# FinFlow 💼

A comprehensive personal finance analytics platform built with Next.js 15, featuring real-time data visualization, intelligent insights, and modern financial management tools.

![FinanceFlow Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)

## 🌟 Overview

FinanceFlow transforms complex financial data into actionable insights through beautiful, interactive dashboards. Whether you're tracking daily expenses, planning long-term goals, or analyzing investment performance, FinanceFlow provides the tools you need to make informed financial decisions.

## ✨ Key Features

### 📊 **Advanced Analytics Dashboard**
- **Real-time KPI Monitoring**: Track balance, income, expenses, and savings rate with live updates
- **Interactive Visualizations**: Donut charts, bar graphs, calendar heatmaps, and trend lines
- **AI-Powered Insights**: Smart recommendations based on spending patterns and financial goals
- **Comparative Analysis**: Month-over-month and year-over-year financial comparisons

### 💳 **Transaction Management**
- **Smart Categorization**: Automatic transaction categorization with custom rules
- **Advanced Search & Filtering**: Fuzzy search with date range, amount, and category filters
- **Bulk Operations**: Edit, categorize, or export multiple transactions at once
- **Receipt Management**: Upload and link receipts to transactions

### 🎯 **Goal & Budget Tracking**
- **Visual Progress Tracking**: Animated progress rings and milestone indicators
- **Smart Budget Allocation**: AI-suggested budget categories based on spending history
- **Goal Templates**: Pre-built templates for common financial goals
- **Achievement System**: Gamified experience with badges and rewards

### 📈 **Investment Portfolio**
- **Portfolio Overview**: Real-time portfolio performance and allocation charts
- **Asset Tracking**: Individual stock, bond, and cryptocurrency monitoring
- **Performance Analytics**: ROI calculations, risk assessment, and diversification analysis
- **Market Insights**: Trend analysis and investment recommendations

### 📅 **Bill Management**
- **Payment Scheduling**: Automated reminders for upcoming bills
- **Payment History**: Complete audit trail of all bill payments
- **Budget Integration**: Bills automatically integrated with budget planning
- **Subscription Tracking**: Monitor and manage recurring subscriptions

### ⚙️ **Customization & Settings**
- **Theme System**: Light, Dark, and Fun themes with system preference detection
- **Multi-language Support**: English, French, and Arabic with RTL support
- **Notification Preferences**: Customizable alerts and reminders
- **Data Export**: CSV, PDF, and JSON export options for all financial data

### 📱 **Mobile-First Design**
- **Responsive Layout**: Optimized for all screen sizes and devices
- **Touch-Friendly Interface**: Gestures and interactions designed for mobile
- **Offline Capability**: Core features available without internet connection
- **Progressive Web App**: Install as native app on mobile devices

## 🚀 Technology Stack

### **Core Framework**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development with strict mode
- **[React 18](https://reactjs.org/)** - Latest React features including Suspense and Concurrent Rendering

### **Styling & UI**
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework with custom design system
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible component primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library for React

### **Data Visualization**
- **[Recharts](https://recharts.org/)** - Composable charting library built on React components
- **Custom Chart Components** - Specialized financial data visualizations

### **Developer Experience**
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Code linting and formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for quality assurance
- **[TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html)** - Clean import paths with `@/` alias

## 📦 Quick Start

### Prerequisites
- **Node.js** 18.0 or later
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/financeflow.git
cd financeflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
financeflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── analytics/          # Advanced analytics page
│   │   ├── bills/              # Bill management
│   │   ├── goals/              # Financial goals
│   │   ├── investments/        # Portfolio tracking
│   │   ├── settings/           # User preferences
│   │   ├── support/            # Help & documentation
│   │   ├── transactions/       # Transaction management
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Dashboard homepage
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── AppShell.tsx        # Navigation & layout
│   │   ├── DashboardOverview.tsx
│   │   ├── AnalyticsPanels.tsx
│   │   ├── GoalsAndBudgets.tsx
│   │   └── TransactionsAndReports.tsx
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   └── hooks/              # Custom React hooks
│   └── types/                  # TypeScript definitions
├── public/                     # Static assets
└── package.json
```

## 🎯 Usage Guide

### **Dashboard Navigation**
- **Dashboard** (`/`) - Main financial overview with KPIs and charts
- **Transactions** (`/transactions`) - Detailed transaction management
- **Goals** (`/goals`) - Financial goal setting and tracking
- **Investments** (`/investments`) - Portfolio management
- **Bills** (`/bills`) - Bill tracking and payment scheduling
- **Analytics** (`/analytics`) - Advanced financial analytics
- **Settings** (`/settings`) - Application preferences
- **Support** (`/support`) - Help center and documentation

### **Keyboard Shortcuts**
- `⌘K` or `Ctrl+K` - Open command palette
- `Tab` / `Shift+Tab` - Navigate between elements
- `Enter` / `Space` - Activate buttons and controls
- `Esc` - Close modals and overlays

### **Theme Switching**
Toggle between three professionally designed themes:
- **Light** - Clean, professional appearance for daytime use
- **Dark** - Eye-friendly design for extended sessions
- **Fun** - Vibrant, engaging colors for a playful experience

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### **Environment Setup**

Create a `.env.local` file in the root directory:

```env
# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Optional: Error reporting
SENTRY_DSN=your_sentry_dsn
```

### **Code Quality**

We maintain high code quality standards:
- **TypeScript** strict mode enabled
- **ESLint** with Next.js and accessibility rules
- **Prettier** for consistent code formatting
- **Husky** pre-commit hooks for quality checks
- **Conventional Commits** for clear commit messages

## 🎨 Design System

FinanceFlow uses a custom design system built on Tailwind CSS:

### **Color Palette**
- **Primary**: Teal (`#2ed3b7`) for main actions and highlights
- **Secondary**: Warm orange (`#f0b289`) for accents and secondary actions
- **Success**: Green (`#22c55e`) for positive financial indicators
- **Warning**: Yellow (`#f4c76b`) for alerts and cautionary messages
- **Danger**: Red (`#ef5a7a`) for negative values and critical alerts

### **Typography**
- **Headings**: Plus Jakarta Sans (600, 700 weights)
- **Body**: Inter (400, 500, 600, 700 weights)
- **Optimized** for readability across all screen sizes

### **Accessibility**
- **WCAG 2.1 AA** compliant color contrast ratios
- **Keyboard navigation** for all interactive elements
- **Screen reader** optimized with proper ARIA labels
- **Reduced motion** support for users with motion sensitivity

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our development process and code of conduct.

### **Getting Started**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Commit using conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Submit a pull request

### **Development Guidelines**
- Write tests for new features
- Update documentation for API changes
- Follow the existing code style and patterns
- Ensure accessibility compliance
- Test across different browsers and devices

## 📊 Performance

FinanceFlow is optimized for performance:
- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting and tree shaking
- **First Contentful Paint**: < 1.5s on 3G networks
- **Time to Interactive**: < 3s on average hardware

## 🛡️ Security

- **No sensitive data** stored in localStorage
- **XSS protection** with Content Security Policy
- **Secure headers** configured in Next.js
- **Input validation** on all user inputs
- **HTTPS enforced** in production

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to the open source community and these amazing projects:
- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Framer Motion](https://www.framer.com/motion/) - Motion library for React
- [Recharts](https://recharts.org/) - Charting library for React

## 📞 Support & Community

- **📧 Email**: [stylebenderkh@gmail.com](mailto:stylebenderkh@gmail.com)
- **🌐 Website**: [https://finflow-dashboard.vercel.app/](https://finflow-dashboard.vercel.app/)

---

<div align="center">

**Built with ❤️ by Khaldi Yacine**

*Making personal finance accessible, intelligent, and enjoyable for everyone.*

[⭐ Star this repo](https://github.com/yourusername/financeflow) • [🍴 Fork it](https://github.com/yourusername/financeflow/fork) • [🐛 Report Bug](https://github.com/yourusername/financeflow/issues)

</div>
