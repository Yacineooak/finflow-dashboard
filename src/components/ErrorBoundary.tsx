"use client";

import React, { Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Send, 
  ChevronDown, 
  ChevronUp,
  Wifi,
  Code,
  Server,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  isReporting: boolean;
  showDetails: boolean;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  isDevelopment?: boolean;
}

interface ErrorType {
  type: 'network' | 'rendering' | 'chunk' | 'runtime' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  icon: ReactNode;
  color: string;
}

const getErrorType = (error: Error): ErrorType => {
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';

  if (message.includes('fetch') || message.includes('network') || message.includes('load')) {
    return {
      type: 'network',
      severity: 'medium',
      description: 'Network or resource loading error',
      icon: <Wifi className="h-4 w-4" />,
      color: 'text-warning'
    };
  }

  if (message.includes('chunk') || message.includes('loading css chunk')) {
    return {
      type: 'chunk',
      severity: 'high',
      description: 'Code splitting or chunk loading error',
      icon: <Database className="h-4 w-4" />,
      color: 'text-destructive'
    };
  }

  if (stack.includes('render') || message.includes('render')) {
    return {
      type: 'rendering',
      severity: 'high',
      description: 'Component rendering error',
      icon: <Code className="h-4 w-4" />,
      color: 'text-destructive'
    };
  }

  if (message.includes('server') || message.includes('500') || message.includes('503')) {
    return {
      type: 'runtime',
      severity: 'critical',
      description: 'Server or runtime error',
      icon: <Server className="h-4 w-4" />,
      color: 'text-danger'
    };
  }

  return {
    type: 'unknown',
    severity: 'medium',
    description: 'Unknown application error',
    icon: <Bug className="h-4 w-4" />,
    color: 'text-muted-foreground'
  };
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      isReporting: false,
      showDetails: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (this.props.isDevelopment) {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  componentWillUnmount() {
    // Clean up any pending timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      toast.error(`Maximum retry attempts (${maxRetries}) reached. Please refresh the page.`);
      return;
    }

    toast.loading('Retrying...', { id: 'error-retry' });

    // Add progressive delay for retries
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    
    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
        retryCount: retryCount + 1
      });
      
      toast.success('Retrying application...', { id: 'error-retry' });
    }, delay);

    this.retryTimeouts.push(timeout);
  };

  handleGoToDashboard = () => {
    // In a real app, you would use Next.js router
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  handleReportIssue = async () => {
    this.setState({ isReporting: true });
    
    const { error, errorInfo, errorId } = this.state;
    
    try {
      // Mock API call for error reporting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const errorReport = {
        errorId,
        message: error?.message,
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      // In a real app, send to your error reporting service
      console.log('Error Report Sent:', errorReport);
      
      toast.success('Error report sent successfully. Our team will investigate this issue.');
    } catch (reportError) {
      toast.error('Failed to send error report. Please try again later.');
    } finally {
      this.setState({ isReporting: false });
    }
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    const { hasError, error, errorInfo, errorId, isReporting, showDetails, retryCount } = this.state;
    const { children, fallback, maxRetries = 3, isDevelopment = false } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo!, this.handleRetry);
      }

      const errorType = getErrorType(error);
      const canRetry = retryCount < maxRetries;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-2xl"
            >
              <Card className="border-destructive/20 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 p-3 rounded-full bg-destructive/10 w-fit"
                  >
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </motion.div>
                  
                  <CardTitle className="text-2xl font-heading text-foreground mb-2">
                    Oops! Something went wrong
                  </CardTitle>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="outline" className={`${errorType.color} border-current/20`}>
                      {errorType.icon}
                      <span className="ml-1 capitalize">{errorType.type}</span>
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground">
                      {errorType.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground">
                    {errorType.description}. We've been notified and are working on a fix.
                  </p>
                  
                  <div className="text-xs text-muted-foreground font-mono mt-2">
                    Error ID: {errorId}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    {canRetry && (
                      <Button
                        onClick={this.handleRetry}
                        className="flex-1 bg-primary hover:bg-primary/90"
                        disabled={isReporting}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
                      </Button>
                    )}
                    
                    <Button
                      onClick={this.handleGoToDashboard}
                      variant="outline"
                      className="flex-1"
                      disabled={isReporting}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </motion.div>

                  {/* Report Issue Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={this.handleReportIssue}
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-foreground"
                      disabled={isReporting}
                    >
                      {isReporting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </motion.div>
                          Sending Report...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Report This Issue
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Error Details (Development Mode) */}
                  {isDevelopment && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Collapsible open={showDetails} onOpenChange={this.toggleDetails}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between text-muted-foreground hover:text-foreground"
                          >
                            <span className="flex items-center">
                              <Bug className="h-4 w-4 mr-2" />
                              Error Details (Development)
                            </span>
                            {showDetails ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-4">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <div className="p-4 bg-muted/50 rounded-lg border">
                              <h4 className="font-medium text-sm mb-2 text-foreground">Error Message:</h4>
                              <code className="text-xs text-destructive font-mono block whitespace-pre-wrap">
                                {error.message}
                              </code>
                            </div>
                            
                            {error.stack && (
                              <div className="p-4 bg-muted/50 rounded-lg border">
                                <h4 className="font-medium text-sm mb-2 text-foreground">Stack Trace:</h4>
                                <code className="text-xs text-muted-foreground font-mono block whitespace-pre-wrap max-h-40 overflow-y-auto">
                                  {error.stack}
                                </code>
                              </div>
                            )}
                            
                            {errorInfo?.componentStack && (
                              <div className="p-4 bg-muted/50 rounded-lg border">
                                <h4 className="font-medium text-sm mb-2 text-foreground">Component Stack:</h4>
                                <code className="text-xs text-muted-foreground font-mono block whitespace-pre-wrap max-h-40 overflow-y-auto">
                                  {errorInfo.componentStack}
                                </code>
                              </div>
                            )}
                          </motion.div>
                        </CollapsibleContent>
                      </Collapsible>
                    </motion.div>
                  )}

                  {/* Retry Warning */}
                  {!canRetry && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="p-4 bg-warning/10 border border-warning/20 rounded-lg"
                    >
                      <div className="flex items-center text-warning text-sm">
                        <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          Maximum retry attempts reached. Please refresh the page or contact support if the issue persists.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;