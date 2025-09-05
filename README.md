# FinanceFlow

A modern, interactive personal finance analytics dashboard built with Next.js that helps users take control of their financial data through beautiful visualizations and intelligent insights.

## ✨ Features

### 📊 **Comprehensive Analytics**
- **Interactive Charts**: Donut charts for expense categorization, bar charts for monthly trends, calendar heatmaps for daily spending patterns, and line charts for cash flow analysis
- **Real-time KPI Tracking**: Monitor current balance, monthly income, expenses, and savings rate with animated progress indicators
- **AI-Powered Insights**: Smart financial recommendations and spending pattern analysis

### 🎯 **Goal Management**
- **Visual Goal Tracking**: Set and monitor financial goals with animated progress rings
- **Milestone System**: Break down large goals into manageable milestones
- **Achievement Gamification**: Unlock badges and achievements for reaching financial targets

### 💳 **Transaction Management**
- **Smart Categorization**: Automatically categorize transactions with visual icons
- **Advanced Filtering**: Search and filter transactions with fuzzy search capabilities
- **Detailed Analytics**: Compare spending patterns across different time periods

### 🎨 **User Experience**
- **Multiple Themes**: Light, Dark, and Fun theme options with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Onboarding**: Guided tutorial system for new users
- **Accessibility First**: Full keyboard navigation and screen reader support

### 🌐 **Multi-language Support**
- English, French, and Arabic language options
- RTL support for Arabic interface

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom design system
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives with custom theming
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth interactions
- **Charts**: [Recharts](https://recharts.org/) for data visualization
- **State Management**: React hooks with custom state management patterns
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for toast notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/financeflow.git
   cd financeflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Usage

### Getting Started
1. **Dashboard Overview**: View your financial summary, KPIs, and AI-generated insights
2. **Set Goals**: Create financial goals and track your progress
3. **Analyze Spending**: Use the interactive charts to understand your spending patterns
4. **Review Transactions**: Filter and search through your transaction history

### Keyboard Shortcuts
- `Cmd/Ctrl + K` or `F`: Open command search
- `Tab`: Navigate through interactive elements
- `Escape`: Close modals and overlays
- `Enter/Space`: Activate buttons and interactive elements

### Themes
Switch between three carefully crafted themes:
- **Light**: Clean and professional for daytime use
- **Dark**: Easy on the eyes for extended sessions
- **Fun**: Vibrant gradients for a more engaging experience

## 🛠️ Development

### Project Structure
```
src/
├── app/                 # Next.js App router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix)
│   ├── AppShell.tsx    # Main layout and navigation
│   ├── DashboardOverview.tsx
│   ├── AnalyticsPanels.tsx
│   ├── GoalsAndBudgets.tsx
│   └── TransactionsAndReports.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
└── types/              # TypeScript type definitions
```

### Key Design Principles
- **Mobile-First**: Responsive design starting from mobile screens
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation
- **Performance**: Optimized animations and lazy loading
- **Maintainability**: Component-based architecture with TypeScript

### Customization
The design system is built with CSS custom properties, making it easy to customize:
- Colors: Modify theme colors in `globals.css`
- Typography: Adjust font families and weights
- Spacing: Customize the spacing scale
- Animations: Fine-tune motion preferences

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Semantic commit messages
- Component documentation with JSDoc
- Unit tests for critical functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling approach
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Recharts](https://recharts.org/) for beautiful data visualizations

## 📞 Support

If you have any questions or need help getting started:
- 📧 Email: support@financeflow.com
- 💬 Discord: [Join our community](https://discord.gg/financeflow)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/financeflow/issues)

---

Built with ❤️ by the FinanceFlow team. Making personal finance accessible and enjoyable for everyone.