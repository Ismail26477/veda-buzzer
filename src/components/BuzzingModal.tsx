import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Employee } from "./EmployeeCard";
import { Button } from "@/components/ui/button";

interface BuzzingModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
}

export function BuzzingModal({ isOpen, employee, onClose }: BuzzingModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative z-10 glass-card-elevated p-8 max-w-sm mx-4 text-center animate-scale-in">
        {/* Animated bell */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center buzzer-pulse">
              <Bell className="h-10 w-10 text-accent shake" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Buzzing {employee.name}...
        </h3>
        <p className="text-muted-foreground mb-6">
          Sending alert to their device
        </p>

        {/* Loading indicator */}
        <div className="flex items-center justify-center gap-2 text-primary mb-6">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Waiting for response</span>
        </div>

        {/* Cancel button */}
        <Button variant="outline" onClick={onClose} className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
}
