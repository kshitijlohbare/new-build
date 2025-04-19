import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const AppNavbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-moody-primary/10 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-happy-monkey text-xl font-bold text-moody-primary dark:text-moody-secondary">Wellbeing</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link to="/practices" className="font-happy-monkey lowercase">Practices</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/progress" className="font-happy-monkey lowercase">Progress</Link>
            </Button>
            <Button asChild variant="outline" className="border-moody-primary text-moody-primary dark:border-moody-secondary dark:text-moody-secondary">
              <Link to="/meditation" className="font-happy-monkey lowercase">Meditate</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-moody-secondary" />
              ) : (
                <Moon className="h-5 w-5 text-moody-primary" />
              )}
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;