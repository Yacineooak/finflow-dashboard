"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap,
  Home,
  Car,
  Shield,
  Monitor,
  Phone,
  Dumbbell,
  Receipt,
  TrendingUp,
  DollarSign,
  CalendarDays,
  Eye,
  Edit,
  Trash2,
  Bell,
  Download,
  Grid3X3,
  List,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  autoPay: boolean;
  status: 'paid' | 'due' | 'overdue' | 'upcoming';
  paymentMethod?: string;
  lastPaid?: Date;
  nextDue: Date;
}

interface BillCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const billCategories: BillCategory[] = [
  { id: 'housing', name: 'Housing', icon: Home, color: 'bg-blue-500' },
  { id: 'utilities', name: 'Utilities', icon: Zap, color: 'bg-yellow-500' },
  { id: 'insurance', name: 'Insurance', icon: Shield, color: 'bg-green-500' },
  { id: 'subscriptions', name: 'Subscriptions', icon: Monitor, color: 'bg-purple-500' },
  { id: 'transportation', name: 'Transportation', icon: Car, color: 'bg-red-500' },
  { id: 'personal', name: 'Personal', icon: Phone, color: 'bg-pink-500' },
];

const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Rent',
    amount: 1500,
    dueDate: new Date(2024, 11, 1),
    frequency: 'monthly',
    category: 'housing',
    autoPay: true,
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    lastPaid: new Date(2024, 10, 1),
    nextDue: new Date(2024, 11, 1)
  },
  {
    id: '2',
    name: 'Electricity',
    amount: 120,
    dueDate: new Date(2024, 11, 15),
    frequency: 'monthly',
    category: 'utilities',
    autoPay: false,
    status: 'due',
    nextDue: new Date(2024, 11, 15)
  },
  {
    id: '3',
    name: 'Car Insurance',
    amount: 180,
    dueDate: new Date(2024, 10, 28),
    frequency: 'monthly',
    category: 'insurance',
    autoPay: true,
    status: 'overdue',
    nextDue: new Date(2024, 10, 28)
  },
  {
    id: '4',
    name: 'Netflix',
    amount: 15.99,
    dueDate: new Date(2024, 11, 20),
    frequency: 'monthly',
    category: 'subscriptions',
    autoPay: true,
    status: 'upcoming',
    nextDue: new Date(2024, 11, 20)
  },
  {
    id: '5',
    name: 'Internet',
    amount: 80,
    dueDate: new Date(2024, 11, 12),
    frequency: 'monthly',
    category: 'utilities',
    autoPay: true,
    status: 'due',
    nextDue: new Date(2024, 11, 12)
  },
  {
    id: '6',
    name: 'Gym Membership',
    amount: 45,
    dueDate: new Date(2024, 11, 25),
    frequency: 'monthly',
    category: 'personal',
    autoPay: false,
    status: 'upcoming',
    nextDue: new Date(2024, 11, 25)
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'due':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'overdue':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'upcoming':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid':
      return CheckCircle2;
    case 'due':
      return Clock;
    case 'overdue':
      return AlertCircle;
    case 'upcoming':
      return CalendarDays;
    default:
      return Clock;
  }
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || bill.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || bill.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalMonthlyBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const upcomingBills = bills.filter(bill => bill.status === 'upcoming' || bill.status === 'due').length;
  const overdueBills = bills.filter(bill => bill.status === 'overdue').length;
  const paidBills = bills.filter(bill => bill.status === 'paid').length;

  const handleMarkAsPaid = (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'paid' as const, lastPaid: new Date() }
        : bill
    ));
    toast.success('Bill marked as paid');
  };

  const handleDeleteBill = (billId: string) => {
    setBills(prev => prev.filter(bill => bill.id !== billId));
    toast.success('Bill deleted');
  };

  const AddBillForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      amount: '',
      dueDate: '',
      frequency: 'monthly',
      category: 'utilities',
      autoPay: false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newBill: Bill = {
        id: Date.now().toString(),
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: new Date(formData.dueDate),
        frequency: formData.frequency as any,
        category: formData.category,
        autoPay: formData.autoPay,
        status: 'upcoming',
        nextDue: new Date(formData.dueDate)
      };
      
      setBills(prev => [...prev, newBill]);
      setIsAddBillOpen(false);
      toast.success('Bill added successfully');
      setFormData({
        name: '',
        amount: '',
        dueDate: '',
        frequency: 'monthly',
        category: 'utilities',
        autoPay: false
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Bill Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Electricity Bill"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {billCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autopay"
            checked={formData.autoPay}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoPay: checked }))}
          />
          <Label htmlFor="autopay">Enable Auto-Pay</Label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Add Bill
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsAddBillOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold">Bills & Payments</h1>
          <p className="text-muted-foreground">Manage your recurring bills and track payments</p>
        </div>
        
        <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bill</DialogTitle>
            </DialogHeader>
            <AddBillForm />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Overview Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Monthly Bills
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyBills.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Bills
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{upcomingBills}</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overdue Bills
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{overdueBills}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Paid This Month
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{paidBills}</div>
            <p className="text-xs text-muted-foreground">
              On schedule
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <List className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Search and Filters */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {billCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="due">Due</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bills List */}
            <div className="space-y-3">
              <AnimatePresence>
                {filteredBills.map((bill, index) => {
                  const category = billCategories.find(cat => cat.id === bill.category);
                  const StatusIcon = getStatusIcon(bill.status);
                  
                  return (
                    <motion.div
                      key={bill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${category?.color || 'bg-gray-500'}/20`}>
                                {category && <category.icon className="h-5 w-5" />}
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{bill.name}</h3>
                                  <Badge className={`${getStatusColor(bill.status)} border`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>${bill.amount.toLocaleString()}</span>
                                  <span>•</span>
                                  <span>Due {bill.nextDue.toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span className="capitalize">{bill.frequency}</span>
                                  {bill.autoPay && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center gap-1">
                                        <Zap className="h-3 w-3 text-primary" />
                                        <span>Auto-pay</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {bill.status !== 'paid' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleMarkAsPaid(bill.id)}
                                  className="gap-2"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Mark Paid
                                </Button>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Bill
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Bell className="h-4 w-4 mr-2" />
                                    Set Reminder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-400"
                                    onClick={() => handleDeleteBill(bill.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Bill
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {filteredBills.length === 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bills found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Get started by adding your first bill'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Bills Calendar</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View your bills by due date
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <h3 className="font-semibold">Bills for {selectedDate?.toLocaleDateString()}</h3>
                    <div className="space-y-2">
                      {bills
                        .filter(bill => 
                          selectedDate && 
                          bill.nextDue.toDateString() === selectedDate.toDateString()
                        )
                        .map(bill => {
                          const category = billCategories.find(cat => cat.id === bill.category);
                          return (
                            <div key={bill.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <div className={`p-2 rounded-lg ${category?.color || 'bg-gray-500'}/20`}>
                                {category && <category.icon className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{bill.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  ${bill.amount.toLocaleString()}
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(bill.status)} border`}>
                                {bill.status}
                              </Badge>
                            </div>
                          );
                        })}
                      
                      {(!selectedDate || bills.filter(bill => 
                        bill.nextDue.toDateString() === selectedDate.toDateString()
                      ).length === 0) && (
                        <p className="text-muted-foreground text-center py-4">
                          No bills due on this date
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Category Breakdown */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {billCategories.map(category => {
                    const categoryBills = bills.filter(bill => bill.category === category.id);
                    const totalAmount = categoryBills.reduce((sum, bill) => sum + bill.amount, 0);
                    const percentage = totalMonthlyBills > 0 ? (totalAmount / totalMonthlyBills) * 100 : 0;
                    
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="font-semibold">${totalAmount.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{categoryBills.length} bills</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Payment Status */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Payment Status Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>Paid</span>
                      </div>
                      <span className="font-semibold">{paidBills} bills</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span>Due Soon</span>
                      </div>
                      <span className="font-semibold">{bills.filter(b => b.status === 'due').length} bills</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span>Overdue</span>
                      </div>
                      <span className="font-semibold">{overdueBills} bills</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-400" />
                        <span>Upcoming</span>
                      </div>
                      <span className="font-semibold">{bills.filter(b => b.status === 'upcoming').length} bills</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Auto-pay Status */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Auto-pay Status</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Bills with automatic payment enabled
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Auto-pay Enabled</span>
                      <span className="font-semibold text-green-400">
                        {bills.filter(b => b.autoPay).length}
                      </span>
                    </div>
                    <Progress 
                      value={(bills.filter(b => b.autoPay).length / bills.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Manual Payment</span>
                      <span className="font-semibold text-yellow-400">
                        {bills.filter(b => !b.autoPay).length}
                      </span>
                    </div>
                    <Progress 
                      value={(bills.filter(b => !b.autoPay).length / bills.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}