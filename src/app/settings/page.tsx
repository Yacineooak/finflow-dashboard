"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  User,
  Mail,
  Globe,
  Palette,
  DollarSign,
  Calendar,
  Shield,
  Bell,
  Database,
  Upload,
  Save,
  X,
  Settings2,
  Lock,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Loader2,
  Camera,
  Languages,
  Moon,
  Sun,
  Sparkles
} from "lucide-react";

interface SettingsData {
  profile: {
    name: string;
    email: string;
    bio: string;
    avatar: string;
    timezone: string;
    language: string;
  };
  preferences: {
    theme: string;
    currency: string;
    dateFormat: string;
    defaultView: string;
  };
  privacy: {
    twoFactorEnabled: boolean;
    profileVisibility: string;
    dataSharing: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    spendingAlerts: boolean;
    goalMilestones: boolean;
    weeklyReports: boolean;
    marketingEmails: boolean;
  };
  dataSync: {
    autoSync: boolean;
    backupFrequency: string;
    dataRetention: string;
    connectedBanks: number;
  };
}

const themes = [
  { id: "light", name: "Light", description: "Clean and bright", icon: Sun, preview: "bg-slate-50 border-slate-200" },
  { id: "dark", name: "Dark", description: "Easy on the eyes", icon: Moon, preview: "bg-slate-900 border-slate-700" },
  { id: "fun", name: "Fun", description: "Colorful and playful", icon: Sparkles, preview: "bg-gradient-to-br from-purple-500 to-pink-500" }
];

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", example: "$1,234.56" },
  { code: "EUR", name: "Euro", symbol: "€", example: "€1.234,56" },
  { code: "GBP", name: "British Pound", symbol: "£", example: "£1,234.56" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", example: "¥123,456" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", example: "C$1,234.56" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", example: "A$1,234.56" },
];

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
];

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      bio: "Finance enthusiast and data lover. Always looking for ways to optimize my spending and reach my financial goals.",
      avatar: "",
      timezone: "America/New_York",
      language: "en"
    },
    preferences: {
      theme: "dark",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      defaultView: "overview"
    },
    privacy: {
      twoFactorEnabled: true,
      profileVisibility: "private",
      dataSharing: false
    },
    notifications: {
      email: true,
      push: true,
      spendingAlerts: true,
      goalMilestones: true,
      weeklyReports: false,
      marketingEmails: false
    },
    dataSync: {
      autoSync: true,
      backupFrequency: "daily",
      dataRetention: "2years",
      connectedBanks: 3
    }
  });

  const [originalSettings, setOriginalSettings] = useState<SettingsData>(settings);

  useEffect(() => {
    const hasChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(hasChanged);
  }, [settings, originalSettings]);

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOriginalSettings(settings);
      setHasChanges(false);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateSettings("profile", "avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = async () => {
    toast.info("Preparing data export...");
    // Simulate export process
    setTimeout(() => {
      toast.success("Data export ready! Check your email for download link.");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires additional verification. Contact support for assistance.");
  };

  const sections = [
    { id: "profile", name: "Profile", icon: User },
    { id: "preferences", name: "Preferences", icon: Settings2 },
    { id: "privacy", name: "Privacy & Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "data", name: "Data & Sync", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and app configuration</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 lg:shrink-0"
          >
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <section.icon className="w-4 h-4 shrink-0" />
                      <span className="font-medium">{section.name}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="wait">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal information and profile settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={settings.profile.avatar} />
                            <AvatarFallback className="text-lg">
                              {settings.profile.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Profile Picture</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            JPG, GIF or PNG. Max size 2MB.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload New
                          </Button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </div>

                      <Separator />

                      {/* Profile Fields */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={settings.profile.name}
                            onChange={(e) => updateSettings("profile", "name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => updateSettings("profile", "email", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us a bit about yourself..."
                          value={settings.profile.bio}
                          onChange={(e) => updateSettings("profile", "bio", e.target.value)}
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          {settings.profile.bio.length}/500 characters
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select
                            value={settings.profile.timezone}
                            onValueChange={(value) => updateSettings("profile", "timezone", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timezones.map((tz) => (
                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select
                            value={settings.profile.language}
                            onValueChange={(value) => updateSettings("profile", "language", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                  {lang.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* App Preferences */}
              {activeSection === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Theme Selection
                      </CardTitle>
                      <CardDescription>
                        Choose your preferred theme with live preview
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={settings.preferences.theme}
                        onValueChange={(value) => updateSettings("preferences", "theme", value)}
                        className="grid gap-4 sm:grid-cols-3"
                      >
                        {themes.map((theme) => (
                          <motion.div
                            key={theme.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Label
                              htmlFor={theme.id}
                              className={`cursor-pointer block p-4 rounded-lg border-2 transition-all ${
                                settings.preferences.theme === theme.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem value={theme.id} id={theme.id} className="sr-only" />
                              <div className="flex items-center gap-3 mb-3">
                                <theme.icon className="w-5 h-5" />
                                <span className="font-medium">{theme.name}</span>
                              </div>
                              <div className={`w-full h-16 rounded-md mb-2 ${theme.preview}`} />
                              <p className="text-sm text-muted-foreground">{theme.description}</p>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Currency & Formatting
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select
                          value={settings.preferences.currency}
                          onValueChange={(value) => updateSettings("preferences", "currency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{currency.symbol} {currency.name}</span>
                                  <span className="text-muted-foreground ml-4">{currency.example}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="dateFormat">Date Format</Label>
                          <Select
                            value={settings.preferences.dateFormat}
                            onValueChange={(value) => updateSettings("preferences", "dateFormat", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="defaultView">Default Dashboard View</Label>
                          <Select
                            value={settings.preferences.defaultView}
                            onValueChange={(value) => updateSettings("preferences", "defaultView", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="overview">Overview</SelectItem>
                              <SelectItem value="analytics">Analytics</SelectItem>
                              <SelectItem value="transactions">Transactions</SelectItem>
                              <SelectItem value="goals">Goals & Budgets</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Privacy & Security */}
              {activeSection === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            <span className="font-medium">Two-Factor Authentication</span>
                            {settings.privacy.twoFactorEnabled && (
                              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Enabled
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={settings.privacy.twoFactorEnabled}
                          onCheckedChange={(checked) => updateSettings("privacy", "twoFactorEnabled", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <Select
                          value={settings.privacy.profileVisibility}
                          onValueChange={(value) => updateSettings("privacy", "profileVisibility", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                Public - Anyone can see your profile
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <EyeOff className="w-4 h-4" />
                                Private - Only you can see your profile
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="font-medium">Data Sharing for Insights</span>
                          <p className="text-sm text-muted-foreground">
                            Help improve our services with anonymized data
                          </p>
                        </div>
                        <Switch
                          checked={settings.privacy.dataSharing}
                          onCheckedChange={(checked) => updateSettings("privacy", "dataSharing", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-warning">Data Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            <span className="font-medium">Export Your Data</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Download all your data in JSON format
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleExportData}>
                          Export Data
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4 text-destructive" />
                            <span className="font-medium text-destructive">Delete Account</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Notifications */}
              {activeSection === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Preferences
                      </CardTitle>
                      <CardDescription>
                        Choose what notifications you'd like to receive
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span className="font-medium">Email Notifications</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            checked={settings.notifications.email}
                            onCheckedChange={(checked) => updateSettings("notifications", "email", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4" />
                              <span className="font-medium">Push Notifications</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Receive push notifications on your devices
                            </p>
                          </div>
                          <Switch
                            checked={settings.notifications.push}
                            onCheckedChange={(checked) => updateSettings("notifications", "push", checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Specific Notifications</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-warning" />
                                <span className="font-medium">Spending Alerts</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Get notified when you exceed budget limits
                              </p>
                            </div>
                            <Switch
                              checked={settings.notifications.spendingAlerts}
                              onCheckedChange={(checked) => updateSettings("notifications", "spendingAlerts", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-success" />
                                <span className="font-medium">Goal Milestones</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Celebrate when you reach savings goals
                              </p>
                            </div>
                            <Switch
                              checked={settings.notifications.goalMilestones}
                              onCheckedChange={(checked) => updateSettings("notifications", "goalMilestones", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="font-medium">Weekly Reports</span>
                              <p className="text-sm text-muted-foreground">
                                Summary of your financial activity
                              </p>
                            </div>
                            <Switch
                              checked={settings.notifications.weeklyReports}
                              onCheckedChange={(checked) => updateSettings("notifications", "weeklyReports", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="font-medium">Marketing Emails</span>
                              <p className="text-sm text-muted-foreground">
                                Tips, features updates, and promotions
                              </p>
                            </div>
                            <Switch
                              checked={settings.notifications.marketingEmails}
                              onCheckedChange={(checked) => updateSettings("notifications", "marketingEmails", checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Data & Sync */}
              {activeSection === "data" && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Data Synchronization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="font-medium">Auto-Sync</span>
                          <p className="text-sm text-muted-foreground">
                            Automatically sync data across all devices
                          </p>
                        </div>
                        <Switch
                          checked={settings.dataSync.autoSync}
                          onCheckedChange={(checked) => updateSettings("dataSync", "autoSync", checked)}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Backup Frequency</Label>
                          <Select
                            value={settings.dataSync.backupFrequency}
                            onValueChange={(value) => updateSettings("dataSync", "backupFrequency", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dataRetention">Data Retention</Label>
                          <Select
                            value={settings.dataSync.dataRetention}
                            onValueChange={(value) => updateSettings("dataSync", "dataRetention", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1year">1 Year</SelectItem>
                              <SelectItem value="2years">2 Years</SelectItem>
                              <SelectItem value="5years">5 Years</SelectItem>
                              <SelectItem value="forever">Forever</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Connected Accounts</CardTitle>
                      <CardDescription>
                        Manage your connected bank accounts and financial institutions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="space-y-1">
                            <span className="font-medium">Connected Banks</span>
                            <p className="text-sm text-muted-foreground">
                              {settings.dataSync.connectedBanks} accounts connected
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              All Active
                            </Badge>
                            <Button variant="outline" size="sm">
                              Manage Connections
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save/Cancel Actions */}
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="sticky bottom-4 z-10"
                >
                  <Card className="shadow-lg border-2 border-primary/20">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                        <span className="font-medium">You have unsaved changes</span>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}