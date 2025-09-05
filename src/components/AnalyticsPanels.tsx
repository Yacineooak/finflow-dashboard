"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChartPie,
  ChartBar,
  ChartLine,
  ChartColumn,
  FileChartColumn,
  PanelsLeftBottom
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionData {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  description: string;
}

interface ChartData {
  expenses: Array<{ category: string; amount: number; color: string }>;
  income: Array<{ category: string; amount: number; color: string }>;
  monthlySpending: Array<{ month: string; amount: number; categories: Record<string, number> }>;
  dailyExpenses: Array<{ date: string; amount: number; transactions: TransactionData[] }>;
  cashFlow: Array<{ date: string; income: number; expenses: number; balance: number }>;
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

const CATEGORIES = [
  "Food & Dining",
  "Transportation", 
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Other"
];

export default function AnalyticsPanels() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [primaryChart, setPrimaryChart] = useState<"donut" | "bar" | "calendar" | "line">("donut");
  const [zoomRange, setZoomRange] = useState<{ start: number; end: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef<number>(0);

  // Mock API data fetching
  const fetchAnalyticsData = useCallback(async (range: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on date range
      const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
      const mockData: ChartData = {
        expenses: CATEGORIES.map((category, index) => ({
          category,
          amount: Math.random() * 1000 + 200,
          color: CHART_COLORS[index % CHART_COLORS.length]
        })),
        income: [
          { category: "Salary", amount: 5000, color: CHART_COLORS[0] },
          { category: "Freelance", amount: 1200, color: CHART_COLORS[1] },
          { category: "Investments", amount: 800, color: CHART_COLORS[2] }
        ],
        monthlySpending: Array.from({ length: 6 }, (_, i) => {
          const month = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          const categories: Record<string, number> = {};
          CATEGORIES.forEach(cat => {
            categories[cat] = Math.random() * 500 + 100;
          });
          return {
            month,
            amount: Object.values(categories).reduce((sum, val) => sum + val, 0),
            categories
          };
        }).reverse(),
        dailyExpenses: Array.from({ length: days }, (_, i) => {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const transactions: TransactionData[] = Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
            id: `${date}-${j}`,
            amount: Math.random() * 200 + 10,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            type: "expense",
            date,
            description: `Transaction ${j + 1}`
          }));
          return {
            date,
            amount: transactions.reduce((sum, t) => sum + t.amount, 0),
            transactions
          };
        }).reverse(),
        cashFlow: Array.from({ length: days }, (_, i) => {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const income = Math.random() * 300 + 100;
          const expenses = Math.random() * 250 + 50;
          return {
            date,
            income,
            expenses,
            balance: income - expenses
          };
        }).reverse()
      };
      
      setChartData(mockData);
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData(dateRange);
  }, [dateRange, fetchAnalyticsData]);

  const handleCategoryToggle = useCallback((category: string) => {
    setHiddenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  const handleExport = useCallback(() => {
    toast.success("Export mocked – download ready");
  }, []);

  const handleRetry = useCallback(() => {
    fetchAnalyticsData(dateRange);
  }, [dateRange, fetchAnalyticsData]);

  const handleZoomReset = useCallback(() => {
    setZoomRange(null);
    setSelectedMonth(null);
  }, []);

  if (error) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !chartData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-64 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredExpenses = chartData.expenses.filter(item => !hiddenCategories.has(item.category));
  const filteredIncome = chartData.income.filter(item => !hiddenCategories.has(item.category));

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Interactive charts and insights for your financial data
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExport} variant="outline" size="sm">
            <FileChartColumn className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Mobile Chart Selector */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "donut", label: "Expenses", icon: ChartPie },
            { id: "bar", label: "Monthly", icon: ChartBar },
            { id: "calendar", label: "Calendar", icon: PanelsLeftBottom },
            { id: "line", label: "Cash Flow", icon: ChartLine }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={primaryChart === id ? "default" : "outline"}
              size="sm"
              onClick={() => setPrimaryChart(id as any)}
              className="flex-shrink-0"
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2" ref={chartContainerRef}>
        {/* Expense vs Income Donut */}
        <AnimatePresence>
          {(primaryChart === "donut" || window.innerWidth >= 768) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <ChartPie className="h-5 w-5" />
                    Expenses vs Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Donut Chart Placeholder */}
                    <div className="relative h-48 flex items-center justify-center">
                      <motion.div
                        className="w-32 h-32 rounded-full border-8 border-chart-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        style={{
                          background: `conic-gradient(${filteredExpenses.map((item, index) => 
                            `${item.color} ${index * (360 / filteredExpenses.length)}deg ${(index + 1) * (360 / filteredExpenses.length)}deg`
                          ).join(', ')})`
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            ${(filteredExpenses.reduce((sum, item) => sum + item.amount, 0) + 
                               filteredIncome.reduce((sum, item) => sum + item.amount, 0)).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {[...filteredExpenses, ...filteredIncome].map((item) => (
                        <div key={item.category} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCategoryToggle(item.category)}
                              className="w-3 h-3 rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                              style={{ backgroundColor: item.color }}
                              aria-label={`Toggle ${item.category}`}
                            />
                            <span className={hiddenCategories.has(item.category) ? "line-through opacity-50" : ""}>
                              {item.category}
                            </span>
                          </div>
                          <span className="font-medium">${item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monthly Spending Bar Chart */}
        <AnimatePresence>
          {(primaryChart === "bar" || window.innerWidth >= 768) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <ChartBar className="h-5 w-5" />
                    Monthly Spending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-2">
                    {chartData.monthlySpending.map((month, index) => (
                      <motion.button
                        key={month.month}
                        className="flex-1 bg-chart-1 hover:bg-chart-2 transition-colors rounded-t focus:outline-none focus:ring-2 focus:ring-ring"
                        style={{
                          height: `${(month.amount / Math.max(...chartData.monthlySpending.map(m => m.amount))) * 100}%`,
                          minHeight: "8px"
                        }}
                        onClick={() => setSelectedMonth(selectedMonth === month.month ? null : month.month)}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scaleY: 1.05 }}
                        aria-label={`${month.month}: $${month.amount.toLocaleString()}`}
                      />
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    {chartData.monthlySpending.map(month => (
                      <span key={month.month} className="text-center">
                        {month.month}
                      </span>
                    ))}
                  </div>
                  {selectedMonth && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-3 bg-muted rounded-lg"
                    >
                      <p className="text-sm font-medium mb-2">{selectedMonth} Breakdown</p>
                      <div className="space-y-1">
                        {Object.entries(chartData.monthlySpending.find(m => m.month === selectedMonth)?.categories || {}).map(([category, amount]) => (
                          <div key={category} className="flex justify-between text-xs">
                            <span>{category}</span>
                            <span>${amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Heatmap */}
        <AnimatePresence>
          {(primaryChart === "calendar" || window.innerWidth >= 768) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <PanelsLeftBottom className="h-5 w-5" />
                    Daily Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                      <div key={day} className="text-center text-xs text-muted-foreground p-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {chartData.dailyExpenses.slice(0, 35).map((day) => {
                      const intensity = Math.min(day.amount / 200, 1);
                      const date = new Date(day.date);
                      return (
                        <Sheet key={day.date}>
                          <SheetTrigger asChild>
                            <motion.button
                              className="aspect-square rounded text-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring"
                              style={{
                                backgroundColor: `hsl(var(--chart-1) / ${intensity})`,
                                color: intensity > 0.5 ? "white" : "inherit"
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label={`${day.date}: $${day.amount.toFixed(2)} in expenses`}
                            >
                              {date.getDate()}
                            </motion.button>
                          </SheetTrigger>
                          <SheetContent side="bottom" className="max-h-[80vh]">
                            <SheetHeader>
                              <SheetTitle>
                                {date.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </SheetTitle>
                              <SheetDescription>
                                Total expenses: ${day.amount.toFixed(2)}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-4 space-y-2">
                              {day.transactions.length > 0 ? (
                                day.transactions.map(transaction => (
                                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <div>
                                      <p className="font-medium">{transaction.description}</p>
                                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                                    </div>
                                    <Badge variant="outline">
                                      ${transaction.amount.toFixed(2)}
                                    </Badge>
                                  </div>
                                ))
                              ) : (
                                <p className="text-center text-muted-foreground py-8">No transactions for this day</p>
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4, 0.6, 0.8, 1].map(intensity => (
                        <div
                          key={intensity}
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: `hsl(var(--chart-1) / ${intensity})` }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cash Flow Line Chart */}
        <AnimatePresence>
          {(primaryChart === "line" || window.innerWidth >= 768) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ChartLine className="h-5 w-5" />
                      Cash Flow
                    </CardTitle>
                    {zoomRange && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleZoomReset}
                      >
                        Reset Zoom
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="h-48 relative cursor-crosshair"
                    onMouseDown={(e) => {
                      isDragging.current = true;
                      dragStart.current = e.clientX;
                    }}
                    onMouseMove={(e) => {
                      if (isDragging.current) {
                        // Visual feedback for drag selection could go here
                      }
                    }}
                    onMouseUp={(e) => {
                      if (isDragging.current) {
                        const dragEnd = e.clientX;
                        const dragDistance = Math.abs(dragEnd - dragStart.current);
                        if (dragDistance > 10) {
                          // Calculate zoom range based on drag
                          const startPercent = Math.min(dragStart.current, dragEnd) / e.currentTarget.clientWidth;
                          const endPercent = Math.max(dragStart.current, dragEnd) / e.currentTarget.clientWidth;
                          setZoomRange({
                            start: Math.floor(startPercent * chartData.cashFlow.length),
                            end: Math.ceil(endPercent * chartData.cashFlow.length)
                          });
                        }
                      }
                      isDragging.current = false;
                    }}
                    onDoubleClick={handleZoomReset}
                  >
                    {/* Simplified line chart representation */}
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="cashFlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      
                      {/* Balance line */}
                      <motion.path
                        d={`M 0,${96} ${chartData.cashFlow.map((point, index) => {
                          const x = (index / (chartData.cashFlow.length - 1)) * 100;
                          const y = 96 - (point.balance / 300) * 48;
                          return `L ${x},${Math.max(0, Math.min(192, y))}`;
                        }).join(' ')}`}
                        fill="none"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                      
                      {/* Data points */}
                      {chartData.cashFlow.map((point, index) => {
                        const x = (index / (chartData.cashFlow.length - 1)) * 100;
                        const y = 96 - (point.balance / 300) * 48;
                        return (
                          <motion.circle
                            key={index}
                            cx={`${x}%`}
                            cy={Math.max(0, Math.min(192, y))}
                            r="3"
                            fill="hsl(var(--chart-1))"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.5 }}
                          />
                        );
                      })}
                    </svg>
                  </div>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>Click and drag to zoom • Double-click to reset</p>
                    {zoomRange && (
                      <p className="mt-1">
                        Showing days {zoomRange.start + 1} to {zoomRange.end} of {chartData.cashFlow.length}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accessibility shortcuts */}
      <div className="sr-only">
        <p>Keyboard shortcuts: Press Tab to navigate charts, Enter to interact, Escape to close modals</p>
      </div>
    </div>
  );
}