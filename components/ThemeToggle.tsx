"use client";

/* Hallmark · ThemeToggle · states: default/hover/focus/active/disabled/loading/error/success */
import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Moon,
  Sun,
} from "lucide-react";
import { useSyncExternalStore } from "react";

export type ThemeToggleState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error"
  | "success";

interface ThemeToggleProps {
  previewState?: ThemeToggleState;
}

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "portfolio-theme";
const THEME_EVENT = "portfolio-theme-change";

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeToggle({ previewState = "default" }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const isPreview = previewState !== "default";
  const isDisabled = previewState === "disabled" || previewState === "loading";
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  const icon = (() => {
    if (previewState === "loading") {
      return <LoaderCircle className="theme-toggle-spinner" aria-hidden="true" />;
    }

    if (previewState === "error") {
      return <CircleAlert aria-hidden="true" />;
    }

    if (previewState === "success") {
      return <CircleCheck aria-hidden="true" />;
    }

    return theme === "dark" ? (
      <Moon aria-hidden="true" />
    ) : (
      <Sun aria-hidden="true" />
    );
  })();

  return (
    <button
      className="theme-toggle"
      type="button"
      data-state={previewState}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      title={`Switch to ${nextTheme} mode`}
      onClick={isPreview ? undefined : () => setTheme(nextTheme)}
    >
      <span className="theme-toggle-lens" aria-hidden="true" />
      <span className="theme-toggle-icon">{icon}</span>
    </button>
  );
}
