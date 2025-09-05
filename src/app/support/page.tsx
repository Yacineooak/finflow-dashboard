"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Users, 
  Video, 
  BookOpen, 
  Lightbulb, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ChevronDown,
  ChevronRight,
  Send,
  Star,
  Filter,
  Zap,
  Shield,
  CreditCard,
  TrendingUp,
  Settings,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const mockFAQs = [
  {
    id: "getting-started",
    category: "Getting Started",
    icon: Zap,
    questions: [
      {
        q: "How do I get started with FinanceFlow?",
        a: "Getting started is simple! After signing up, connect your first bank account through our secure Plaid integration. The onboarding wizard will guide you through setting up categories, goals, and preferences. Your dashboard will populate with data within minutes."
      },
      {
        q: "What information do I need to set up my account?",
        a: "You'll need your email, a secure password, and access to your bank account credentials. We recommend having your primary checking and savings account information ready for the initial setup."
      },
      {
        q: "How long does it take to see my financial data?",
        a: "Most accounts sync within 2-3 minutes. Some banks may take up to 24 hours for the initial sync. You'll receive an email notification once your accounts are fully connected and data is available."
      }
    ]
  },
  {
    id: "bank-connections",
    category: "Bank Connections",
    icon: Shield,
    questions: [
      {
        q: "How secure is my banking information?",
        a: "We use bank-level 256-bit SSL encryption and partner with Plaid, which is used by major financial institutions. We never store your banking credentials - only read-only access tokens. All data is encrypted at rest and in transit."
      },
      {
        q: "Which banks are supported?",
        a: "We support over 11,000 financial institutions across the US, Canada, and UK, including all major banks like Chase, Bank of America, Wells Fargo, and credit unions. If your bank isn't supported, you can manually upload statements."
      },
      {
        q: "Why won't my bank account connect?",
        a: "Common issues include temporary bank maintenance, changed passwords, or two-factor authentication requirements. Try updating your credentials, checking for bank notifications, or wait 30 minutes and retry. Contact support if the issue persists."
      }
    ]
  },
  {
    id: "analytics",
    category: "Charts & Analytics",
    icon: TrendingUp,
    questions: [
      {
        q: "How do I read the spending breakdown chart?",
        a: "The donut chart shows your spending by category as percentages of total spending. Hover over sections for exact amounts. The larger the section, the more you're spending in that category. Use this to identify your biggest expense areas."
      },
      {
        q: "What does the cash flow chart show?",
        a: "The cash flow chart displays your income (green bars) versus expenses (red bars) over time. The net line shows whether you're saving (positive) or overspending (negative) each month. This helps you spot spending trends."
      },
      {
        q: "Can I customize the date ranges for charts?",
        a: "Yes! All charts support custom date ranges. Use the date picker in the top-right of each chart section. You can view data from the last 7 days up to 2 years, depending on your account history."
      }
    ]
  },
  {
    id: "goals-budgets",
    category: "Goals & Budgets",
    icon: Settings,
    questions: [
      {
        q: "How do I set up a savings goal?",
        a: "Click 'Add Goal' in the Goals section. Choose 'Savings Goal', set your target amount and deadline. FinanceFlow will calculate how much you need to save monthly and track your progress automatically based on your account balances."
      },
      {
        q: "What's the difference between goals and budgets?",
        a: "Goals are targets you're working toward (like saving $5,000 for vacation). Budgets are spending limits for categories (like $500/month for groceries). Goals track progress over time, while budgets help control monthly spending."
      },
      {
        q: "Can I set up automatic transfers for goals?",
        a: "While we don't execute transfers directly, we can calculate optimal transfer amounts and remind you to make them. Many users set up automatic transfers with their bank based on our recommendations."
      }
    ]
  },
  {
    id: "privacy-security",
    category: "Privacy & Security",
    icon: Shield,
    questions: [
      {
        q: "Do you sell my financial data?",
        a: "Never. We don't sell, rent, or share your personal financial data with third parties for marketing purposes. Your data is used solely to provide you with personalized financial insights and improve our service."
      },
      {
        q: "How can I delete my account and data?",
        a: "Go to Settings > Privacy > Delete Account. This will permanently remove all your data from our servers within 30 days. You'll receive confirmation once deletion is complete. This action cannot be undone."
      },
      {
        q: "What happens if there's a data breach?",
        a: "We have incident response procedures in place. You'd be notified within 24 hours via email and in-app notification. We maintain cyber insurance and work with security firms to minimize risks and respond quickly to any issues."
      }
    ]
  },
  {
    id: "billing",
    category: "Billing & Subscriptions",
    icon: CreditCard,
    questions: [
      {
        q: "What's included in the free plan?",
        a: "The free plan includes up to 2 connected accounts, basic spending tracking, 3 months of transaction history, and standard support. Perfect for getting started with personal finance tracking."
      },
      {
        q: "How do I upgrade or cancel my subscription?",
        a: "Go to Settings > Billing to upgrade, downgrade, or cancel anytime. Changes take effect at your next billing cycle. If you cancel, you'll retain Pro features until your current billing period ends."
      },
      {
        q: "Do you offer refunds?",
        a: "We offer a 30-day money-back guarantee for new subscribers. If you're not satisfied, contact support within 30 days of your first payment for a full refund. Refunds are processed within 5-7 business days."
      }
    ]
  }
];

const mockSupportChannels = [
  {
    id: "live-chat",
    title: "Live Chat",
    description: "Chat with our support team",
    icon: MessageCircle,
    availability: "Mon-Fri 9AM-6PM EST",
    responseTime: "< 2 minutes",
    status: "online"
  },
  {
    id: "email",
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    availability: "24/7",
    responseTime: "< 4 hours",
    status: "online"
  },
  {
    id: "community",
    title: "Community Forum",
    description: "Get help from other users",
    icon: Users,
    availability: "24/7",
    responseTime: "Varies",
    status: "online"
  },
  {
    id: "tutorials",
    title: "Video Tutorials",
    description: "Step-by-step guides",
    icon: Video,
    availability: "24/7",
    responseTime: "Immediate",
    status: "online"
  }
];

const mockSystemStatus = [
  { service: "API", status: "operational", uptime: "99.9%" },
  { service: "Bank Sync", status: "operational", uptime: "99.8%" },
  { service: "Web App", status: "operational", uptime: "99.9%" },
  { service: "Mobile App", status: "maintenance", uptime: "99.7%" }
];

const mockQuickActions = [
  { title: "Reset Password", icon: Shield, action: "password-reset" },
  { title: "Update Bank Connection", icon: CreditCard, action: "bank-update" },
  { title: "Export Data", icon: ExternalLink, action: "export-data" },
  { title: "Contact Billing", icon: Mail, action: "billing-contact" }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredFAQs, setFilteredFAQs] = useState(mockFAQs);
  const [isLoading, setIsLoading] = useState(false);
  const [featureRequest, setFeatureRequest] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter FAQs based on search and category
  useEffect(() => {
    let filtered = mockFAQs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.id === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => 
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0);
    }

    setFilteredFAQs(filtered);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleQuickAction = (action: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${action.replace('-', ' ')} initiated successfully`);
    }, 1000);
  };

  const handleFeatureRequest = () => {
    if (!featureRequest.trim()) {
      toast.error("Please describe your feature request");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Feature request submitted! We'll review it and get back to you.");
      setFeatureRequest("");
    }, 1500);
  };

  const handleContactChannel = (channelId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (channelId === "live-chat") {
        toast.success("Connecting to live chat...");
      } else {
        toast.success(`Opening ${channelId.replace('-', ' ')}...`);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border"
      >
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-heading font-bold mb-4"
            >
              How can we help you?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Find answers, get support, and make the most of FinanceFlow
            </motion.p>

            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-background border-2 focus:border-primary"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Actions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-heading font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockQuickActions.map((action, index) => (
                  <motion.div
                    key={action.action}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleQuickAction(action.action)}
                      disabled={isLoading}
                      className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/10 transition-colors"
                    >
                      <action.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{action.title}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* FAQ Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-heading font-semibold mb-4 md:mb-0">
                  Frequently Asked Questions
                </h2>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {mockFAQs.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFAQs.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{category.category}</h3>
                      </div>
                      
                      <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems}>
                        {category.questions.map((faq, index) => (
                          <AccordionItem key={`${category.id}-${index}`} value={`${category.id}-${index}`}>
                            <AccordionTrigger className="text-left hover:text-primary transition-colors">
                              {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredFAQs.length === 0 && !isLoading && (
                <Card className="text-center py-12">
                  <CardContent>
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or browse all categories
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.section>

            {/* Feature Requests */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Submit a Feature Request
                  </CardTitle>
                  <CardDescription>
                    Have an idea to improve FinanceFlow? We'd love to hear it!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe your feature idea in detail..."
                    value={featureRequest}
                    onChange={(e) => setFeatureRequest(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <Button 
                    onClick={handleFeatureRequest} 
                    disabled={isLoading || !featureRequest.trim()}
                    className="w-full md:w-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Channels */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Get Support</CardTitle>
                  <CardDescription>Choose your preferred support channel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockSupportChannels.map((channel) => (
                    <motion.div
                      key={channel.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors"
                      onClick={() => handleContactChannel(channel.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <channel.icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-medium">{channel.title}</h4>
                          <Badge variant={channel.status === "online" ? "default" : "secondary"}>
                            {channel.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{channel.description}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{channel.availability}</span>
                        <span>{channel.responseTime}</span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>

            {/* System Status */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockSystemStatus.map((service) => (
                    <div key={service.service} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {service.status === "operational" ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : service.status === "maintenance" ? (
                          <Clock className="h-4 w-4 text-warning" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="font-medium">{service.service}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{service.uptime}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {service.status}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Status Page
                  </Button>
                </CardContent>
              </Card>
            </motion.section>

            {/* Resources */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Helpful Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Getting Started Guide", icon: BookOpen },
                    { title: "Video Tutorials", icon: Video },
                    { title: "Best Practices", icon: Star },
                    { title: "API Documentation", icon: ExternalLink }
                  ].map((resource) => (
                    <Button
                      key={resource.title}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => toast.success(`Opening ${resource.title}...`)}
                    >
                      <resource.icon className="h-4 w-4 mr-2" />
                      {resource.title}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}