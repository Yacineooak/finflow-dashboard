"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  PanelLeft, 
  PanelLeftOpen, 
  PanelLeftClose,
  SquareMenu,
  Ham
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  selector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'transactions', label: 'Transactions', icon: PanelLeft, href: '/transactions' },
  { id: 'goals', label: 'Goals', icon: PanelLeftOpen, href: '/goals' },
  { id: 'investments', label: 'Investments', icon: PanelLeftClose, href: '/investments' },
  { id: 'bills', label: 'Bills', icon: SquareMenu, href: '/bills' },
  { id: 'analytics', label: 'Analytics', icon: Ham, href: '/analytics' },
  { id: 'settings', label: 'Settings', icon: PanelLeft, href: '/settings' },
  { id: 'support', label: 'Support', icon: LayoutDashboard, href: '/support' },
];

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'greeting',
    title: 'Welcome to FinanceFlow!',
    description: 'Let\'s take a quick tour to help you get started with managing your finances.',
    selector: '[data-onboarding="welcome"]',
    position: 'bottom',
  },
  {
    id: 'kpi',
    title: 'Your Financial Overview',
    description: 'These KPI cards show your key financial metrics at a glance.',
    selector: '[data-onboarding="kpi-cards"]',
    position: 'bottom',
  },
  {
    id: 'goals',
    title: 'Set Your Goals',
    description: 'Create and track your financial goals to stay motivated and on track.',
    selector: '[data-onboarding="goals-section"]',
    position: 'left',
  },
];

export default function AppShell({ children, pageTitle = "Dashboard" }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'fun'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);
  const [language, setLanguage] = useState('en');
  
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Get active nav item based on current pathname
  const activeNavItem = navigationItems.find(item => item.href === pathname)?.id || 'dashboard';

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem('financeflow-theme') as 'light' | 'dark' | 'fun';
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('financeflow-theme', theme);
      document.documentElement.className = theme === 'dark' ? 'dark' : '';
    }
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'f' || (event.metaKey && event.key === 'k')) {
        event.preventDefault();
        searchRef.current?.focus();
        setIsCommandOpen(true);
      }
      
      if (event.key === 'Escape') {
        setIsCommandOpen(false);
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle navigation keyboard navigation
  const handleNavKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (index + 1) % navigationItems.length;
      const nextItem = navRef.current?.querySelector(`[data-nav-index="${nextIndex}"]`) as HTMLButtonElement;
      nextItem?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = index === 0 ? navigationItems.length - 1 : index - 1;
      const prevItem = navRef.current?.querySelector(`[data-nav-index="${prevIndex}"]`) as HTMLButtonElement;
      prevItem?.focus();
    }
  }, []);

  // Focus management for mobile nav
  useEffect(() => {
    if (isMobileNavOpen) {
      const firstNavItem = mobileNavRef.current?.querySelector('[data-nav-index="0"]') as HTMLButtonElement;
      firstNavItem?.focus();
    }
  }, [isMobileNavOpen]);

  // Onboarding functions
  const startOnboarding = useCallback(() => {
    setIsOnboardingActive(true);
    setCurrentOnboardingStep(0);
    toast.success('Tutorial started! Follow the guided tour.');
  }, []);

  const nextOnboardingStep = useCallback(() => {
    if (currentOnboardingStep < onboardingSteps.length - 1) {
      setCurrentOnboardingStep(prev => prev + 1);
    } else {
      setIsOnboardingActive(false);
      setCurrentOnboardingStep(0);
      toast.success('Tutorial completed! You\'re all set to explore FinanceFlow.');
    }
  }, [currentOnboardingStep]);

  const skipOnboarding = useCallback(() => {
    setIsOnboardingActive(false);
    setCurrentOnboardingStep(0);
    toast.info('Tutorial skipped. You can restart it anytime from your profile menu.');
  }, []);

  const toggleNavCollapse = useCallback(() => {
    setIsNavCollapsed(prev => !prev);
  }, []);

  const handleThemeChange = useCallback((newTheme: 'light' | 'dark' | 'fun') => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  }, []);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    toast.success(`Language changed to ${newLanguage === 'en' ? 'English' : newLanguage === 'fr' ? 'French' : 'Arabic'}`);
  }, []);

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav 
      ref={!mobile ? navRef : undefined} 
      className={`flex ${mobile ? 'flex-col' : 'flex-col'} gap-1 p-2`}
      role="navigation"
      aria-label="Main navigation"
    >
      {navigationItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeNavItem === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={`
              w-full justify-start h-12 px-3
              ${!mobile && isNavCollapsed ? 'px-2' : ''}
              ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
            `}
            data-nav-index={index}
            onClick={() => {
              router.push(item.href);
              if (mobile) setIsMobileNavOpen(false);
            }}
            onKeyDown={(e) => handleNavKeyDown(e, index)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {(!isNavCollapsed || mobile) && (
              <span className="ml-3 truncate">{item.label}</span>
            )}
          </Button>
        );
      })}
    </nav>
  );

  const OnboardingTooltip = () => {
    if (!isOnboardingActive) return null;
    
    const step = onboardingSteps[currentOnboardingStep];
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            className="absolute bg-card border rounded-lg shadow-lg p-4 max-w-sm pointer-events-auto"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold text-card-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentOnboardingStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={skipOnboarding}>
                  Skip
                </Button>
                <Button size="sm" onClick={nextOnboardingStep}>
                  {currentOnboardingStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Navigation Rail */}
      <motion.aside
        className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border"
        initial={false}
        animate={{
          width: isNavCollapsed ? '4rem' : '16rem'
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {/* Nav Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!isNavCollapsed && (
            <h1 className="font-heading font-bold text-lg text-sidebar-foreground">
              FinanceFlow
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNavCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label={isNavCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {isNavCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <NavItems />
        </div>

        {/* Upgrade Pro CTA */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="outline"
            size="sm"
            className={`w-full ${isNavCollapsed ? 'px-2' : ''}`}
          >
            {!isNavCollapsed && <span className="mr-2">Upgrade Pro</span>}
            <Badge variant="secondary" className="text-xs">
              {isNavCollapsed ? '✨' : 'NEW'}
            </Badge>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 border-b border-border bg-card">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <SquareMenu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-sidebar">
                <div className="p-4 border-b border-sidebar-border">
                  <h1 className="font-heading font-bold text-lg text-sidebar-foreground">
                    FinanceFlow
                  </h1>
                </div>
                <div ref={mobileNavRef}>
                  <NavItems mobile />
                </div>
              </SheetContent>
            </Sheet>

            {/* Page Title */}
            <h2 className="font-heading font-semibold text-lg text-foreground">
              {pageTitle}
            </h2>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Input
                ref={searchRef}
                placeholder="Search or press F to open command..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsCommandOpen(true)}
                className="w-full pr-16"
                aria-label="Search and command input"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ⌘K
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Ham className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications ({notificationCount} unread)</span>
            </Button>

            {/* Theme Selector */}
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="fun">Fun</SelectItem>
              </SelectContent>
            </Select>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={startOnboarding}>
                  Start Tutorial
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div data-onboarding="welcome">
            {children}
          </div>
        </main>
      </div>

      {/* Onboarding Overlay */}
      <OnboardingTooltip />
    </div>
  );
}