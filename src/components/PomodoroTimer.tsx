
import React, { useState, useEffect, useRef } from "react";
import { PomodoroSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings, Play, Pause, SkipForward, TimerReset } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PomodoroTimerProps {
  onComplete?: () => void;
  className?: string;
}

enum TimerMode {
  WORK = "work",
  BREAK = "break",
  LONG_BREAK = "longBreak",
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete, className }) => {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>(TimerMode.WORK);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Effect to handle timer ticking
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Effect to update timeLeft when settings change
  useEffect(() => {
    if (!isRunning) {
      if (mode === TimerMode.WORK) {
        setTimeLeft(settings.workDuration * 60);
      } else if (mode === TimerMode.BREAK) {
        setTimeLeft(settings.breakDuration * 60);
      } else {
        setTimeLeft(settings.longBreakDuration * 60);
      }
    }
  }, [settings, mode, isRunning]);

  // Effect to handle browser tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        const now = new Date().getTime();
        const elapsedSeconds = Math.floor((now - (lastTick.current || now)) / 1000);
        
        if (elapsedSeconds > 1) {
          setTimeLeft((prevTime) => {
            const newTime = Math.max(0, prevTime - elapsedSeconds);
            if (newTime === 0) {
              handleTimerComplete();
            }
            return newTime;
          });
        }
        lastTick.current = now;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);

  const lastTick = useRef<number>(new Date().getTime());

  const handleTimerComplete = () => {
    setIsRunning(false);
    clearInterval(timerRef.current!);
    
    if (mode === TimerMode.WORK) {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      // Check if it's time for a long break
      const nextMode = newCompletedPomodoros % settings.longBreakInterval === 0 
        ? TimerMode.LONG_BREAK 
        : TimerMode.BREAK;
      
      setMode(nextMode);
      
      // Auto start break if enabled
      if (settings.autoStartBreaks) {
        const nextDuration = nextMode === TimerMode.LONG_BREAK 
          ? settings.longBreakDuration * 60 
          : settings.breakDuration * 60;
        setTimeLeft(nextDuration);
        setIsRunning(true);
      } else {
        setTimeLeft(nextMode === TimerMode.LONG_BREAK 
          ? settings.longBreakDuration * 60 
          : settings.breakDuration * 60);
      }
      
      // Show notification
      toast({
        title: "Pomodoro completed!",
        description: "Time for a break.",
      });
      
      // Invoke onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
      
    } else {
      // Break is over, back to work
      setMode(TimerMode.WORK);
      
      // Auto start work if enabled
      if (settings.autoStartPomodoros) {
        setTimeLeft(settings.workDuration * 60);
        setIsRunning(true);
      } else {
        setTimeLeft(settings.workDuration * 60);
      }
      
      // Show notification
      toast({
        title: mode === TimerMode.BREAK ? "Break completed!" : "Long break completed!",
        description: "Time to get back to work.",
      });
    }
  };
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
    lastTick.current = new Date().getTime();
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (mode === TimerMode.WORK) {
      setTimeLeft(settings.workDuration * 60);
    } else if (mode === TimerMode.BREAK) {
      setTimeLeft(settings.breakDuration * 60);
    } else {
      setTimeLeft(settings.longBreakDuration * 60);
    }
  };
  
  const skipToNext = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (mode === TimerMode.WORK) {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      // Check if it's time for a long break
      const nextMode = newCompletedPomodoros % settings.longBreakInterval === 0 
        ? TimerMode.LONG_BREAK 
        : TimerMode.BREAK;
      
      setMode(nextMode);
      setTimeLeft(nextMode === TimerMode.LONG_BREAK 
        ? settings.longBreakDuration * 60 
        : settings.breakDuration * 60);
    } else {
      setMode(TimerMode.WORK);
      setTimeLeft(settings.workDuration * 60);
    }
  };
  
  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    setSettingsOpen(false);
  };
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // Initialize timer with the right duration based on current mode
        if (mode === TimerMode.WORK) {
          setTimeLeft(parsedSettings.workDuration * 60);
        } else if (mode === TimerMode.BREAK) {
          setTimeLeft(parsedSettings.breakDuration * 60);
        } else {
          setTimeLeft(parsedSettings.longBreakDuration * 60);
        }
      } catch (error) {
        console.error('Failed to parse Pomodoro settings:', error);
      }
    }
  }, []);

  // Calculate progress percentage
  const calculateProgress = (): number => {
    let totalSeconds;
    
    if (mode === TimerMode.WORK) {
      totalSeconds = settings.workDuration * 60;
    } else if (mode === TimerMode.BREAK) {
      totalSeconds = settings.breakDuration * 60;
    } else {
      totalSeconds = settings.longBreakDuration * 60;
    }
    
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Get color based on current mode
  const getModeColor = (): string => {
    if (mode === TimerMode.WORK) {
      return 'bg-red-500';
    } else if (mode === TimerMode.BREAK) {
      return 'bg-green-500';
    } else {
      return 'bg-blue-500';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Pomodoro Timer</CardTitle>
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Timer Settings</SheetTitle>
                <SheetDescription>
                  Adjust your pomodoro timer settings
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Work Duration: {settings.workDuration} minutes</h3>
                  <Slider
                    value={[settings.workDuration]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => 
                      setSettings({...settings, workDuration: value[0]})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Break Duration: {settings.breakDuration} minutes</h3>
                  <Slider
                    value={[settings.breakDuration]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(value) =>
                      setSettings({...settings, breakDuration: value[0]})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Long Break Duration: {settings.longBreakDuration} minutes</h3>
                  <Slider
                    value={[settings.longBreakDuration]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) =>
                      setSettings({...settings, longBreakDuration: value[0]})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Long Break Interval: Every {settings.longBreakInterval} pomodoros</h3>
                  <Slider
                    value={[settings.longBreakInterval]}
                    min={1}
                    max={8}
                    step={1}
                    onValueChange={(value) =>
                      setSettings({...settings, longBreakInterval: value[0]})
                    }
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoStartBreaks"
                    checked={settings.autoStartBreaks}
                    onChange={(e) =>
                      setSettings({...settings, autoStartBreaks: e.target.checked})
                    }
                  />
                  <label htmlFor="autoStartBreaks" className="text-sm">
                    Auto-start breaks
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoStartPomodoros"
                    checked={settings.autoStartPomodoros}
                    onChange={(e) =>
                      setSettings({...settings, autoStartPomodoros: e.target.checked})
                    }
                  />
                  <label htmlFor="autoStartPomodoros" className="text-sm">
                    Auto-start pomodoros
                  </label>
                </div>
                
                <Button
                  onClick={() => updateSettings(settings)}
                  className="w-full mt-4"
                >
                  Save Settings
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <CardDescription>
          {mode === TimerMode.WORK 
            ? "Focus on your work" 
            : mode === TimerMode.BREAK 
              ? "Take a short break" 
              : "Take a long break"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-col items-center">
          <div className="w-full h-2 bg-muted mb-4 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all", getModeColor())}
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          
          <div className="text-5xl font-mono font-bold mb-2">
            {formatTime(timeLeft)}
          </div>
          
          <div className="text-sm text-muted-foreground mb-4">
            {mode === TimerMode.WORK 
              ? `Pomodoro #${completedPomodoros + 1}` 
              : mode === TimerMode.BREAK 
                ? "Short Break" 
                : "Long Break"
            }
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTimer}
              aria-label={isRunning ? "Pause" : "Start"}
            >
              {isRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={resetTimer}
              aria-label="Reset"
            >
              <TimerReset className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={skipToNext}
              aria-label="Skip"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center pt-0">
        <div className="text-xs text-muted-foreground">
          {completedPomodoros} pomodoros completed
        </div>
      </CardFooter>
    </Card>
  );
};

export default PomodoroTimer;
