"use client";

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5
 * Hallmark · component: live context card · genre: modern-minimal · theme: Cobalt Light
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass · motion: reveal · value tick
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  ExternalLink,
  LoaderCircle,
  Snowflake,
  Sun,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

export type LiveContextState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error"
  | "success";

interface LiveContextCardProps {
  previewState?: LiveContextState;
}

type WeatherKind = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

interface WeatherData {
  temperature: number;
  condition: string;
  kind: WeatherKind;
}

type WeatherState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: WeatherData };

interface OverlapInfo {
  summary: string;
  jakartaWindow?: string;
  localWindow?: string;
}

const JAKARTA_TIME_ZONE = "Asia/Jakarta";
const WORKDAY_START = 9 * 60;
const WORKDAY_END = 18 * 60;
const MINUTES_PER_DAY = 24 * 60;
const minuteListeners = new Set<() => void>();
let minuteInterval: ReturnType<typeof setInterval> | undefined;

const weatherIcons = {
  clear: Sun,
  cloudy: Cloud,
  fog: CloudFog,
  rain: CloudRain,
  snow: Snowflake,
  storm: CloudLightning,
};

function subscribeToMinute(onStoreChange: () => void) {
  minuteListeners.add(onStoreChange);

  if (!minuteInterval) {
    minuteInterval = setInterval(() => {
      minuteListeners.forEach((listener) => listener());
    }, 15_000);
  }

  return () => {
    minuteListeners.delete(onStoreChange);

    if (minuteListeners.size === 0 && minuteInterval) {
      clearInterval(minuteInterval);
      minuteInterval = undefined;
    }
  };
}

function getMinuteSnapshot() {
  return Math.floor(Date.now() / 60_000);
}

function getServerMinuteSnapshot() {
  return 0;
}

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const localAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
  );

  return Math.round((localAsUtc - date.getTime()) / 60_000);
}

function formatUtcOffset(offsetMinutes: number) {
  const sign = offsetMinutes >= 0 ? "+" : "−";
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;

  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
}

function isInsideWorkday(utcMinute: number, offsetMinutes: number) {
  const localMinute = (utcMinute + offsetMinutes + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return localMinute >= WORKDAY_START && localMinute < WORKDAY_END;
}

function formatDuration(minutes: number) {
  const roundedMinutes = Math.max(1, Math.round(minutes));
  const hours = Math.floor(roundedMinutes / 60);
  const remainder = roundedMinutes % 60;

  if (hours === 0) return `${remainder}m`;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h ${remainder}m`;
}

function calculateOverlap(date: Date, localTimeZone: string): OverlapInfo {
  const jakartaOffset = getTimeZoneOffsetMinutes(date, JAKARTA_TIME_ZONE);
  const localOffset = getTimeZoneOffsetMinutes(date, localTimeZone);
  const utcMinuteNow = date.getUTCHours() * 60 + date.getUTCMinutes();
  const overlapByMinute = Array.from({ length: MINUTES_PER_DAY + 1 }, (_, index) => {
    const utcMinute = (utcMinuteNow + index) % MINUTES_PER_DAY;
    return (
      isInsideWorkday(utcMinute, jakartaOffset) &&
      isInsideWorkday(utcMinute, localOffset)
    );
  });

  const startsNow = overlapByMinute[0];
  const startIndex = startsNow ? 0 : overlapByMinute.findIndex(Boolean);

  if (startIndex < 0) {
    return { summary: "No standard overlap" };
  }

  let endIndex = startIndex;
  while (endIndex < overlapByMinute.length && overlapByMinute[endIndex]) {
    endIndex += 1;
  }

  const duration = endIndex - startIndex;
  const windowStart = new Date(date.getTime() + startIndex * 60_000);
  const windowEnd = new Date(date.getTime() + endIndex * 60_000);

  return {
    summary: startsNow
      ? `${formatDuration(duration)} remaining`
      : `${formatDuration(duration)} next window`,
    jakartaWindow: `${formatTime(windowStart, JAKARTA_TIME_ZONE)}–${formatTime(windowEnd, JAKARTA_TIME_ZONE)}`,
    localWindow: `${formatTime(windowStart, localTimeZone)}–${formatTime(windowEnd, localTimeZone)}`,
  };
}

function AnimatedValue({ value }: { value: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="live-context-value-clip">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          className="live-context-animated-value"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            duration: reduceMotion ? 0.1 : 0.16,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function LiveContextCard({ previewState }: LiveContextCardProps) {
  const reduceMotion = useReducedMotion();
  const minute = useSyncExternalStore(
    subscribeToMinute,
    getMinuteSnapshot,
    getServerMinuteSnapshot,
  );
  const date = useMemo(() => new Date(minute * 60_000), [minute]);
  const localTimeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );
  const localOffset = minute ? getTimeZoneOffsetMinutes(date, localTimeZone) : 0;
  const jakartaOffset = minute
    ? getTimeZoneOffsetMinutes(date, JAKARTA_TIME_ZONE)
    : 0;
  const isSameTimeZone = minute > 0 && localOffset === jakartaOffset;
  const overlap = useMemo(
    () => (minute ? calculateOverlap(date, localTimeZone) : { summary: "—" }),
    [date, localTimeZone, minute],
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [weather, setWeather] = useState<WeatherState>(() => {
    if (previewState === "error") return { status: "error" };
    if (previewState && previewState !== "loading") {
      return {
        status: "success",
        data: { temperature: 29, condition: "Light rain", kind: "rain" },
      };
    }
    return { status: "loading" };
  });
  const isDisabled = previewState === "disabled" || previewState === "loading";

  useEffect(() => {
    if (previewState) return;

    let ignore = false;

    fetch("/api/weather")
      .then(async (response) => {
        if (!response.ok) throw new Error("Weather request failed");
        return (await response.json()) as WeatherData;
      })
      .then((data) => {
        if (!ignore) setWeather({ status: "success", data });
      })
      .catch(() => {
        if (!ignore) setWeather({ status: "error" });
      });

    return () => {
      ignore = true;
    };
  }, [previewState]);

  const WeatherIcon =
    weather.status === "success" ? weatherIcons[weather.data.kind] : Cloud;
  const weatherValue =
    weather.status === "success"
      ? `${weather.data.temperature}°C · ${weather.data.condition}`
      : weather.status === "error"
        ? "Unavailable"
        : "Loading";

  const rows = [
    {
      label: "Jakarta · UTC+7",
      value: minute ? formatTime(date, JAKARTA_TIME_ZONE) : "—",
    },
    {
      label: `Your local time · ${minute ? formatUtcOffset(localOffset) : "UTC"}`,
      value: !minute
        ? "—"
        : isSameTimeZone
          ? "Same time zone as Jakarta"
          : formatTime(date, localTimeZone),
    },
  ];

  return (
    <motion.aside
      className="hero-proof live-context-card"
      data-state={previewState ?? "default"}
      layout={!reduceMotion}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: reduceMotion ? 0.15 : 0.5,
        delay: reduceMotion ? 0 : 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      aria-label="Live time, shared working hours, and Jakarta weather"
    >
      <header className="live-context-header">
        <span className="status-dot" aria-hidden="true" />
        <p>Live context</p>
        {previewState === "success" ? <Check aria-hidden="true" size={15} /> : null}
      </header>

      <div className="live-context-rows">
        {rows.map((row, index) => (
          <motion.div
            className="live-context-row"
            key={row.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0.1 : 0.3,
              delay: reduceMotion ? 0 : 0.16 + index * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span>{row.label}</span>
            <AnimatedValue value={row.value} />
          </motion.div>
        ))}

        <motion.button
          className="live-context-row live-context-row-button"
          type="button"
          data-state={previewState ?? "default"}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-expanded={isExpanded}
          aria-controls="overlap-details"
          onClick={() => setIsExpanded((current) => !current)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0.1 : 0.3,
            delay: reduceMotion ? 0 : 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span>Shared working hours</span>
          <span className="live-context-row-action-value">
            <AnimatedValue value={overlap.summary} />
            <motion.span
              animate={{ rotate: isExpanded && !reduceMotion ? 90 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChevronRight aria-hidden="true" size={16} />
            </motion.span>
          </span>
        </motion.button>

        <motion.div
          className="live-context-row live-context-weather"
          data-status={weather.status}
          aria-live="polite"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0.1 : 0.3,
            delay: reduceMotion ? 0 : 0.34,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span>Weather</span>
          <span className="live-context-weather-value">
            {weather.status === "loading" ? (
              <LoaderCircle className="live-context-spinner" aria-hidden="true" size={15} />
            ) : (
              <WeatherIcon aria-hidden="true" size={15} />
            )}
            <AnimatedValue value={weatherValue} />
          </span>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            className="live-context-details"
            id="overlap-details"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{
              duration: reduceMotion ? 0.1 : 0.24,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {overlap.jakartaWindow && overlap.localWindow ? (
              <dl>
                <div>
                  <dt>Jakarta</dt>
                  <dd>{overlap.jakartaWindow}</dd>
                </div>
                <div>
                  <dt>Your local time</dt>
                  <dd>
                    {isSameTimeZone
                      ? "Same time zone as Jakarta"
                      : overlap.localWindow}
                  </dd>
                </div>
              </dl>
            ) : (
              <p>There is no shared standard-hours window in the next 24 hours.</p>
            )}
            <p>Shared hours are calculated using 09:00–18:00 in both locations.</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <a
        className="live-context-source"
        href="https://open-meteo.com/"
        target="_blank"
        rel="noreferrer"
      >
        Weather by Open-Meteo <ExternalLink aria-hidden="true" size={12} />
      </a>
    </motion.aside>
  );
}
