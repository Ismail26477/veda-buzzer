import { useEffect, useState } from "react";
import { Bell, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuzzerAlertProps {
  isOpen: boolean;
  adminName?: string;
  onAcknowledge: () => void;
}

export function BuzzerAlert({ isOpen, adminName = "Admin", onAcknowledge }: BuzzerAlertProps) {
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger vibration
      if (navigator.vibrate) {
        const vibratePattern = [200, 100, 200, 100, 200, 100, 400];
        navigator.vibrate(vibratePattern);
        setIsVibrating(true);

        // Repeat vibration pattern
        const interval = setInterval(() => {
          navigator.vibrate(vibratePattern);
        }, 2000);

        return () => {
          clearInterval(interval);
          navigator.vibrate(0);
          setIsVibrating(false);
        };
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop with pulse effect */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
      
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full border-2 border-accent/30 animate-ping" style={{ animationDuration: "1.5s" }} />
        <div className="absolute w-48 h-48 rounded-full border-2 border-accent/40 animate-ping" style={{ animationDuration: "1.2s" }} />
        <div className="absolute w-32 h-32 rounded-full border-2 border-accent/50 animate-ping" style={{ animationDuration: "0.9s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-8 max-w-sm mx-4 text-center animate-scale-in">
        {/* Buzzer icon */}
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-accent/20 flex items-center justify-center buzzer-pulse">
            <div className="h-24 w-24 rounded-full bg-accent/40 flex items-center justify-center">
              <Bell className={`h-12 w-12 text-accent ${isVibrating ? 'shake' : ''}`} />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Incoming Alert
          </h2>
          <p className="text-xl text-muted-foreground">
            <span className="text-primary font-semibold">{adminName}</span> is calling you to the office room
          </p>
        </div>

        {/* Action button */}
        <Button
          variant="default"
          size="xl"
          className="w-full max-w-xs"
          onClick={onAcknowledge}
        >
          <CheckCircle className="h-6 w-6" />
          Acknowledge
        </Button>
      </div>
    </div>
  );
}
