"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area, AreaChart,
  ScatterChart, Scatter, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import {
  Calendar, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon,
  Target, AlertTriangle, CheckCircle, Download, Filter, BarChart3,
  Activity, Zap, Brain, Eye, FileText, Settings, Calendar as CalendarIcon,
  CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Plus, Minus,
  RefreshCw, MoreHorizontal, ExternalLink, Info, Star, Award,
  Shield, Users, Lightbulb, ChevronDown, ChevronUp, Search,
  SlidersHorizontal, BarChart2, LineChart as LineChartIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// TypeScript Interfaces
interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

interface ChartData {
  name: string;
  value: number;
  category?: string;
  date?: string;
  income?: number;
  expenses?: number;
  savings?: number;
  predicted?: boolean;
}

interface FilterState {
  dateRange: string;
  categories: string[];
  accounts: string[];
  transactionType: string;
  amountRange: [number, number];
}

interface AnalyticsInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'danger';
  title: string;
  description: string;
  action?: string;
  priority: number;
}

// Mock Data
const mockMetrics: FinancialMetric[] = [
  {
    id: 'health-score',
    name: 'Financial Health Score',
    value: 78,
    change: 5.2,
    changeType: 'positive',
    icon: <Shield className="w-5 h-5" />,
    description: 'Overall financial wellness indicator'
  },
  {
    id: 'savings-rate',
    name: 'Savings Rate',
    value: 23.5,
    change: -2.1,
    changeType: 'negative',
    icon: <Target className="w-5 h-5" />,
    description: 'Percentage of income saved this month'
  },
  {
    id: 'debt-ratio',
    name: 'Debt-to-Income',
    value: 32.8,
    change: -1.5,
    changeType: 'positive',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Total debt as percentage of monthly income'
  },
  {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    value: 4.2,
    change: 0.8,
    changeType: 'positive',
    icon: <Shield className="w-5 h-5" />,
    description: 'Months of expenses covered'
  }
];

const mockSpendingData: ChartData[] = [
  { name: 'Housing', value: 2400, category: 'essential' },
  { name: 'Food', value: 800, category: 'essential' },
  { name: 'Transportation', value: 600, category: 'essential' },
  { name: 'Entertainment', value: 400, category: 'lifestyle' },
  { name: 'Shopping', value: 350, category: 'lifestyle' },
  { name: 'Healthcare', value: 300, category: 'essential' },
  { name: 'Utilities', value: 250, category: 'essential' },
  { name: 'Other', value: 200, category: 'misc' }
];

const mockTrendData: ChartData[] = [
  { name: 'Jan', income: 6500, expenses: 4800, savings: 1700 },
  { name: 'Feb', income: 6800, expenses: 5200, savings: 1600 },
  { name: 'Mar', income: 7200, expenses: 5400, savings: 1800 },
  { name: 'Apr', income: 6900, expenses: 5100, savings: 1800 },
  { name: 'May', income: 7500, expenses: 5300, savings: 2200 },
  { name: 'Jun', income: 7800, expenses: 5600, savings: 2200 },
  { name: 'Jul', income: 7600, expenses: 5500, savings: 2100, predicted: true },
  { name: 'Aug', income: 7900, expenses: 5700, savings: 2200, predicted: true },
  { name: 'Sep', income: 8100, expenses: 5800, savings: 2300, predicted: true }
];

const mockInsights: AnalyticsInsight[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Spending Spike Detected',
    description: 'Entertainment spending is 25% higher than usual this month',
    action: 'Review recent transactions',
    priority: 1
  },
  {
    id: '2',
    type: 'success',
    title: 'Savings Goal On Track',
    description: 'You\'re ahead of schedule for your emergency fund goal',
    priority: 2
  },
  {
    id: '3',
    type: 'info',
    title: 'Investment Opportunity',
    description: 'Consider increasing retirement contributions with surplus funds',
    action: 'Learn more',
    priority: 3
  }
];

const AdvancedAnalyticsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '6m',
    categories: [],
    accounts: [],
    transactionType: 'all',
    amountRange: [0, 10000]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Computed data based on filters
  const filteredData = useMemo(() => {
    // Apply filters to mock data (simplified)
    return mockTrendData;
  }, [filters]);

  const MetricCard: React.FC<{ metric: FinancialMetric; index: number }> = ({ metric, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
          <div className="p-2 bg-primary/10 rounded-lg">
            {metric.icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metric.name.includes('Score') || metric.name.includes('Rate') || metric.name.includes('Ratio') 
              ? `${metric.value}%` 
              : metric.name.includes('Fund') 
                ? `${metric.value} months`
                : `$${metric.value.toLocaleString()}`
            }
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {metric.changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : metric.changeType === 'negative' ? (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            ) : (
              <Minus className="w-4 h-4 text-muted-foreground mr-1" />
            )}
            {Math.abs(metric.change)}% from last month
          </div>
          <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FinancialHealthBreakdown: React.FC = () => {
    const healthMetrics = [
      { name: 'Cash Flow', score: 85, color: '#22c55e' },
      { name: 'Debt Management', score: 72, color: '#f0b289' },
      { name: 'Savings Rate', score: 78, color: '#2ed3b7' },
      { name: 'Investment Growth', score: 65, color: '#64d7c2' }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Financial Health Breakdown
          </CardTitle>
          <CardDescription>Detailed analysis of your financial wellness components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthMetrics.map((metric, index) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.name}</span>
                  <span className="font-medium">{metric.score}/100</span>
                </div>
                <Progress value={metric.score} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-sm">Recommendation</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Focus on debt management to improve your overall score. Consider consolidating high-interest debt.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const WaterfallChart: React.FC = () => {
    const waterfallData = [
      { name: 'Starting Balance', value: 5000, cumulative: 5000 },
      { name: 'Income', value: 7500, cumulative: 12500 },
      { name: 'Housing', value: -2400, cumulative: 10100 },
      { name: 'Food', value: -800, cumulative: 9300 },
      { name: 'Transport', value: -600, cumulative: 8700 },
      { name: 'Other', value: -1500, cumulative: 7200 },
      { name: 'Ending Balance', value: 0, cumulative: 7200 }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Cash Flow Waterfall
          </CardTitle>
          <CardDescription>Monthly cash flow breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Bar dataKey="value" fill={(entry) => entry.value > 0 ? '#22c55e' : '#ef4444'} />
              <Line type="monotone" dataKey="cumulative" stroke="#2ed3b7" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const PredictiveAnalytics: React.FC = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Predictive Insights
          </CardTitle>
          <CardDescription>AI-powered financial forecasting</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#22c55e" 
                strokeWidth={2}
                strokeDasharray={(entry) => entry?.predicted ? "5 5" : "0"}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray={(entry) => entry?.predicted ? "5 5" : "0"}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#2ed3b7" 
                strokeWidth={2}
                strokeDasharray={(entry) => entry?.predicted ? "5 5" : "0"}
              />
              <ReferenceLine x="Jun" stroke="#666" strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-500">+12%</div>
              <div className="text-xs text-muted-foreground">Predicted Income Growth</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-400">+5%</div>
              <div className="text-xs text-muted-foreground">Expense Increase</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-400">85%</div>
              <div className="text-xs text-muted-foreground">Goal Achievement Probability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const InsightsPanel: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Smart Insights
        </CardTitle>
        <CardDescription>AI-generated financial recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockInsights.map((insight) => (
            <motion.div
              key={insight.id}
              className="p-4 border rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  insight.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                  insight.type === 'success' ? 'bg-green-500/10 text-green-500' :
                  insight.type === 'danger' ? 'bg-red-500/10 text-red-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {insight.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                  {insight.type === 'success' && <CheckCircle className="w-4 h-4" />}
                  {insight.type === 'info' && <Info className="w-4 h-4" />}
                  {insight.type === 'danger' && <AlertTriangle className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  {insight.action && (
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                      {insight.action} <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const FilterPanel: React.FC = () => (
    <Sheet open={showFilters} onOpenChange={setShowFilters}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>Customize your analytics view</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, dateRange: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Amount Range</label>
            <Slider
              value={filters.amountRange}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, amountRange: value as [number, number] }))
              }
              max={10000}
              step={100}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>${filters.amountRange[0]}</span>
              <span>${filters.amountRange[1]}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Transaction Type</label>
            <Select value={filters.transactionType} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, transactionType: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expenses">Expenses Only</SelectItem>
                <SelectItem value="transfers">Transfers Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-heading">Advanced Analytics</h1>
          <p className="text-muted-foreground">Comprehensive financial insights and reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterPanel />
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockMetrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialHealthBreakdown />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Spending Distribution
                </CardTitle>
                <CardDescription>Current month category breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockSpendingData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#2ed3b7"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockSpendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[
                          '#2ed3b7', '#f0b289', '#22c55e', '#64d7c2', 
                          '#ef4444', '#8b5cf6', '#f59e0b', '#6b7280'
                        ][index % 8]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WaterfallChart />
            <InsightsPanel />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <PredictiveAnalytics />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5" />
                  Income vs Expenses Trend
                </CardTitle>
                <CardDescription>12-month financial flow analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Detailed Analysis
                  </CardTitle>
                  <CardDescription>Deep dive into your financial patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Spending Velocity</h4>
                        <div className="text-2xl font-bold text-orange-500">+15%</div>
                        <p className="text-sm text-muted-foreground">Rate of spending increase</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Cash Efficiency</h4>
                        <div className="text-2xl font-bold text-green-500">87%</div>
                        <p className="text-sm text-muted-foreground">How well you utilize funds</p>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart data={mockSpendingData}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="value" name="Amount" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Categories" dataKey="value" fill="#2ed3b7" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>vs. Peers</span>
                        <span className="text-green-500">+12%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>vs. National Avg</span>
                        <span className="text-blue-500">+8%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Peer Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">Top 25%</div>
                    <p className="text-sm text-muted-foreground">Financial health ranking</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generate Reports
                </CardTitle>
                <CardDescription>Create custom financial reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <BarChart2 className="w-6 h-6" />
                    <span className="text-xs">Monthly Summary</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <PieChartIcon className="w-6 h-6" />
                    <span className="text-xs">Category Report</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-xs">Trend Analysis</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Target className="w-6 h-6" />
                    <span className="text-xs">Goals Progress</span>
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Format</label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Scheduled Reports
                </CardTitle>
                <CardDescription>Automated report delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Monthly Summary</div>
                      <div className="text-xs text-muted-foreground">Every 1st of month</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Weekly Spending</div>
                      <div className="text-xs text-muted-foreground">Every Monday</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Quarterly Review</div>
                      <div className="text-xs text-muted-foreground">Every quarter end</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsPage;