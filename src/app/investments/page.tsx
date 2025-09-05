"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  PieChart,
  BarChart3,
  Calendar,
  DollarSign,
  Target,
  Shield,
  Percent,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

// Mock data interfaces
interface Holding {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'etf' | 'mutual_fund';
  shares: number;
  currentPrice: number;
  marketValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  averageCost: number;
  dividendYield?: number;
  peRatio?: number;
  beta?: number;
  sector?: string;
}

interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'dividend';
  shares: number;
  price: number;
  total: number;
  date: string;
  status: 'executed' | 'pending' | 'cancelled';
}

interface PortfolioMetrics {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  ytdReturn: number;
  oneYearReturn: number;
  fiveYearReturn: number;
  diversityScore: number;
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
  dividendYield: number;
  avgPeRatio: number;
  portfolioBeta: number;
}

// Mock data
const mockHoldings: Holding[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    shares: 25,
    currentPrice: 192.53,
    marketValue: 4813.25,
    dayChange: 2.47,
    dayChangePercent: 1.3,
    totalReturn: 821.25,
    totalReturnPercent: 20.6,
    averageCost: 160.42,
    dividendYield: 0.5,
    peRatio: 29.2,
    beta: 1.2,
    sector: 'Technology'
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    shares: 15,
    currentPrice: 378.85,
    marketValue: 5682.75,
    dayChange: -5.23,
    dayChangePercent: -1.4,
    totalReturn: 1182.75,
    totalReturnPercent: 26.3,
    averageCost: 300.00,
    dividendYield: 0.7,
    peRatio: 34.1,
    beta: 0.9,
    sector: 'Technology'
  },
  {
    id: '3',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'stock',
    shares: 12,
    currentPrice: 248.42,
    marketValue: 2981.04,
    dayChange: 8.15,
    dayChangePercent: 3.4,
    totalReturn: -318.96,
    totalReturnPercent: -9.7,
    averageCost: 275.00,
    peRatio: 62.8,
    beta: 2.1,
    sector: 'Consumer Cyclical'
  },
  {
    id: '4',
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    type: 'crypto',
    shares: 0.5,
    currentPrice: 43250.00,
    marketValue: 21625.00,
    dayChange: 1250.00,
    dayChangePercent: 6.1,
    totalReturn: 4625.00,
    totalReturnPercent: 27.2,
    averageCost: 34000.00
  },
  {
    id: '5',
    symbol: 'ETH-USD',
    name: 'Ethereum',
    type: 'crypto',
    shares: 8,
    currentPrice: 2485.30,
    marketValue: 19882.40,
    dayChange: -85.20,
    dayChangePercent: -1.7,
    totalReturn: 3882.40,
    totalReturnPercent: 24.3,
    averageCost: 2000.00
  },
  {
    id: '6',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    type: 'etf',
    shares: 50,
    currentPrice: 441.07,
    marketValue: 22053.50,
    dayChange: 2.85,
    dayChangePercent: 0.3,
    totalReturn: 2553.50,
    totalReturnPercent: 13.1,
    averageCost: 389.00,
    dividendYield: 1.3,
    sector: 'Diversified'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    symbol: 'AAPL',
    type: 'buy',
    shares: 5,
    price: 192.53,
    total: -962.65,
    date: '2024-01-15',
    status: 'executed'
  },
  {
    id: '2',
    symbol: 'TSLA',
    type: 'sell',
    shares: 3,
    price: 248.42,
    total: 745.26,
    date: '2024-01-14',
    status: 'executed'
  },
  {
    id: '3',
    symbol: 'MSFT',
    type: 'dividend',
    shares: 15,
    price: 0.75,
    total: 11.25,
    date: '2024-01-12',
    status: 'executed'
  },
  {
    id: '4',
    symbol: 'SPY',
    type: 'buy',
    shares: 10,
    price: 441.07,
    total: -4410.70,
    date: '2024-01-10',
    status: 'pending'
  }
];

const mockPortfolioMetrics: PortfolioMetrics = {
  totalValue: 77037.94,
  dayChange: 1397.02,
  dayChangePercent: 1.85,
  ytdReturn: 12.4,
  oneYearReturn: 18.7,
  fiveYearReturn: 11.2,
  diversityScore: 78,
  riskLevel: 'Moderate',
  dividendYield: 1.2,
  avgPeRatio: 42.0,
  portfolioBeta: 1.3
};

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      current += increment;
      step++;
      
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString('en-US', { 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals 
      })}{suffix}
    </span>
  );
};

// Holdings Table Component
const HoldingsTable = ({ holdings }: { holdings: Holding[] }) => {
  const [sortField, setSortField] = useState<keyof Holding>('marketValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (field: keyof Holding) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedHoldings = holdings
    .filter(holding => {
      const matchesSearch = holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           holding.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || holding.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const SortIcon = ({ field }: { field: keyof Holding }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-30" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search holdings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="stock">Stocks</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="etf">ETFs</SelectItem>
            <SelectItem value="mutual_fund">Mutual Funds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort('symbol')} className="h-8 p-0 font-medium">
                  Symbol <SortIcon field="symbol" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('name')} className="h-8 p-0 font-medium">
                  Name <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('shares')} className="h-8 p-0 font-medium">
                  Shares <SortIcon field="shares" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('currentPrice')} className="h-8 p-0 font-medium">
                  Price <SortIcon field="currentPrice" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('marketValue')} className="h-8 p-0 font-medium">
                  Market Value <SortIcon field="marketValue" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('dayChangePercent')} className="h-8 p-0 font-medium">
                  Day Change <SortIcon field="dayChangePercent" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('totalReturnPercent')} className="h-8 p-0 font-medium">
                  Total Return <SortIcon field="totalReturnPercent" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredAndSortedHoldings.map((holding) => (
                <React.Fragment key={holding.id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge variant={holding.type === 'stock' ? 'default' : 
                                      holding.type === 'crypto' ? 'secondary' : 'outline'}>
                          {holding.symbol}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{holding.name}</div>
                        {holding.sector && (
                          <div className="text-sm text-muted-foreground">{holding.sector}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {holding.shares.toLocaleString('en-US', { 
                        minimumFractionDigits: holding.type === 'crypto' ? 4 : 0,
                        maximumFractionDigits: holding.type === 'crypto' ? 4 : 0
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      ${holding.currentPrice.toLocaleString('en-US', { 
                        minimumFractionDigits: 2 
                      })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${holding.marketValue.toLocaleString('en-US', { 
                        minimumFractionDigits: 2 
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 ${
                        holding.dayChangePercent >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {holding.dayChangePercent >= 0 ? 
                          <ArrowUpRight className="w-4 h-4" /> : 
                          <ArrowDownRight className="w-4 h-4" />
                        }
                        <div>
                          <div>{holding.dayChangePercent >= 0 ? '+' : ''}
                            {holding.dayChangePercent.toFixed(2)}%</div>
                          <div className="text-xs">
                            ${Math.abs(holding.dayChange).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`${
                        holding.totalReturnPercent >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        <div>{holding.totalReturnPercent >= 0 ? '+' : ''}
                          {holding.totalReturnPercent.toFixed(1)}%</div>
                        <div className="text-xs">
                          ${Math.abs(holding.totalReturn).toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(holding.id)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedRows.has(holding.id) ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </Button>
                    </TableCell>
                  </motion.tr>
                  
                  <AnimatePresence>
                    {expandedRows.has(holding.id) && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <TableCell colSpan={8} className="bg-muted/20">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                            <div>
                              <div className="text-sm font-medium">Avg Cost</div>
                              <div className="text-sm text-muted-foreground">
                                ${holding.averageCost.toFixed(2)}
                              </div>
                            </div>
                            {holding.dividendYield && (
                              <div>
                                <div className="text-sm font-medium">Dividend Yield</div>
                                <div className="text-sm text-muted-foreground">
                                  {holding.dividendYield.toFixed(1)}%
                                </div>
                              </div>
                            )}
                            {holding.peRatio && (
                              <div>
                                <div className="text-sm font-medium">P/E Ratio</div>
                                <div className="text-sm text-muted-foreground">
                                  {holding.peRatio.toFixed(1)}
                                </div>
                              </div>
                            )}
                            {holding.beta && (
                              <div>
                                <div className="text-sm font-medium">Beta</div>
                                <div className="text-sm text-muted-foreground">
                                  {holding.beta.toFixed(2)}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Portfolio Chart Component (Mock)
const PortfolioChart = ({ timeRange }: { timeRange: string }) => {
  const generateMockData = () => {
    const points = timeRange === '1D' ? 24 : timeRange === '1W' ? 7 : 
                   timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 
                   timeRange === '1Y' ? 365 : 1825;
    
    return Array.from({ length: points }, (_, i) => ({
      date: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 75000 + Math.random() * 5000 + i * 10
    }));
  };

  const data = generateMockData();

  return (
    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <BarChart3 className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">Portfolio Performance Chart</p>
        <p className="text-sm text-muted-foreground">Time Range: {timeRange}</p>
      </div>
    </div>
  );
};

// Asset Allocation Chart Component (Mock)
const AssetAllocationChart = ({ holdings }: { holdings: Holding[] }) => {
  const allocation = holdings.reduce((acc, holding) => {
    acc[holding.type] = (acc[holding.type] || 0) + holding.marketValue;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-4">
      <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
        <div className="text-center">
          <PieChart className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Asset Allocation</p>
        </div>
      </div>
      <div className="space-y-2">
        {Object.entries(allocation).map(([type, value]) => (
          <div key={type} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="capitalize text-sm">{type.replace('_', ' ')}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{((value / total) * 100).toFixed(1)}%</span>
              <span className="text-muted-foreground ml-2">
                ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add Investment Modal
const AddInvestmentModal = ({ onAdd }: { onAdd: (investment: any) => void }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    shares: '',
    price: '',
    type: 'stock'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    toast.success('Investment added successfully!');
    setFormData({ symbol: '', shares: '', price: '', type: 'stock' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
          <DialogDescription>
            Enter the details of your new investment position.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Symbol</label>
            <Input
              placeholder="AAPL, BTC-USD, etc."
              value={formData.symbol}
              onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="etf">ETF</SelectItem>
                <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Shares</label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0"
                value={formData.shares}
                onChange={(e) => setFormData(prev => ({ ...prev, shares: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Investment</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Investments Page Component
export default function InvestmentsPage() {
  const [timeRange, setTimeRange] = useState('1M');
  const [holdings, setHoldings] = useState(mockHoldings);
  const [transactions] = useState(mockTransactions);
  const [metrics] = useState(mockPortfolioMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Portfolio data refreshed');
    setIsRefreshing(false);
  };

  const handleAddInvestment = (investment: any) => {
    // In a real app, this would make an API call
    console.log('Adding investment:', investment);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold font-heading">Investment Portfolio</h1>
            <p className="text-muted-foreground">Track and manage your investment positions</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AddInvestmentModal onAdd={handleAddInvestment} />
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $<AnimatedCounter value={metrics.totalValue} decimals={2} />
              </div>
              <div className={`flex items-center gap-1 text-sm mt-1 ${
                metrics.dayChangePercent >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                {metrics.dayChangePercent >= 0 ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span>{metrics.dayChangePercent >= 0 ? '+' : ''}{metrics.dayChangePercent}%</span>
                <span>(${metrics.dayChange >= 0 ? '+' : ''}{metrics.dayChange.toFixed(2)})</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">YTD Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                +{metrics.ytdReturn}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Outperforming S&P 500 by 2.1%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Diversity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.diversityScore}/100</div>
              <Progress value={metrics.diversityScore} className="mt-2" />
              <div className="text-sm text-muted-foreground mt-1">{metrics.riskLevel} Risk</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dividend Yield</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.dividendYield}%</div>
              <div className="text-sm text-muted-foreground mt-1">
                Est. annual income: ${(metrics.totalValue * metrics.dividendYield / 100).toFixed(0)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Portfolio Performance</CardTitle>
                <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="1D">1D</TabsTrigger>
                    <TabsTrigger value="1W">1W</TabsTrigger>
                    <TabsTrigger value="1M">1M</TabsTrigger>
                    <TabsTrigger value="3M">3M</TabsTrigger>
                    <TabsTrigger value="1Y">1Y</TabsTrigger>
                    <TabsTrigger value="ALL">ALL</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <PortfolioChart timeRange={timeRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetAllocationChart holdings={holdings} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Avg P/E Ratio</div>
                  <div className="font-semibold">{metrics.avgPeRatio}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Portfolio Beta</div>
                  <div className="font-semibold">{metrics.portfolioBeta}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Holdings</div>
                  <div className="font-semibold">{holdings.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Risk Level</div>
                  <div className="font-semibold">{metrics.riskLevel}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Holdings and Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>Your current investment positions</CardDescription>
            </CardHeader>
            <CardContent>
              <HoldingsTable holdings={holdings} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest trading activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transactions.map((transaction) => (
                <motion.div 
                  key={transaction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'buy' ? 'bg-success/10 text-success' :
                      transaction.type === 'sell' ? 'bg-destructive/10 text-destructive' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {transaction.type === 'buy' ? <ArrowUpRight className="w-4 h-4" /> :
                       transaction.type === 'sell' ? <ArrowDownRight className="w-4 h-4" /> :
                       <DollarSign className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} {transaction.shares}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${transaction.total >= 0 ? 'text-success' : 'text-foreground'}`}>
                      ${Math.abs(transaction.total).toFixed(2)}
                    </div>
                    <Badge variant={
                      transaction.status === 'executed' ? 'default' :
                      transaction.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}