import { Phone, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type EmployeeStatus = "online" | "offline" | "busy";

export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  avatar?: string;
  status: EmployeeStatus;
}

interface EmployeeCardProps {
  employee: Employee;
  onBuzz: (employee: Employee) => void;
  index?: number;
}

const statusConfig = {
  online: {
    label: "Available",
    className: "status-online",
  },
  offline: {
    label: "Offline",
    className: "status-offline",
  },
  busy: {
    label: "Busy",
    className: "status-busy",
  },
};

export function EmployeeCard({ employee, onBuzz, index = 0 }: EmployeeCardProps) {
  const status = statusConfig[employee.status];
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleCall = () => {
    window.location.href = `tel:${employee.phone}`;
  };

  const handleBuzz = () => {
    onBuzz(employee);
  };

  return (
    <div
      className="glass-card p-5 animate-slide-up opacity-0"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar with status indicator */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5">
            <div className={cn("h-4 w-4 rounded-full border-2 border-card", status.className)} />
            {employee.status === "online" && (
              <div className="pulse-ring h-4 w-4 bg-success -top-0 -left-0" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground text-lg truncate">
            {employee.name}
          </h3>
          <p className="text-muted-foreground text-sm truncate">{employee.designation}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
              {employee.department}
            </span>
            <span className={cn("text-xs font-medium", 
              employee.status === "online" ? "text-success" : 
              employee.status === "busy" ? "text-accent" : "text-muted-foreground"
            )}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <Button
          variant="call"
          size="lg"
          className="flex-1"
          onClick={handleCall}
        >
          <Phone className="h-5 w-5" />
          Call
        </Button>
        <Button
          variant="buzzer"
          size="lg"
          className="flex-1"
          onClick={handleBuzz}
          disabled={employee.status === "offline"}
        >
          <Bell className="h-5 w-5" />
          Buzz
        </Button>
      </div>
    </div>
  );
}
