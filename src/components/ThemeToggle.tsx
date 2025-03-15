
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
    
    // Check for preferred color scheme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full transition-all duration-300",
        "bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/50",
        "dark:bg-muted dark:hover:bg-muted/80 dark:focus:ring-primary/50",
        className
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={cn(
            "absolute inset-0 transition-all duration-300 transform",
            theme === "light"
              ? "opacity-100 rotate-0"
              : "opacity-0 -rotate-90 scale-75"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 transition-all duration-300 transform",
            theme === "dark"
              ? "opacity-100 rotate-0"
              : "opacity-0 rotate-90 scale-75"
          )}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
