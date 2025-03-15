
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 animate-pulse">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>
      
      <h1 className="text-4xl font-bold mb-3">404</h1>
      <p className="text-xl text-muted-foreground mb-6 max-w-md">
        Oops! The page you're looking for doesn't exist.
      </p>
      
      <Button asChild className="animate-bounce">
        <a href="/">Return to Home</a>
      </Button>
    </div>
  );
};

export default NotFound;
