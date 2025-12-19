import { useState, useEffect } from "react";
import { Bell, LogOut, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuzzerAlert } from "@/components/BuzzerAlert";

interface EmployeeViewProps {
  employeeName: string;
  onLogout: () => void;
}

export function EmployeeView({ employeeName, onLogout }: EmployeeViewProps) {
  const [isBuzzerActive, setIsBuzzerActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simulate receiving a buzz (for demo purposes, triggered by clicking the test button)
  const simulateBuzz = () => {
    setIsBuzzerActive(true);
  };

  const handleAcknowledge = () => {
    setIsBuzzerActive(false);
  };

  return (
    <div className="min-h-screen bg-background safe-area-inset flex flex-col">
      {/* Header */}
      <header className="glass-card rounded-none border-t-0 border-x-0">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-foreground">Veda Office</h1>
                <p className="text-xs text-muted-foreground">Welcome, {employeeName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-8 flex flex-col items-center justify-center">
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          {/* Status indicator */}
          <div className="relative mx-auto">
            <div className="h-32 w-32 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <div className="h-24 w-24 rounded-full bg-success/20 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full status-online" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="pulse-ring h-32 w-32 bg-success/20" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground">
              You're Online
            </h2>
            <p className="text-muted-foreground">
              You'll be notified when Admin calls you
            </p>
          </div>

          {/* Sound status */}
          <div className="glass-card p-4 inline-flex items-center gap-3">
            {soundEnabled ? (
              <>
                <Volume2 className="h-5 w-5 text-success" />
                <span className="text-sm text-foreground">Sound alerts enabled</span>
              </>
            ) : (
              <>
                <VolumeX className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sound alerts disabled</span>
              </>
            )}
          </div>

          {/* Demo button */}
          <div className="pt-8">
            <Button
              variant="outline"
              onClick={simulateBuzz}
              className="text-sm"
            >
              <Bell className="h-4 w-4" />
              Test Buzzer Alert
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Click to simulate receiving a buzz
            </p>
          </div>
        </div>
      </main>

      {/* Buzzer Alert */}
      <BuzzerAlert
        isOpen={isBuzzerActive}
        adminName="Admin"
        onAcknowledge={handleAcknowledge}
      />
    </div>
  );
}
