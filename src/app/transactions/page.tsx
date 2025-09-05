"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  DollarSign, 
  Tag, 
  Building2, 
  ArrowUpDown, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  FileText, 
  MapPin, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Sliders3,
  SlidersHorizontal,
  CheckSquare,
  Square,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  Receipt,
  Paperclip,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, formatDistanceToNow, parseISO, isWithinInterval, subDays, subWeeks, subMonths } from "date-fns";
import { toast } from "sonner";

// Types
interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  subcategory?: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  account: string;
  status: "pending" | "completed" | "failed";
  notes?: string;
  location?: string;
  receiptUrl?: string;
  tags?: string[];
  splitTransactions?: Array<{
    id: string;
    category: string;
    amount: number;
    description: string;
  }>;
}

interface FilterState {
  search: string;
  categories: string[];
  dateRange: { from?: Date; to?: Date };
  amountRange: [number, number];
  accounts: string[];
  types: ("income" | "expense" | "transfer")[];
  status: ("pending" | "completed" | "failed")[];
}

interface SortConfig {
  key: keyof Transaction;
  direction: "asc" | "desc";
}

// Mock data
const categories = [
  { id: "food", name: "Food & Dining", icon: "🍽️", color: "bg-orange-500" },
  { id: "transport", name: "Transportation", icon: "🚗", color: "bg-blue-500" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "bg-purple-500" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "bg-pink-500" },
  { id: "utilities", name: "Utilities", icon: "⚡", color: "bg-yellow-500" },
  { id: "healthcare", name: "Healthcare", icon: "🏥", color: "bg-red-500" },
  { id: "salary", name: "Salary", icon: "💼", color: "bg-green-500" },
  { id: "freelance", name: "Freelance", icon: "💻", color: "bg-indigo-500" },
  { id: "investments", name: "Investments", icon: "📈", color: "bg-emerald-500" },
  { id: "other", name: "Other", icon: "📦", color: "bg-gray-500" }
];

const accounts = [
  { id: "checking", name: "Main Checking", type: "checking" },
  { id: "savings", name: "High Yield Savings", type: "savings" },
  { id: "credit", name: "Rewards Credit Card", type: "credit" },
  { id: "investment", name: "Investment Account", type: "investment" }
];

const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const merchants = [
    "Starbucks", "Amazon", "Uber", "Spotify", "Netflix", "McDonald's", "Target", "Walmart", 
    "Shell Gas Station", "CVS Pharmacy", "Home Depot", "Best Buy", "Apple Store", "Google Pay",
    "Whole Foods", "Chipotle", "Delta Airlines", "Airbnb", "PayPal", "Venmo"
  ];

  for (let i = 0; i < 150; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const isIncome = category.id === "salary" || category.id === "freelance" || Math.random() < 0.1;
    const type: Transaction["type"] = isIncome ? "income" : Math.random() < 0.05 ? "transfer" : "expense";
    
    transactions.push({
      id: `txn_${i + 1}`,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      description: type === "transfer" ? `Transfer to ${account.name}` : `Purchase at ${merchant}`,
      merchant: type === "transfer" ? "Internal Transfer" : merchant,
      category: category.id,
      subcategory: Math.random() < 0.3 ? "Online" : undefined,
      amount: type === "income" ? Math.random() * 5000 + 1000 : Math.random() * 500 + 5,
      type,
      account: account.id,
      status: Math.random() < 0.9 ? "completed" : Math.random() < 0.5 ? "pending" : "failed",
      notes: Math.random() < 0.3 ? "Auto-categorized transaction" : undefined,
      location: Math.random() < 0.4 ? "New York, NY" : undefined,
      receiptUrl: Math.random() < 0.2 ? "/mock-receipt.pdf" : undefined,
      tags: Math.random() < 0.3 ? ["business", "deductible"] : undefined
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const TransactionsPage: React.FC = () => {
  const [transactions] = useState<Transaction[]>(generateMockTransactions());
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [detailsTransaction, setDetailsTransaction] = useState<Transaction | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    dateRange: {},
    amountRange: [0, 10000],
    accounts: [],
    types: [],
    status: []
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc"
  });

  // Filter and sort transactions
  const processedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !transaction.description.toLowerCase().includes(searchLower) &&
          !transaction.merchant.toLowerCase().includes(searchLower) &&
          !transaction.category.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(transaction.category)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const transactionDate = parseISO(transaction.date);
        if (filters.dateRange.from && filters.dateRange.to) {
          if (!isWithinInterval(transactionDate, { start: filters.dateRange.from, end: filters.dateRange.to })) {
            return false;
          }
        } else if (filters.dateRange.from && transactionDate < filters.dateRange.from) {
          return false;
        } else if (filters.dateRange.to && transactionDate > filters.dateRange.to) {
          return false;
        }
      }

      // Amount range filter
      const absAmount = Math.abs(transaction.amount);
      if (absAmount < filters.amountRange[0] || absAmount > filters.amountRange[1]) {
        return false;
      }

      // Account filter
      if (filters.accounts.length > 0 && !filters.accounts.includes(transaction.account)) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(transaction.type)) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(transaction.status)) {
        return false;
      }

      return true;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (sortConfig.key === "date") {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      }

      return 0;
    });

    return filtered;
  }, [transactions, filters, sortConfig]);

  // Pagination
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [processedTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);

  // Helper functions
  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[categories.length - 1];
  };

  const getAccountInfo = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId) || accounts[0];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "income":
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case "expense":
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      case "transfer":
        return <ArrowLeftRight className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleSort = useCallback((key: keyof Transaction) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
    }));
  }, []);

  const handleSelectTransaction = useCallback((transactionId: string) => {
    setSelectedTransactions(current => 
      current.includes(transactionId)
        ? current.filter(id => id !== transactionId)
        : [...current, transactionId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = paginatedTransactions.map(t => t.id);
    setSelectedTransactions(current => 
      current.length === allIds.length ? [] : allIds
    );
  }, [paginatedTransactions]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      categories: [],
      dateRange: {},
      amountRange: [0, 10000],
      accounts: [],
      types: [],
      status: []
    });
    setCurrentPage(1);
  }, []);

  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedTransactions.length === 0) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (action) {
      case "delete":
        toast.success(`Deleted ${selectedTransactions.length} transactions`);
        break;
      case "categorize":
        toast.success(`Updated category for ${selectedTransactions.length} transactions`);
        break;
      case "export":
        toast.success(`Exported ${selectedTransactions.length} transactions`);
        break;
    }
    
    setSelectedTransactions([]);
    setIsLoading(false);
  }, [selectedTransactions]);

  const QuickDateRanges = [
    { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: "Last 3 months", getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
    { label: "This year", getValue: () => ({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }) }
  ];

  // Transaction row component
  const TransactionRow: React.FC<{ transaction: Transaction; isExpanded: boolean }> = ({ 
    transaction, 
    isExpanded 
  }) => {
    const category = getCategoryInfo(transaction.category);
    const account = getAccountInfo(transaction.account);
    const isSelected = selectedTransactions.includes(transaction.id);

    return (
      <>
        <tr 
          className={`
            border-b border-border/50 transition-colors duration-200 hover:bg-muted/50 cursor-pointer
            ${isSelected ? "bg-primary/5" : ""}
            ${transaction.status === "failed" ? "opacity-60" : ""}
          `}
          onClick={() => setExpandedTransaction(isExpanded ? null : transaction.id)}
        >
          <td className="p-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleSelectTransaction(transaction.id)}
              onClick={(e) => e.stopPropagation()}
            />
          </td>
          
          <td className="p-4">
            <div className="flex items-center gap-3">
              {getTransactionIcon(transaction.type)}
              <div>
                <div className="font-medium text-sm">
                  {format(parseISO(transaction.date), "MMM dd")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(parseISO(transaction.date), { addSuffix: true })}
                </div>
              </div>
            </div>
          </td>

          <td className="p-4">
            <div className="max-w-48">
              <div className="font-medium text-sm truncate">{transaction.description}</div>
              <div className="text-xs text-muted-foreground truncate">{transaction.merchant}</div>
              {transaction.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  {transaction.location}
                </div>
              )}
            </div>
          </td>

          <td className="p-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${category.color}`} />
              <span className="text-sm">{category.name}</span>
            </div>
          </td>

          <td className="p-4">
            <div className={`
              font-semibold text-sm
              ${transaction.type === "income" ? "text-green-500" : "text-foreground"}
            `}>
              {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
            </div>
            <div className="text-xs text-muted-foreground">{account.name}</div>
          </td>

          <td className="p-4">
            <Badge variant={
              transaction.status === "completed" ? "default" :
              transaction.status === "pending" ? "secondary" : "destructive"
            }>
              {transaction.status}
            </Badge>
          </td>

          <td className="p-4">
            <div className="flex items-center gap-2">
              {transaction.receiptUrl && (
                <Receipt className="w-4 h-4 text-muted-foreground" />
              )}
              {transaction.tags && transaction.tags.length > 0 && (
                <Tag className="w-4 h-4 text-muted-foreground" />
              )}
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </td>
        </tr>

        {isExpanded && (
          <tr className="border-b border-border/50 bg-muted/20">
            <td colSpan={7} className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Transaction ID</Label>
                    <div className="text-sm font-mono">{transaction.id}</div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                    <div className="text-sm">{transaction.status}</div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Account</Label>
                    <div className="text-sm">{account.name}</div>
                  </div>
                </div>

                {transaction.notes && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Notes</Label>
                    <div className="text-sm">{transaction.notes}</div>
                  </div>
                )}

                {transaction.tags && transaction.tags.length > 0 && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Tags</Label>
                    <div className="flex gap-1 mt-1">
                      {transaction.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailsTransaction(transaction);
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {transaction.receiptUrl && (
                    <Button size="sm" variant="outline">
                      <Receipt className="w-4 h-4 mr-2" />
                      View Receipt
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("Transaction details copied to clipboard");
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  useEffect(() => {
    setFilteredTransactions(processedTransactions);
  }, [processedTransactions]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your financial transactions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{processedTransactions.length.toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-500">
                    {formatCurrency(
                      processedTransactions
                        .filter(t => t.type === "income")
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <ArrowUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-500">
                    {formatCurrency(
                      processedTransactions
                        .filter(t => t.type === "expense")
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <ArrowDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Selected</p>
                  <p className="text-2xl font-bold">{selectedTransactions.length}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions, merchants, or categories..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(filters.categories.length > 0 || filters.accounts.length > 0 || filters.types.length > 0 || filters.status.length > 0 || filters.dateRange.from || filters.dateRange.to) && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {filters.categories.length + filters.accounts.length + filters.types.length + filters.status.length + (filters.dateRange.from ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Advanced
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Advanced Filters</SheetTitle>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        {/* Amount Range */}
                        <div>
                          <Label className="text-sm font-medium">Amount Range</Label>
                          <div className="mt-2">
                            <Slider
                              value={filters.amountRange}
                              onValueChange={(value) => setFilters(prev => ({ ...prev, amountRange: value as [number, number] }))}
                              max={10000}
                              step={50}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                              <span>${filters.amountRange[0]}</span>
                              <span>${filters.amountRange[1]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Date Range */}
                        <div>
                          <Label className="text-sm font-medium">Date Range</Label>
                          <div className="mt-2 space-y-2">
                            {QuickDateRanges.map((range) => (
                              <Button
                                key={range.label}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => setFilters(prev => ({ ...prev, dateRange: range.getValue() }))}
                              >
                                {range.label}
                              </Button>
                            ))}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Custom Range
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="range"
                                  selected={{
                                    from: filters.dateRange.from,
                                    to: filters.dateRange.to
                                  }}
                                  onSelect={(range) => {
                                    setFilters(prev => ({
                                      ...prev,
                                      dateRange: { from: range?.from, to: range?.to }
                                    }));
                                  }}
                                  numberOfMonths={2}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Clear Filters */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={clearFilters}
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Quick Filters */}
              {isFiltersOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
                  {/* Categories */}
                  <div>
                    <Label className="text-sm font-medium">Categories</Label>
                    <Select
                      value={filters.categories.length > 0 ? filters.categories[0] : "all"}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setFilters(prev => ({ ...prev, categories: [] }));
                        } else {
                          setFilters(prev => ({ ...prev, categories: [value] }));
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{category.icon}</span>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Accounts */}
                  <div>
                    <Label className="text-sm font-medium">Accounts</Label>
                    <Select
                      value={filters.accounts.length > 0 ? filters.accounts[0] : "all"}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setFilters(prev => ({ ...prev, accounts: [] }));
                        } else {
                          setFilters(prev => ({ ...prev, accounts: [value] }));
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All accounts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transaction Type */}
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <Select
                      value={filters.types.length > 0 ? filters.types[0] : "all"}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setFilters(prev => ({ ...prev, types: [] }));
                        } else {
                          setFilters(prev => ({ ...prev, types: [value as "income" | "expense" | "transfer"] }));
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                      value={filters.status.length > 0 ? filters.status[0] : "all"}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setFilters(prev => ({ ...prev, status: [] }));
                        } else {
                          setFilters(prev => ({ ...prev, status: [value as "pending" | "completed" | "failed"] }));
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        {selectedTransactions.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? "s" : ""} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTransactions([])}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Selection
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select
                    onValueChange={(category) => {
                      handleBulkAction("categorize");
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categorize" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{category.icon}</span>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("export")}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction("delete")}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? "s" : ""}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length)}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.categories.length > 0 || filters.accounts.length > 0 || filters.types.length > 0 || filters.status.length > 0 || filters.dateRange.from
                    ? "Try adjusting your filters to see more results"
                    : "You haven't made any transactions yet"
                  }
                </p>
                {(filters.search || filters.categories.length > 0 || filters.accounts.length > 0 || filters.types.length > 0 || filters.status.length > 0 || filters.dateRange.from) && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr className="text-left">
                        <th className="p-4 w-12">
                          <Checkbox
                            checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="p-4 w-32">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto font-medium text-left"
                            onClick={() => handleSort("date")}
                          >
                            Date
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                          </Button>
                        </th>
                        <th className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto font-medium text-left"
                            onClick={() => handleSort("description")}
                          >
                            Description
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                          </Button>
                        </th>
                        <th className="p-4 w-48">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto font-medium text-left"
                            onClick={() => handleSort("category")}
                          >
                            Category
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                          </Button>
                        </th>
                        <th className="p-4 w-40">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto font-medium text-left"
                            onClick={() => handleSort("amount")}
                          >
                            Amount
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                          </Button>
                        </th>
                        <th className="p-4 w-28">Status</th>
                        <th className="p-4 w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaction) => (
                        <TransactionRow
                          key={transaction.id}
                          transaction={transaction}
                          isExpanded={expandedTransaction === transaction.id}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-border/50">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Transaction Details Modal */}
        <Dialog open={!!detailsTransaction} onOpenChange={() => setDetailsTransaction(null)}>
          <DialogContent className="max-w-2xl">
            {detailsTransaction && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    {getTransactionIcon(detailsTransaction.type)}
                    Transaction Details
                  </DialogTitle>
                  <DialogDescription>
                    {detailsTransaction.description} • {format(parseISO(detailsTransaction.date), "PPP")}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Amount</Label>
                      <div className={`text-2xl font-bold ${detailsTransaction.type === "income" ? "text-green-500" : "text-foreground"}`}>
                        {detailsTransaction.type === "income" ? "+" : "-"}{formatCurrency(detailsTransaction.amount)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">
                        <Badge variant={
                          detailsTransaction.status === "completed" ? "default" :
                          detailsTransaction.status === "pending" ? "secondary" : "destructive"
                        }>
                          {detailsTransaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="merchant">Merchant</Label>
                      <Input
                        id="merchant"
                        value={detailsTransaction.merchant}
                        className="mt-1"
                        readOnly
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={detailsTransaction.category}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{category.icon}</span>
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="account">Account</Label>
                        <Select value={detailsTransaction.account}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={detailsTransaction.notes || ""}
                        placeholder="Add a note..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    {detailsTransaction.location && (
                      <div>
                        <Label>Location</Label>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {detailsTransaction.location}
                        </div>
                      </div>
                    )}

                    {detailsTransaction.receiptUrl && (
                      <div>
                        <Label>Receipt</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button variant="outline" size="sm">
                            <Paperclip className="w-4 h-4 mr-2" />
                            View Receipt
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setDetailsTransaction(null)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast.success("Transaction updated successfully");
                        setDetailsTransaction(null);
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TransactionsPage;