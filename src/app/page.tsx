"use client";

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import DashboardOverview from '@/components/DashboardOverview';
import AnalyticsPanels from '@/components/AnalyticsPanels';
import TransactionsAndReports from '@/components/TransactionsAndReports';
import GoalsAndBudgets from '@/components/GoalsAndBudgets';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Goal, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isGoalsPanelOpen, setIsGoalsPanelOpen] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AppShell pageTitle="Dashboard">
      <div className="min-h-full bg-background">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="p-4 space-y-6">
            {/* Dashboard Overview */}
            <section data-onboarding="welcome">
              <DashboardOverview />
            </section>

            {/* Analytics Panels */}
            <section>
              <AnalyticsPanels />
            </section>

            {/* Goals - Mobile Sheet */}
            <section data-onboarding="goals-section">
              <Sheet open={isGoalsPanelOpen} onOpenChange={setIsGoalsPanelOpen}>
                <SheetTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Goal className="w-4 h-4 mr-2" />
                    View Goals & Budgets
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Goals & Budgets</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto h-full pb-6">
                    <GoalsAndBudgets />
                  </div>
                </SheetContent>
              </Sheet>
            </section>

            {/* Transactions and Reports */}
            <section>
              <TransactionsAndReports />
            </section>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="flex h-full">
            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${rightPanelCollapsed ? '' : 'lg:mr-80'}`}>
              <div className="p-6 space-y-8">
                {/* Dashboard Overview - Full Width */}
                <section data-onboarding="welcome" className="w-full">
                  <DashboardOverview />
                </section>

                {/* Analytics Panels - Central Focus */}
                <section className="w-full">
                  <AnalyticsPanels />
                </section>

                {/* Transactions and Reports */}
                <section className="w-full">
                  <TransactionsAndReports />
                </section>
              </div>
            </div>

            {/* Right Utility Column */}
            <div className={`fixed right-0 top-0 h-full bg-card border-l border-border transition-all duration-300 ${
              rightPanelCollapsed ? 'w-12' : 'w-80'
            } z-10`}>
              {/* Collapse Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                className="absolute -left-6 top-20 h-12 w-6 rounded-l-md rounded-r-none bg-card border border-r-0 hover:bg-accent z-20"
              >
                {rightPanelCollapsed ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {/* Goals Panel Content */}
              {!rightPanelCollapsed && (
                <div className="h-full overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-border flex-shrink-0 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
                    <h3 className="font-semibold text-lg">Goals & Budgets</h3>
                    <p className="text-sm text-muted-foreground">Track your financial goals</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4" data-onboarding="goals-section">
                      <GoalsAndBudgets />
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsed State */}
              {rightPanelCollapsed && (
                <div className="h-full flex flex-col items-center justify-center p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRightPanelCollapsed(false)}
                    className="w-8 h-8 p-0 mb-4"
                  >
                    <Goal className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}