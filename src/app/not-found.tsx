"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Home, 
  ArrowLeft, 
  BarChart3, 
  CreditCard, 
  Target, 
  Settings, 
  FileText, 
  Users, 
  Compass,
  TrendingUp,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    { href: "/", icon: Home, label: "Dashboard", description: "View your financial overview" },
    { href: "/transactions", icon: CreditCard, label: "Transactions", description: "Manage your transactions" },
    { href: "/analytics", icon: BarChart3, label: "Analytics", description: "View detailed reports" },
    { href: "/goals", icon: Target, label: "Goals", description: "Track financial goals" },
    { href: "/budgets", icon: Wallet, label: "Budgets", description: "Manage your budgets" },
    { href: "/reports", icon: FileText, label: "Reports", description: "Generate financial reports" },
  ];

  const suggestions = [
    "Check your transaction history",
    "Review your monthly budget",
    "Set up a new financial goal",
    "View analytics dashboard",
    "Export financial reports",
    "Update account settings"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would trigger a search
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main 404 Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-heading font-bold text-foreground">
                FinanceFlow
              </span>
            </div>
          </motion.div>

          {/* 404 Error Display */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="mb-8"
          >
            <div className="text-8xl md:text-9xl font-heading font-bold text-primary mb-4">
              404
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oops! It looks like the page you're looking for doesn't exist. 
              Don't worry, we'll help you get back on track with your finances.
            </p>
          </motion.div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  Search for what you need
                </h2>
              </div>
              <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                  placeholder="Search transactions, goals, budgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-xl font-heading font-semibold text-foreground mb-6 text-center">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={link.href}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <link.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground mb-1">
                            {link.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Suggestions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  Popular Actions
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {suggestion}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-border hover:bg-muted gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team or visit our{" "}
            <Link href="/help" className="text-primary hover:underline">
              help center
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}