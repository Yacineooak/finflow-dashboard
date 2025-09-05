"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  Receipt,
  ArrowDownNarrowWide,
  ArrowUpDown,
  TableRowsSplit,
  FoldVertical,
  Rows4,
  BanknoteArrowUp,
  ChevronsDownUp
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  merchant: string;
  category: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  notes?: string;
  tags?: string[];
  merchantLogo?: string;
  location?: string;
}

interface Insight {
  id: string;
  text: string;
  confidence: number;
  type: 'warning' | 'info' | 'success';
  category?: string;
  action?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    merchant: 'Starbucks Coffee',
    category: 'Food & Dining',
    date: '2024-01-15',
    amount: -12.50,
    status: 'completed',
    paymentMethod: 'Credit Card',
    notes: 'Morning coffee',
    tags: ['coffee', 'regular'],
    merchantLogo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=32&h=32&fit=crop&crop=center',
    location: 'Downtown Seattle'
  },
  {
    id: '2',
    type: 'income',
    merchant: 'TechCorp Inc',
    category: 'Salary',
    date: '2024-01-01',
    amount: 4500.00,
    status: 'completed',
    paymentMethod: 'Direct Deposit',
    notes: 'Monthly salary',
    tags: ['salary', 'recurring'],
    location: 'Seattle, WA'
  },
  {
    id: '3',
    type: 'expense',
    merchant: 'Amazon',
    category: 'Shopping',
    date: '2024-01-14',
    amount: -89.99,
    status: 'pending',
    paymentMethod: 'Debit Card',
    notes: 'Home office supplies',
    tags: ['office', 'supplies'],
    merchantLogo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=32&h=32&fit=crop&crop=center',
    location: 'Online'
  },
  {
    id: '4',
    type: 'expense',
    merchant: 'Netflix',
    category: 'Entertainment',
    date: '2024-01-13',
    amount: -15.99,
    status: 'completed',
    paymentMethod: 'Credit Card',
    notes: 'Monthly subscription',
    tags: ['subscription', 'entertainment'],
    location: 'Online'
  }
];

const mockInsights: Insight[] = [
  {
    id: '1',
    text: 'You spent 20% more on dining this month compared to last month',
    confidence: 85,
    type: 'warning',
    category: 'Food & Dining',
    action: 'Consider setting a dining budget'
  },
  {
    id: '2',
    text: 'Your subscription expenses have increased by $12.99',
    confidence: 92,
    type: 'info',
    category: 'Entertainment',
    action: 'Review active subscriptions'
  },
  {
    id: '3',
    text: 'Great job! You saved 15% more than last month',
    confidence: 78,
    type: 'success',
    action: 'Keep up the good work'
  }
];

const categories = ['All Categories', 'Food & Dining', 'Shopping', 'Entertainment', 'Salary', 'Transportation', 'Utilities'];
const statuses = ['All Statuses', 'completed', 'pending', 'failed'];

export default function TransactionsAndReports() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [dateRange, setDateRange] = useState('all');
  const [showSubscriptionsOnly, setShowSubscriptionsOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentView, setCurrentView] = useState<'transactions' | 'comparison'>('transactions');
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [appliedInsightFilter, setAppliedInsightFilter] = useState<string | null>(null);

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Simulate loading when filters change
  useEffect(() => {
    if (debouncedSearchQuery || selectedCategory !== 'All Categories' || selectedStatus !== 'All Statuses') {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [debouncedSearchQuery, selectedCategory, selectedStatus, dateRange]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.merchant.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus !== 'All Statuses') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    // Apply subscriptions filter
    if (showSubscriptionsOnly) {
      filtered = filtered.filter(t => t.tags?.includes('subscription'));
    }

    // Apply insight filter if any
    if (appliedInsightFilter) {
      const insight = mockInsights.find(i => i.id === appliedInsightFilter);
      if (insight?.category) {
        filtered = filtered.filter(t => t.category === insight.category);
      }
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'amount') {
        aVal = Math.abs(a.amount);
        bVal = Math.abs(b.amount);
      }

      if (sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [transactions, debouncedSearchQuery, selectedCategory, selectedStatus, showSubscriptionsOnly, sortField, sortDirection, appliedInsightFilter]);

  const handleSort = useCallback((field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField]);

  const handleTransactionSelect = useCallback((transactionId: string, checked: boolean) => {
    setSelectedTransactions(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(transactionId);
      } else {
        newSet.delete(transactionId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedTransactions(new Set(filteredAndSortedTransactions.map(t => t.id)));
    } else {
      setSelectedTransactions(new Set());
    }
  }, [filteredAndSortedTransactions]);

  const handleExpandTransaction = useCallback((transactionId: string) => {
    setExpandedTransaction(prev => prev === transactionId ? null : transactionId);
  }, []);

  const handleExport = useCallback(async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          toast.success(`Transactions exported successfully!`, {
            description: `Downloaded ${selectedTransactions.size > 0 ? selectedTransactions.size : filteredAndSortedTransactions.length} transactions as ${format.toUpperCase()}`,
            action: {
              label: 'View File',
              onClick: () => toast.info('Mock download - file would open here')
            }
          });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  }, [selectedTransactions.size, filteredAndSortedTransactions.length]);

  const handleInsightClick = useCallback((insightId: string) => {
    const insight = mockInsights.find(i => i.id === insightId);
    if (insight?.category) {
      setAppliedInsightFilter(insightId);
      setSelectedCategory(insight.category);
      toast.info(`Applied filter: ${insight.category}`, {
        action: {
          label: 'Clear',
          onClick: () => {
            setAppliedInsightFilter(null);
            setSelectedCategory('All Categories');
          }
        }
      });
    }
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return <Receipt className="h-4 w-4" />;
      case 'Shopping':
        return <BanknoteArrowUp className="h-4 w-4" />;
      case 'Entertainment':
        return <FoldVertical className="h-4 w-4" />;
      case 'Salary':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Rows4 className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive'
    } as const;
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <mark key={index} className="bg-primary/20 text-primary-foreground rounded px-1">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">Transactions & Reports</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your transactions and view detailed reports
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              <div className="flex-1">
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={showSubscriptionsOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSubscriptionsOnly(!showSubscriptionsOnly)}
                >
                  Subscriptions Only
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as 'transactions' | 'comparison')}>
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* AI Insights Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ChevronsDownUp className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Smart insights about your spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/5 ${
                      appliedInsightFilter === insight.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleInsightClick(insight.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={insight.type === 'success' ? 'default' : insight.type === 'warning' ? 'destructive' : 'secondary'}>
                        {insight.confidence}% confident
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-2">{insight.text}</p>
                    {insight.action && (
                      <p className="text-xs text-muted-foreground">{insight.action}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedTransactions.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedTransactions.size} transactions selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Categorize
                      </Button>
                      <Button size="sm" variant="outline">
                        Add Tags
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleExport('csv')}>
                        Export Selected
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Export Progress */}
          {isExporting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Exporting transactions...</span>
                        <span className="text-sm text-muted-foreground">{exportProgress}%</span>
                      </div>
                      <Progress value={exportProgress} className="w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Transactions</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExport('csv')}>
                    Export CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleExport('pdf')}>
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedTransactions.size === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all transactions"
                        />
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handleSort('type')}
                      >
                        <div className="flex items-center gap-1">
                          Type
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handleSort('merchant')}
                      >
                        <div className="flex items-center gap-1">
                          Merchant
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center gap-1">
                          Category
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none text-right"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center gap-1 justify-end">
                          Amount
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading skeletons
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredAndSortedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <TableRowsSplit className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No transactions found</p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All Categories');
                                setSelectedStatus('All Statuses');
                                setShowSubscriptionsOnly(false);
                                setAppliedInsightFilter(null);
                              }}
                            >
                              Clear Filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedTransactions.map((transaction) => (
                        <React.Fragment key={transaction.id}>
                          <TableRow 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleExpandTransaction(transaction.id)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedTransactions.has(transaction.id)}
                                onCheckedChange={(checked) => handleTransactionSelect(transaction.id, checked as boolean)}
                                aria-label={`Select transaction ${transaction.merchant}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-6 w-6"
                              >
                                <ArrowDownNarrowWide className={`h-3 w-3 transition-transform ${expandedTransaction === transaction.id ? 'rotate-180' : ''}`} />
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(transaction.category)}
                                <span className="text-sm capitalize">{transaction.type}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {transaction.merchantLogo && (
                                  <img 
                                    src={transaction.merchantLogo} 
                                    alt={transaction.merchant}
                                    className="h-6 w-6 rounded-full object-cover"
                                  />
                                )}
                                <span className="font-medium">
                                  {highlightMatch(transaction.merchant, debouncedSearchQuery)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={appliedInsightFilter && mockInsights.find(i => i.id === appliedInsightFilter)?.category === transaction.category ? 'text-primary font-medium' : ''}>
                                {highlightMatch(transaction.category, debouncedSearchQuery)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(transaction.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`font-medium ${transaction.amount < 0 ? 'text-destructive' : 'text-success'}`}>
                                ${Math.abs(transaction.amount).toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(transaction.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{transaction.paymentMethod}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <AnimatePresence>
                            {expandedTransaction === transaction.id && (
                              <TableRow>
                                <TableCell colSpan={9} className="p-0 border-0">
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 bg-muted/20 border-t">
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                          <h4 className="font-medium mb-2">Transaction Details</h4>
                                          <div className="space-y-1 text-sm">
                                            <p><span className="text-muted-foreground">Location:</span> {transaction.location || 'N/A'}</p>
                                            <p><span className="text-muted-foreground">Transaction ID:</span> {transaction.id}</p>
                                            {transaction.tags && (
                                              <div className="flex flex-wrap gap-1 mt-2">
                                                {transaction.tags.map(tag => (
                                                  <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-medium mb-2">Notes</h4>
                                          <Textarea
                                            value={transaction.notes || ''}
                                            onChange={(e) => {
                                              // Mock note editing
                                              const updatedTransactions = transactions.map(t => 
                                                t.id === transaction.id ? { ...t, notes: e.target.value } : t
                                              );
                                              setTransactions(updatedTransactions);
                                            }}
                                            placeholder="Add notes..."
                                            className="min-h-[60px]"
                                          />
                                        </div>
                                        <div>
                                          <h4 className="font-medium mb-2">Similar Merchants</h4>
                                          <div className="space-y-1 text-sm text-muted-foreground">
                                            <p>• Starbucks Reserve</p>
                                            <p>• Blue Bottle Coffee</p>
                                            <p>• Local Coffee Shop</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex justify-end gap-2 mt-4">
                                        <Button size="sm" variant="outline">
                                          Edit Transaction
                                        </Button>
                                        <Button size="sm" variant="outline">
                                          View Receipt
                                        </Button>
                                      </div>
                                    </div>
                                  </motion.div>
                                </TableCell>
                              </TableRow>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
                <CardDescription>January 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">$4,382.51</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Food & Dining</div>
                      <div className="font-medium">$234.50</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Shopping</div>
                      <div className="font-medium">$892.30</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Entertainment</div>
                      <div className="font-medium">$156.99</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Transportation</div>
                      <div className="font-medium">$89.20</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Last Month</CardTitle>
                <CardDescription>December 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">$3,924.18</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Food & Dining</div>
                      <div className="font-medium">$195.20</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Shopping</div>
                      <div className="font-medium">$756.80</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Entertainment</div>
                      <div className="font-medium">$143.99</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Transportation</div>
                      <div className="font-medium">$122.40</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Month-over-Month Analysis
                <Button size="sm" variant="outline">
                  Explain Changes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-destructive">+11.7%</div>
                  <div className="text-sm text-muted-foreground">Overall Increase</div>
                  <div className="text-xs text-muted-foreground mt-1">$458.33 more</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-destructive">+20.1%</div>
                  <div className="text-sm text-muted-foreground">Food & Dining</div>
                  <div className="text-xs text-muted-foreground mt-1">$39.30 more</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-destructive">+17.9%</div>
                  <div className="text-sm text-muted-foreground">Shopping</div>
                  <div className="text-xs text-muted-foreground mt-1">$135.50 more</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-success">-27.1%</div>
                  <div className="text-sm text-muted-foreground">Transportation</div>
                  <div className="text-xs text-muted-foreground mt-1">$33.20 less</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}