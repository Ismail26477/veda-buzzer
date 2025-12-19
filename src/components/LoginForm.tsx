import { useState } from "react";
import { Building2, Lock, User, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type UserRole = "admin" | "employee";

interface LoginFormProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  isLoading?: boolean;
}

export function LoginForm({ onLogin, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, role);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Role selector */}
      <div className="flex gap-3 mb-8">
        <button
          type="button"
          onClick={() => setRole("admin")}
          className={cn(
            "flex-1 p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
            role === "admin"
              ? "border-primary bg-primary/10 shadow-glow-primary"
              : "border-border bg-secondary/30 hover:bg-secondary/50"
          )}
        >
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            role === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          )}>
            <Building2 className="h-6 w-6" />
          </div>
          <span className={cn(
            "font-semibold",
            role === "admin" ? "text-primary" : "text-muted-foreground"
          )}>
            Admin
          </span>
        </button>

        <button
          type="button"
          onClick={() => setRole("employee")}
          className={cn(
            "flex-1 p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
            role === "employee"
              ? "border-primary bg-primary/10 shadow-glow-primary"
              : "border-border bg-secondary/30 hover:bg-secondary/50"
          )}
        >
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            role === "employee" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          )}>
            <User className="h-6 w-6" />
          </div>
          <span className={cn(
            "font-semibold",
            role === "employee" ? "text-primary" : "text-muted-foreground"
          )}>
            Employee
          </span>
        </button>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pl-12 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          size="xl"
          className="w-full mt-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      {/* Demo hint */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Demo: Use any email/password to login
      </p>
    </div>
  );
}
