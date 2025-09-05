"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  ChartColumnBig, 
  ChartNoAxesCombined, 
  CreditCard,
  Hand,
  MousePointer2,
  PanelTopOpen
} from "lucide-react";

interface KPIData {
  id: string;
  label: string;
  value: number;
  change: number;
  sparkline: number[];
  icon: any;
  color: string;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  claimed: boolean;
}

interface OverviewData {
  user: {
    firstName: string;
  };
  aiSummary: {
    text: string;
    confidence: number;
    sparkline: number[];
  };
  kpis: KPIData[];
  tips: Tip[];
  achievements: Achievement[];
}

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        className="opacity-70"
      />
    </svg>
  );
};

const KPICard = ({ 
  kpi, 
  isExpanded, 
  onToggle 
}: { 
  kpi: KPIData; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(kpi.value);
    }, 100);
    return () => clearTimeout(timer);
  }, [kpi.value]);

  const formatValue = (value: number) => {
    if (kpi.label === "Savings Rate") return `${value.toFixed(1)}%`;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const changeColor = kpi.change >= 0 ? "text-success" : "text-danger";
  const changeSign = kpi.change >= 0 ? "+" : "";

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Card 
        className="cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`View details for ${kpi.label}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md bg-${kpi.color}/10`}>
                <kpi.icon className={`w-4 h-4 text-${kpi.color}`} />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </div>
            <Badge variant="secondary" className={`${changeColor} text-xs`}>
              {changeSign}{kpi.change.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold font-heading"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {formatValue(animatedValue)}
              </motion.span>
            </motion.div>
            <Sparkline data={kpi.sparkline} color={`var(--color-chart-1)`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TipsCarousel = ({ tips }: { tips: Tip[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 4000);
  }, [tips.length]);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return stopAutoplay;
  }, [isPlaying, startAutoplay, stopAutoplay]);

  const handleTipAction = (tip: Tip) => {
    toast.success(`Applied: ${tip.title}`, {
      description: "We'll help you implement this suggestion."
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 5000);
  };

  if (tips.length === 0) return null;

  return (
    <Card 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-primary" />
          Quick Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-24 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <div className="space-y-2">
                <h4 className="font-semibold">{tips[currentIndex].title}</h4>
                <p className="text-sm text-muted-foreground">
                  {tips[currentIndex].description}
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleTipAction(tips[currentIndex])}
                  className="mt-2"
                >
                  {tips[currentIndex].actionLabel}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1">
            {tips.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
                aria-label={`Go to tip ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementsBanner = ({ achievements }: { achievements: Achievement[] }) => {
  const [confettiCanvas, setConfettiCanvas] = useState<HTMLCanvasElement | null>(null);
  const unclaimedAchievements = achievements.filter(a => !a.claimed);

  const triggerConfetti = useCallback(() => {
    if (!confettiCanvas) return;
    
    const ctx = confettiCanvas.getContext('2d');
    if (!ctx) return;

    // Simple confetti animation
    const particles: Array<{x: number, y: number, vx: number, vy: number, color: string}> = [];
    const colors = ['#2ed3b7', '#f0b289', '#22c55e', '#64d7c2'];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: confettiCanvas.width / 2,
        y: confettiCanvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -8 - 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3; // gravity
        
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, 4, 4);
      });
      
      if (particles.some(p => p.y < confettiCanvas.height)) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [confettiCanvas]);

  const claimAchievement = (achievement: Achievement) => {
    toast.success(`Achievement Unlocked: ${achievement.title}!`, {
      description: achievement.description
    });
    triggerConfetti();
  };

  if (unclaimedAchievements.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-primary">New Achievements!</h3>
            <p className="text-sm text-muted-foreground">
              You've earned {unclaimedAchievements.length} new badge{unclaimedAchievements.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {unclaimedAchievements.slice(0, 3).map((achievement) => (
              <Button
                key={achievement.id}
                size="sm"
                onClick={() => claimAchievement(achievement)}
                className="relative"
              >
                <span className="mr-2">{achievement.badge}</span>
                Claim
              </Button>
            ))}
          </div>
        </div>
        <canvas
          ref={setConfettiCanvas}
          className="absolute inset-0 pointer-events-none"
          width={400}
          height={200}
          style={{ zIndex: 10 }}
        />
      </CardContent>
    </Card>
  );
};

export default function DashboardOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedKPI, setExpandedKPI] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: OverviewData = {
        user: { firstName: "Alex" },
        aiSummary: {
          text: "Your spending is down 12% this month, and you're on track to exceed your savings goal by $340.",
          confidence: 85,
          sparkline: [120, 135, 128, 142, 155, 148, 162, 158, 145, 152]
        },
        kpis: [
          {
            id: "balance",
            label: "Current Balance",
            value: 12450,
            change: 3.2,
            sparkline: [11800, 11950, 12100, 12300, 12450],
            icon: CreditCard,
            color: "primary"
          },
          {
            id: "income",
            label: "Monthly Income",
            value: 4800,
            change: 2.1,
            sparkline: [4600, 4650, 4700, 4750, 4800],
            icon: ChartColumnBig,
            color: "success"
          },
          {
            id: "expenses",
            label: "Monthly Expenses",
            value: 3200,
            change: -5.3,
            sparkline: [3400, 3350, 3300, 3250, 3200],
            icon: ChartNoAxesCombined,
            color: "danger"
          },
          {
            id: "savings",
            label: "Savings Rate",
            value: 33.3,
            change: 8.7,
            sparkline: [28, 29, 31, 32, 33.3],
            icon: LayoutDashboard,
            color: "accent"
          }
        ],
        tips: [
          {
            id: "1",
            title: "Review your subscriptions",
            description: "You have 3 unused subscriptions costing $47/month",
            actionLabel: "Review Now"
          },
          {
            id: "2",
            title: "Set up automatic savings",
            description: "Save an extra $200/month with automatic transfers",
            actionLabel: "Set Up"
          },
          {
            id: "3",
            title: "Track grocery spending",
            description: "Your grocery spending increased 15% this month",
            actionLabel: "Track"
          }
        ],
        achievements: [
          {
            id: "1",
            title: "Savings Streak",
            description: "Saved money for 30 days straight",
            badge: "🏆",
            claimed: false
          },
          {
            id: "2",
            title: "Budget Master",
            description: "Stayed under budget for 3 months",
            badge: "💪",
            claimed: false
          }
        ]
      };
      
      setData(mockData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleKPIToggle = (kpiId: string) => {
    setExpandedKPI(expandedKPI === kpiId ? null : kpiId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-danger/20 bg-danger/5">
        <CardContent className="p-6 text-center">
          <p className="text-danger mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Greeting + AI Summary */}
      <div className="space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold font-heading"
        >
          Good morning, {data.user.firstName}! 👋
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointer2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Insights</span>
                    <Badge variant="secondary" className="text-xs">
                      {data.aiSummary.confidence}% confident
                    </Badge>
                  </div>
                  <p className="text-foreground leading-relaxed" aria-live="polite">
                    {data.aiSummary.text}
                  </p>
                </div>
                <div className="ml-4">
                  <Sparkline 
                    data={data.aiSummary.sparkline} 
                    color="var(--color-primary)" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* KPI Cards */}
      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {data.kpis.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <KPICard
                kpi={kpi}
                isExpanded={expandedKPI === kpi.id}
                onToggle={() => handleKPIToggle(kpi.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* KPI Drill-down Panel */}
        <AnimatePresence>
          {expandedKPI && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {data.kpis.find(k => k.id === expandedKPI)?.label} Details
                      </h3>
                      <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Detailed chart would go here</p>
                      </div>
                    </div>
                    <Button variant="outline" className="ml-4">
                      <PanelTopOpen className="w-4 h-4 mr-2" />
                      View Detailed Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tips Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TipsCarousel tips={data.tips} />
      </motion.div>

      {/* Achievements Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AchievementsBanner achievements={data.achievements} />
      </motion.div>
    </div>
  );
}