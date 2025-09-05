"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Target, 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  CreditCard, 
  Car, 
  Home, 
  Plane, 
  GraduationCap, 
  Heart, 
  Trophy, 
  Star, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Zap,
  Award,
  Gift,
  Sparkles,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  Download,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for goals and budgets
const mockGoalTemplates = [
  { id: 'emergency', name: 'Emergency Fund', icon: PiggyBank, description: '3-6 months of expenses', targetAmount: 15000, category: 'savings' },
  { id: 'vacation', name: 'Dream Vacation', icon: Plane, description: 'Trip to Europe', targetAmount: 5000, category: 'savings' },
  { id: 'car', name: 'New Car', icon: Car, description: 'Down payment', targetAmount: 8000, category: 'savings' },
  { id: 'house', name: 'House Down Payment', icon: Home, description: '20% down payment', targetAmount: 50000, category: 'savings' },
  { id: 'education', name: 'Education Fund', icon: GraduationCap, description: 'College or certification', targetAmount: 25000, category: 'savings' },
  { id: 'debt', name: 'Pay Off Credit Card', icon: CreditCard, description: 'Eliminate high-interest debt', targetAmount: 12000, category: 'debt' },
  { id: 'investment', name: 'Investment Portfolio', icon: TrendingUp, description: 'Long-term wealth building', targetAmount: 30000, category: 'investment' },
  { id: 'wedding', name: 'Wedding Fund', icon: Heart, description: 'Special day expenses', targetAmount: 20000, category: 'savings' }
];

const mockGoals = [
  {
    id: '1',
    name: 'Emergency Fund',
    description: '6 months of living expenses',
    targetAmount: 18000,
    currentAmount: 12500,
    deadline: '2024-12-31',
    category: 'savings',
    priority: 1,
    icon: PiggyBank,
    color: 'bg-chart-1',
    status: 'active',
    milestones: [
      { id: 'm1', amount: 3000, description: '1 month expenses', completed: true, date: '2024-01-15' },
      { id: 'm2', amount: 9000, description: '3 months expenses', completed: true, date: '2024-05-20' },
      { id: 'm3', amount: 18000, description: '6 months expenses', completed: false, date: '2024-12-31' }
    ],
    monthlyContribution: 800,
    createdAt: '2023-10-01',
    achievements: ['first_milestone', 'consistent_saver']
  },
  {
    id: '2',
    name: 'Dream Vacation to Japan',
    description: '2-week trip including flights and accommodation',
    targetAmount: 8000,
    currentAmount: 3200,
    deadline: '2024-08-15',
    category: 'savings',
    priority: 2,
    icon: Plane,
    color: 'bg-chart-2',
    status: 'active',
    milestones: [
      { id: 'm4', amount: 2000, description: 'Flight booking', completed: true, date: '2024-02-01' },
      { id: 'm5', amount: 5000, description: 'Accommodation budget', completed: false, date: '2024-06-01' },
      { id: 'm6', amount: 8000, description: 'Full vacation fund', completed: false, date: '2024-08-01' }
    ],
    monthlyContribution: 600,
    createdAt: '2023-11-15',
    achievements: ['quick_start']
  },
  {
    id: '3',
    name: 'Credit Card Debt',
    description: 'Pay off high-interest credit card balance',
    targetAmount: 5500,
    currentAmount: 2200,
    deadline: '2024-09-30',
    category: 'debt',
    priority: 3,
    icon: CreditCard,
    color: 'bg-chart-5',
    status: 'active',
    milestones: [
      { id: 'm7', amount: 1500, description: 'First quarter payment', completed: true, date: '2024-03-31' },
      { id: 'm8', amount: 3500, description: 'Halfway point', completed: false, date: '2024-06-30' },
      { id: 'm9', amount: 5500, description: 'Debt-free!', completed: false, date: '2024-09-30' }
    ],
    monthlyContribution: 450,
    createdAt: '2024-01-01',
    achievements: []
  },
  {
    id: '4',
    name: 'Investment Portfolio',
    description: 'Build long-term wealth through diversified investments',
    targetAmount: 25000,
    currentAmount: 25000,
    deadline: '2024-06-30',
    category: 'investment',
    priority: 4,
    icon: TrendingUp,
    color: 'bg-chart-3',
    status: 'completed',
    milestones: [
      { id: 'm10', amount: 10000, description: 'Initial investment', completed: true, date: '2023-12-01' },
      { id: 'm11', amount: 18000, description: 'Milestone 2', completed: true, date: '2024-03-15' },
      { id: 'm12', amount: 25000, description: 'Target reached', completed: true, date: '2024-06-15' }
    ],
    monthlyContribution: 1000,
    createdAt: '2023-09-01',
    achievements: ['goal_crusher', 'early_bird', 'consistent_investor']
  }
];

const mockBudgetCategories = [
  { id: 'housing', name: 'Housing', budgeted: 2500, spent: 2450, color: 'bg-chart-1', icon: Home },
  { id: 'food', name: 'Food & Dining', budgeted: 800, spent: 920, color: 'bg-chart-2', icon: Heart },
  { id: 'transportation', name: 'Transportation', budgeted: 600, spent: 475, color: 'bg-chart-3', icon: Car },
  { id: 'entertainment', name: 'Entertainment', budgeted: 400, spent: 380, color: 'bg-chart-4', icon: Sparkles },
  { id: 'shopping', name: 'Shopping', budgeted: 500, spent: 650, color: 'bg-chart-5', icon: Gift },
  { id: 'utilities', name: 'Utilities', budgeted: 300, spent: 285, color: 'bg-chart-1', icon: Zap },
];

const achievements = {
  first_milestone: { name: 'First Steps', icon: Star, description: 'Reached your first milestone' },
  consistent_saver: { name: 'Steady Saver', icon: Trophy, description: '3 months of consistent contributions' },
  quick_start: { name: 'Quick Start', icon: Zap, description: 'Added funds within first week' },
  goal_crusher: { name: 'Goal Crusher', icon: Award, description: 'Completed a major financial goal' },
  early_bird: { name: 'Early Bird', icon: CheckCircle2, description: 'Reached goal ahead of schedule' },
  consistent_investor: { name: 'Investor', icon: TrendingUp, description: 'Regular investment contributions' }
};

const GoalProgressRing = ({ progress, size = 120, strokeWidth = 8, className = "" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted-foreground/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

const MilestoneTimeline = ({ milestones, currentAmount, targetAmount }) => {
  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => {
        const isCompleted = milestone.completed;
        const isCurrent = !isCompleted && currentAmount >= (milestones[index - 1]?.amount || 0);
        
        return (
          <div key={milestone.id} className="flex items-start space-x-3">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
              isCompleted 
                ? "bg-primary border-primary text-primary-foreground" 
                : isCurrent
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted-foreground/30 text-muted-foreground"
            )}>
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={cn(
                  "text-sm font-medium",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {milestone.description}
                </p>
                <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                  ${milestone.amount.toLocaleString()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {milestone.date}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const GoalCard = ({ goal, onEdit, onDelete, onAddFunds }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const Icon = goal.icon;
  
  const statusColors = {
    active: 'border-primary/20 bg-card',
    completed: 'border-primary/40 bg-primary/5',
    overdue: 'border-destructive/40 bg-destructive/5',
    paused: 'border-muted-foreground/20 bg-card'
  };

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'paused':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Target className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border",
      statusColors[goal.status]
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-lg", goal.color, "text-white")}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{goal.name}</CardTitle>
              <CardDescription className="text-sm">{goal.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Goal Actions</SheetTitle>
                  <SheetDescription>Manage your goal settings and progress</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <Button onClick={() => onEdit(goal)} className="w-full justify-start" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Goal
                  </Button>
                  <Button onClick={() => onAddFunds(goal)} className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                  <Button onClick={() => onDelete(goal.id)} className="w-full justify-start" variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Goal
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <GoalProgressRing progress={progress} size={80} strokeWidth={6} />
          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-foreground">
              ${goal.currentAmount.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              of ${goal.targetAmount.toLocaleString()}
            </div>
            {remaining > 0 && (
              <div className="text-xs text-muted-foreground">
                ${remaining.toLocaleString()} remaining
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(goal.deadline).toLocaleDateString()}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            ${goal.monthlyContribution}/mo
          </Badge>
        </div>

        {goal.achievements.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {goal.achievements.slice(0, 3).map(achievement => {
              const achievementData = achievements[achievement];
              const AchievementIcon = achievementData.icon;
              return (
                <Badge key={achievement} variant="outline" className="text-xs">
                  <AchievementIcon className="w-3 h-3 mr-1" />
                  {achievementData.name}
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const GoalCreationWizard = ({ isOpen, onClose, templates }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: 'savings',
    monthlyContribution: '',
    template: null
  });

  const handleTemplateSelect = (template) => {
    setFormData({
      ...formData,
      name: template.name,
      description: template.description,
      targetAmount: template.targetAmount.toString(),
      category: template.category,
      template: template
    });
    setStep(2);
  };

  const handleSubmit = () => {
    // Create new goal logic here
    toast.success("Goal created successfully!");
    onClose();
    setStep(1);
    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      deadline: '',
      category: 'savings',
      monthlyContribution: '',
      template: null
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Choose a template or start from scratch" : "Customize your goal details"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {templates.map(template => {
                const Icon = template.icon;
                return (
                  <Card 
                    key={template.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/40"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        ${template.targetAmount.toLocaleString()}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setStep(2)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start from Scratch
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter goal name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your goal..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={formData.monthlyContribution}
                  onChange={(e) => setFormData({...formData, monthlyContribution: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="debt">Debt Payoff</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="expense">Expense Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Create Goal
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const BudgetOverview = ({ categories }) => {
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const overBudgetCategories = categories.filter(cat => cat.spent > cat.budgeted);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budgeted</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalBudgeted.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-chart-2" />
              </div>
            </div>
            <div className="mt-2">
              <Badge 
                variant={totalSpent > totalBudgeted ? "destructive" : "secondary"}
                className="text-xs"
              >
                {totalSpent > totalBudgeted ? "Over Budget" : "On Track"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={cn(
                  "text-2xl font-bold",
                  totalBudgeted - totalSpent >= 0 ? "text-chart-3" : "text-chart-5"
                )}>
                  ${Math.abs(totalBudgeted - totalSpent).toLocaleString()}
                </p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                totalBudgeted - totalSpent >= 0 ? "bg-chart-3/10" : "bg-chart-5/10"
              )}>
                {totalBudgeted - totalSpent >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-chart-3" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-chart-5" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
          <CardDescription>Track your spending across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map(category => {
              const progress = (category.spent / category.budgeted) * 100;
              const isOverBudget = category.spent > category.budgeted;
              const Icon = category.icon;

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-2 rounded-lg", category.color, "text-white")}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${category.spent.toLocaleString()} of ${category.budgeted.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={isOverBudget ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {Math.round(progress)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(progress, 100)} 
                    className={cn(
                      "h-2",
                      isOverBudget && "bg-destructive/20"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const GoalsAndBudgets = () => {
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState(mockGoals);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [selectedGoal, setSelectedGoal] = useState(null);

  const filteredGoals = useMemo(() => {
    return goals
      .filter(goal => {
        const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             goal.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || goal.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'priority':
            return a.priority - b.priority;
          case 'progress':
            return (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount);
          case 'deadline':
            return new Date(a.deadline) - new Date(b.deadline);
          case 'amount':
            return b.targetAmount - a.targetAmount;
          default:
            return 0;
        }
      });
  }, [goals, searchTerm, filterStatus, sortBy]);

  const handleEditGoal = useCallback((goal) => {
    setSelectedGoal(goal);
    // Open edit modal logic here
    toast.info("Edit goal functionality would open here");
  }, []);

  const handleDeleteGoal = useCallback((goalId) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    toast.success("Goal deleted successfully");
  }, []);

  const handleAddFunds = useCallback((goal) => {
    // Add funds logic here
    toast.success("Add funds functionality would open here");
  }, []);

  const goalStats = useMemo(() => {
    const active = goals.filter(g => g.status === 'active').length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    
    return { active, completed, totalTarget, totalSaved };
  }, [goals]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goals & Budgets</h1>
          <p className="text-muted-foreground">Track your financial goals and manage your budget</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button onClick={() => setShowCreateGoal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold text-foreground">{goalStats.active}</p>
              </div>
              <Target className="w-8 h-8 text-chart-1" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{goalStats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Target</p>
                <p className="text-2xl font-bold text-foreground">
                  ${goalStats.totalTarget.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-2xl font-bold text-foreground">
                  ${goalStats.totalSaved.toLocaleString()}
                </p>
              </div>
              <PiggyBank className="w-8 h-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 space-x-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="amount">Target Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onAddFunds={handleAddFunds}
              />
            ))}
          </div>

          {filteredGoals.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No goals found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? "Try adjusting your filters or search terms"
                    : "Create your first financial goal to get started"
                  }
                </p>
                <Button onClick={() => setShowCreateGoal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="budgets">
          <BudgetOverview categories={mockBudgetCategories} />
        </TabsContent>
      </Tabs>

      <GoalCreationWizard
        isOpen={showCreateGoal}
        onClose={() => setShowCreateGoal(false)}
        templates={mockGoalTemplates}
      />
    </div>
  );
};

export default GoalsAndBudgets;