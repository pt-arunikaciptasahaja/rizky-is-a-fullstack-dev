"use client";

/* Hallmark · AnimatedWelcome · states: default/hover/focus/active/disabled/loading/error/success */
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleAlert,
  CircleCheck,
  CirclePause,
  CirclePlay,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { welcomeGreetings } from "@/data/portfolioData";

export type AnimatedWelcomeState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error"
  | "success";

interface AnimatedWelcomeProps {
  previewState?: AnimatedWelcomeState;
}

const HOLD_DURATION_MS = 2_600;
const WORD_TRANSITION_SECONDS = 0.22;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export function AnimatedWelcome({
  previewState = "default",
}: AnimatedWelcomeProps) {
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPreview = previewState !== "default";
  const isDisabled =
    previewState === "disabled" || previewState === "loading";
  const shouldPause =
    Boolean(reduceMotion) || isPreview || isHovering || isPaused || isDisabled;
  const greeting = welcomeGreetings[greetingIndex];

  useEffect(() => {
    if (shouldPause) return;

    const timer = window.setTimeout(() => {
      setGreetingIndex((current) => (current + 1) % welcomeGreetings.length);
    }, HOLD_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [greetingIndex, shouldPause]);

  const controlIcon = (() => {
    if (previewState === "loading") {
      return <LoaderCircle className="animated-welcome-spinner" aria-hidden="true" />;
    }

    if (previewState === "error") {
      return <CircleAlert aria-hidden="true" />;
    }

    if (previewState === "success") {
      return <CircleCheck aria-hidden="true" />;
    }

    return isPaused ? (
      <CirclePlay aria-hidden="true" />
    ) : (
      <CirclePause aria-hidden="true" />
    );
  })();

  return (
    <div
      className="animated-welcome"
      data-state={previewState}
      data-reduced-motion={reduceMotion ? "true" : "false"}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setIsHovering(true)}
      onBlurCapture={() => setIsHovering(false)}
    >
      <span className="animated-welcome-viewport" aria-live="off">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            className="animated-welcome-word"
            key={greeting.language}
            lang={greeting.language}
            dir={greeting.direction}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
            transition={{
              duration: reduceMotion ? 0.1 : WORD_TRANSITION_SECONDS,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {greeting.text}
          </motion.span>
        </AnimatePresence>
      </span>

      <button
        className="animated-welcome-control"
        type="button"
        data-state={previewState}
        aria-label={isPaused ? "Resume welcome animation" : "Pause welcome animation"}
        aria-pressed={isPaused}
        disabled={isDisabled}
        tabIndex={reduceMotion ? -1 : undefined}
        onClick={isPreview || reduceMotion ? undefined : () => setIsPaused((paused) => !paused)}
      >
        {controlIcon}
      </button>
    </div>
  );
}
