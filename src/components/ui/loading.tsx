"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// TypeScript interfaces
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

interface LoadingSkeletonProps {
  variant?: "card" | "table-row" | "text" | "avatar" | "button";
  className?: string;
  lines?: number;
  width?: string;
  height?: string;
}

interface PageLoaderProps {
  progress?: number;
  message?: string;
  showBranding?: boolean;
}

interface LoadingStatesProps {
  variant?: "button" | "content" | "overlay";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

// LoadingSpinner Component
export const LoadingSpinner = ({ 
  size = "md", 
  className, 
  label 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={cn(sizeClasses[size])}
      >
        <Loader2 className={cn("text-primary", sizeClasses[size])} />
      </motion.div>
      {label && (
        <span className={cn("text-muted-foreground", textSizes[size])}>
          {label}
        </span>
      )}
    </div>
  );
};

// LoadingSkeleton Component
export const LoadingSkeleton = ({ 
  variant = "text", 
  className,
  lines = 1,
  width,
  height
}: LoadingSkeletonProps) => {
  const shimmerAnimation = {
    initial: { x: "-100%" },
    animate: { x: "100%" },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const baseClasses = "relative overflow-hidden bg-muted rounded-md";
  
  const variantClasses = {
    card: "h-32 w-full rounded-lg",
    "table-row": "h-12 w-full rounded-sm",
    text: "h-4 w-full rounded-sm",
    avatar: "h-10 w-10 rounded-full",
    button: "h-9 w-20 rounded-md"
  };

  const skeletonStyle = {
    width: width || "100%",
    height: height || undefined
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, variantClasses.text)}
            style={{
              ...skeletonStyle,
              width: index === lines - 1 ? "75%" : "100%"
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent"
              {...shimmerAnimation}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={skeletonStyle}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent"
        {...shimmerAnimation}
      />
    </div>
  );
};

// PageLoader Component
export const PageLoader = ({ 
  progress = 0, 
  message = "Loading...", 
  showBranding = true 
}: PageLoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center space-y-8 max-w-md mx-auto px-6">
        {showBranding && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
              </div>
              <h1 className="text-2xl font-heading font-bold">FinanceFlow</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Your personal finance dashboard
            </p>
          </motion.div>
        )}

        <div className="w-full space-y-4">
          <LoadingSpinner size="lg" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{message}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex space-x-1"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// LoadingStates Component
export const LoadingStates = ({ 
  variant = "content", 
  size = "md", 
  children, 
  loading = false, 
  className 
}: LoadingStatesProps) => {
  if (variant === "button") {
    return (
      <div className={cn("relative", className)}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
            <LoadingSpinner size={size} />
          </div>
        )}
        <div className={loading ? "opacity-50 pointer-events-none" : ""}>
          {children}
        </div>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className={cn("relative", className)}>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
          >
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <LoadingSpinner size={size} label="Loading..." />
            </div>
          </motion.div>
        )}
        {children}
      </div>
    );
  }

  // Content variant
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="text" lines={3} />
        <div className="flex space-x-2">
          <LoadingSkeleton variant="button" />
          <LoadingSkeleton variant="button" />
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

// Export all components
export default {
  LoadingSpinner,
  LoadingSkeleton,
  PageLoader,
  LoadingStates
};