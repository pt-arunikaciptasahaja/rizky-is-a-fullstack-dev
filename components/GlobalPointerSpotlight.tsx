/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V4
 * Hallmark · component: global pointer spotlight · genre: modern-minimal · theme: Cobalt Light
 * motion: direct pointer response · no lag · no blur · reduced-motion and coarse-pointer safe
 */
"use client";

import { useEffect, useRef } from "react";

const POINTER_MEDIA_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function GlobalPointerSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    const supportsPointerEffect = window.matchMedia(POINTER_MEDIA_QUERY);

    if (!spotlight || !supportsPointerEffect.matches) return;

    let animationFrame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const renderPosition = () => {
      spotlight.style.transform =
        `translate3d(${pointerX}px, ${pointerY}px, 0) translate3d(-50%, -50%, 0)`;
      animationFrame = null;
    };

    const showSpotlight = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      spotlight.dataset.visible = "true";

      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(renderPosition);
      }
    };

    const hideSpotlight = () => {
      spotlight.dataset.visible = "false";
    };

    window.addEventListener("pointermove", showSpotlight, { passive: true });
    window.addEventListener("blur", hideSpotlight);
    document.documentElement.addEventListener("mouseleave", hideSpotlight);

    return () => {
      window.removeEventListener("pointermove", showSpotlight);
      window.removeEventListener("blur", hideSpotlight);
      document.documentElement.removeEventListener("mouseleave", hideSpotlight);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="global-pointer-spotlight"
      data-visible="false"
      aria-hidden="true"
    />
  );
}
