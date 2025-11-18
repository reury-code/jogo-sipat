import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import Game from "./pages/Game";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Game} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <SettingsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
