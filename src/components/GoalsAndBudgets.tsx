"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Goal, 
  Target, 
  Percent, 
  Rocket, 
  FlagTriangleRight, 
  TableOfContents, 
  Flag,
  ChartBarIncreasing,
  Undo,
  Focus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  dueDate?: string;
  createdAt: string;
  milestones: Milestone[];
  completedAt?: string;
  notes?: string;
}

interface Milestone {
  id: string;
  name: string;
  targetAmount: number;
  completed: boolean;
  completedAt?: string;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    monthlyContribution: 500,
    dueDate: '2024-12-31',
    createdAt: '2024-01-01',
    milestones: [
      { id: '1', name: 'First $1000', targetAmount: 1000, completed: true, completedAt: '2024-02-15' },
      { id: '2', name: 'Quarter Way', targetAmount: 2500, completed: true, completedAt: '2024-04-20' },
      { id: '3', name: 'Halfway Point', targetAmount: 5000, completed: true, completedAt: '2024-06-30' },
      { id: '4', name: 'Three Quarters', targetAmount: 7500, completed: false },
      { id: '5', name: 'Full Emergency Fund', targetAmount: 10000, completed: false }
    ],
    notes: 'Building emergency fund for peace of mind'
  },
  {
    id: '2',
    name: 'Vacation to Japan',
    targetAmount: 5000,
    currentAmount: 2200,
    monthlyContribution: 300,
    dueDate: '2024-08-01',
    createdAt: '2024-01-15',
    milestones: [
      { id: '1', name: 'Flight Money', targetAmount: 1500, completed: true, completedAt: '2024-03-10' },
      { id: '2', name: 'Accommodation Fund', targetAmount: 3000, completed: false },
      { id: '3', name: 'Activity Budget', targetAmount: 5000, completed: false }
    ],
    notes: 'Two weeks in Tokyo and Kyoto'
  },
  {
    id: '3',
    name: 'New Car Down Payment',
    targetAmount: 8000,
    currentAmount: 8000,
    monthlyContribution: 400,
    createdAt: '2023-10-01',
    completedAt: '2024-01-15',
    milestones: [
      { id: '1', name: 'Initial Savings', targetAmount: 2000, completed: true, completedAt: '2023-11-15' },
      { id: '2', name: 'Halfway There', targetAmount: 4000, completed: true, completedAt: '2023-12-20' },
      { id: '3', name: 'Almost Done', targetAmount: 6000, completed: true, completedAt: '2024-01-05' },
      { id: '4', name: 'Full Down Payment', targetAmount: 8000, completed: true, completedAt: '2024-01-15' }
    ],
    notes: 'Completed! Used for Honda Civic purchase.'
  }
];

const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

const Confetti = ({ isVisible }: { isVisible: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      gravity: number;
      color: string;
      size: number;
    }> = [];

    const colors = ['#2ed3b7', '#f0b289', '#22c55e', '#64d7c2'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        gravity: 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        if (particle.y > canvas.height) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

const GoalCard = ({ 
  goal, 
  onEdit, 
  onDragStart, 
  onDragEnd,
  isDragging,
  ...props 
}: { 
  goal: Goal; 
  onEdit: (goal: Goal) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = goal.completedAt !== undefined;
  const timeRemaining = goal.dueDate ? Math.ceil((new Date(goal.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileHover={{ y: -2 }}
      whileDrag={{ scale: 1.05, rotate: 2 }}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
      {...props}
    >
      <Card className={`bg-card border-border hover:bg-surface-1 transition-colors ${isCompleted ? 'ring-2 ring-success' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                {isCompleted ? <Flag className="w-5 h-5 text-success" /> : <Target className="w-5 h-5 text-primary" />}
                {goal.name}
                {isCompleted && <Badge variant="secondary" className="text-xs bg-success text-success-foreground">Completed</Badge>}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goal)}
              className="opacity-60 hover:opacity-100"
            >
              <TableOfContents className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <ProgressRing progress={progress} size={80} strokeWidth={6} />
            <div className="flex-1 ml-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly</span>
                <span className="font-medium">${goal.monthlyContribution}</span>
              </div>
              {timeRemaining !== null && !isCompleted && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Days left</span>
                  <span className={`font-medium ${timeRemaining < 30 ? 'text-warning' : ''}`}>
                    {timeRemaining > 0 ? timeRemaining : 'Overdue'}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NewGoalForm = ({ onSubmit, onCancel }: { onSubmit: (goal: Partial<Goal>) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    monthlyContribution: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }
    
    if (!formData.monthlyContribution || parseFloat(formData.monthlyContribution) <= 0) {
      newErrors.monthlyContribution = 'Monthly contribution must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        monthlyContribution: parseFloat(formData.monthlyContribution),
        dueDate: formData.dueDate || undefined,
        currentAmount: 0,
        milestones: [],
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-surface-1 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Goal className="w-5 h-5 text-primary" />
            Create New Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Emergency Fund"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="10000"
                  className={errors.targetAmount ? 'border-destructive' : ''}
                />
                {errors.targetAmount && <p className="text-sm text-destructive mt-1">{errors.targetAmount}</p>}
              </div>
              
              <div>
                <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={formData.monthlyContribution}
                  onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
                  placeholder="500"
                  className={errors.monthlyContribution ? 'border-destructive' : ''}
                />
                {errors.monthlyContribution && <p className="text-sm text-destructive mt-1">{errors.monthlyContribution}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                <Rocket className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const GoalDetailModal = ({ goal, onClose, onUpdate }: { goal: Goal; onClose: () => void; onUpdate: (goal: Goal) => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState(goal.notes || '');
  const [addFundsAmount, setAddFundsAmount] = useState('');

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = goal.completedAt !== undefined;

  const handleMilestoneComplete = (milestoneId: string) => {
    const updatedGoal = {
      ...goal,
      milestones: goal.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, completed: true, completedAt: new Date().toISOString() }
          : m
      )
    };
    onUpdate(updatedGoal);
    toast.success('Milestone completed! 🎉');
  };

  const handleAddFunds = () => {
    if (addFundsAmount && parseFloat(addFundsAmount) > 0) {
      const amount = parseFloat(addFundsAmount);
      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
      const updatedGoal = {
        ...goal,
        currentAmount: newAmount,
        completedAt: newAmount >= goal.targetAmount ? new Date().toISOString() : undefined
      };
      onUpdate(updatedGoal);
      setAddFundsAmount('');
      toast.success(`Added $${amount.toLocaleString()} to ${goal.name}!`);
    }
  };

  const handleNotesUpdate = () => {
    onUpdate({ ...goal, notes });
    toast.success('Notes updated');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompleted ? <Flag className="w-5 h-5 text-success" /> : <Target className="w-5 h-5 text-primary" />}
            {goal.name}
            {isCompleted && <Badge variant="secondary" className="bg-success text-success-foreground">Completed</Badge>}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-center">
              <ProgressRing progress={progress} size={160} strokeWidth={12} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Amount</p>
                <p className="text-2xl font-bold text-primary">${goal.currentAmount.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Target Amount</p>
                <p className="text-2xl font-bold">${goal.targetAmount.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Monthly Contribution</p>
                <p className="text-xl font-semibold">${goal.monthlyContribution.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-xl font-semibold text-warning">${(goal.targetAmount - goal.currentAmount).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your goal..."
                className="mt-1"
              />
              <Button onClick={handleNotesUpdate} className="mt-2" size="sm">
                Update Notes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <div className="space-y-3">
              {goal.milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${milestone.completed ? 'bg-success/10 border-success' : 'bg-surface-1 border-border'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${milestone.completed ? 'bg-success border-success' : 'border-border'}`}>
                        {milestone.completed && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-sm text-muted-foreground">${milestone.targetAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    {!milestone.completed && goal.currentAmount >= milestone.targetAmount && (
                      <Button
                        onClick={() => handleMilestoneComplete(milestone.id)}
                        size="sm"
                        className="bg-success hover:bg-success/90"
                      >
                        <FlagTriangleRight className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                  {milestone.completedAt && (
                    <p className="text-xs text-success mt-2">
                      Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-surface-1 rounded-lg">
                <p className="font-medium">Goal Created</p>
                <p className="text-sm text-muted-foreground">{new Date(goal.createdAt).toLocaleDateString()}</p>
              </div>
              {goal.milestones.filter(m => m.completed).map((milestone) => (
                <div key={milestone.id} className="p-4 bg-success/10 rounded-lg border border-success">
                  <p className="font-medium text-success">Milestone Completed: {milestone.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {milestone.completedAt && new Date(milestone.completedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {goal.completedAt && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary">
                  <p className="font-medium text-primary">🎉 Goal Completed!</p>
                  <p className="text-sm text-muted-foreground">{new Date(goal.completedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            {!isCompleted && (
              <Card className="bg-surface-1">
                <CardHeader>
                  <CardTitle className="text-lg">Add Funds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="addFunds">Amount ($)</Label>
                    <Input
                      id="addFunds"
                      type="number"
                      value={addFundsAmount}
                      onChange={(e) => setAddFundsAmount(e.target.value)}
                      placeholder="Enter amount to add"
                    />
                  </div>
                  <Button onClick={handleAddFunds} className="w-full" disabled={!addFundsAmount}>
                    <ChartBarIncreasing className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {isCompleted && (
              <Card className="bg-success/10 border-success">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="text-4xl">🎉</div>
                    <h3 className="text-xl font-semibold text-success">Goal Completed!</h3>
                    <p className="text-muted-foreground">Congratulations on reaching your savings goal.</p>
                    <Button className="bg-success hover:bg-success/90">
                      <Rocket className="w-4 h-4 mr-2" />
                      Move to Savings Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default function GoalsAndBudgets() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCreateGoal = useCallback(async (goalData: Partial<Goal>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newGoal: Goal = {
        id: Date.now().toString(),
        ...goalData,
        currentAmount: 0,
        milestones: [],
        createdAt: new Date().toISOString()
      } as Goal;
      
      setGoals(prev => [newGoal, ...prev]);
      setShowNewGoalForm(false);
      toast.success('Goal created successfully!');
    } catch (error) {
      toast.error('Failed to create goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateGoal = useCallback(async (updatedGoal: Goal) => {
    const wasCompleted = goals.find(g => g.id === updatedGoal.id)?.completedAt;
    const isNowCompleted = updatedGoal.completedAt;
    
    setGoals(prev => prev.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
    
    // Show confetti if goal was just completed
    if (!wasCompleted && isNowCompleted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success('🎉 Congratulations! Goal completed!');
    }
  }, [goals]);

  const handleReorderGoals = useCallback(async (fromIndex: number, toIndex: number) => {
    const newGoals = [...goals];
    const [removed] = newGoals.splice(fromIndex, 1);
    newGoals.splice(toIndex, 0, removed);
    
    setGoals(newGoals);
    toast.success('Goals reordered');
  }, [goals]);

  const activeGoals = goals.filter(g => !g.completedAt);
  const completedGoals = goals.filter(g => g.completedAt);

  if (goals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Goals & Budgets</h2>
        </div>
        
        <Card className="bg-surface-1 border-dashed border-2 border-border">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <Goal className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Create Your First Goal</h3>
              <p className="text-muted-foreground">Start your savings journey by setting up your first financial goal.</p>
            </div>
            <Button onClick={() => setShowNewGoalForm(true)} className="bg-primary hover:bg-primary/90">
              <Rocket className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Confetti isVisible={showConfetti} />
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Goals & Budgets</h2>
        <Button 
          onClick={() => setShowNewGoalForm(true)}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          <Goal className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showNewGoalForm && (
          <NewGoalForm
            onSubmit={handleCreateGoal}
            onCancel={() => setShowNewGoalForm(false)}
          />
        )}
      </AnimatePresence>

      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Focus className="w-5 h-5" />
            Active Goals ({activeGoals.length})
          </h3>
          <div className="space-y-3">
            {activeGoals.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={setSelectedGoal}
                onDragStart={() => setDraggedIndex(index)}
                onDragEnd={() => setDraggedIndex(null)}
                isDragging={draggedIndex === index}
              />
            ))}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Flag className="w-5 h-5 text-success" />
            Completed Goals ({completedGoals.length})
          </h3>
          <div className="space-y-3">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={setSelectedGoal}
                onDragStart={() => {}}
                onDragEnd={() => {}}
                isDragging={false}
              />
            ))}
          </div>
        </div>
      )}

      {selectedGoal && (
        <GoalDetailModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onUpdate={handleUpdateGoal}
        />
      )}
    </div>
  );
}