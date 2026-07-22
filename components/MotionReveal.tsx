"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface MotionRevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
}

export function MotionReveal({
  children,
  className,
  delay = 0,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={["motion-reveal", className].filter(Boolean).join(" ")}
      initial={{ y: 10 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0.15 : 0.42,
        delay: reduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
