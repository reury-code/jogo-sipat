import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { GameSettings, DEFAULT_SETTINGS } from "@/types/settings";

interface SettingsContextType {
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const STORAGE_KEY = "game-settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => {
    // Carregar configurações do localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Salvar no localStorage sempre que as configurações mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
