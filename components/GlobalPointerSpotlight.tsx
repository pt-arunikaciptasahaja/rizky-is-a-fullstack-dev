/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5
 * Hallmark · component: global gooey pointer · genre: modern-minimal · theme: Cobalt Light
 * motion: velocity stretch · metaball merge · trail dissolve
 */
"use client";

import { useEffect, useRef } from "react";

const POINTER_MEDIA_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const TRAIL_COUNT = 42;
const TRAIL_SPACING = 12;

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  previousX: number;
  previousY: number;
  lastEventX: number;
  lastEventY: number;
  lastSpawnX: number;
  lastSpawnY: number;
  angle: number;
  speed: number;
  scale: number;
  active: boolean;
  initialized: boolean;
  lastMoveAt: number;
};

type TrailParticle = {
  node: SVGCircleElement;
  active: boolean;
  x: number;
  y: number;
  radius: number;
  age: number;
  lifetime: number;
  driftX: number;
  driftY: number;
};

const createPointerState = (): PointerState => ({
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  previousX: 0,
  previousY: 0,
  lastEventX: 0,
  lastEventY: 0,
  lastSpawnX: 0,
  lastSpawnY: 0,
  angle: 0,
  speed: 0,
  scale: 0,
  active: false,
  initialized: false,
  lastMoveAt: 0,
});

export function GlobalPointerSpotlight() {
  const svgRef = useRef<SVGSVGElement>(null);
  const filterRef = useRef<SVGFilterElement>(null);
  const submergeGradientRef = useRef<SVGLinearGradientElement>(null);
  const glassBoundaryRef = useRef<SVGStopElement>(null);
  const sunsetBoundaryRef = useRef<SVGStopElement>(null);
  const sunsetDepthRef = useRef<SVGStopElement>(null);
  const blobRef = useRef<SVGEllipseElement>(null);
  const lobeRefs = useRef<Array<SVGCircleElement | null>>([]);
  const trailRefs = useRef<Array<SVGCircleElement | null>>([]);

  useEffect(() => {
    const svg = svgRef.current;
    const gooFilter = filterRef.current;
    const submergeGradient = submergeGradientRef.current;
    const glassBoundary = glassBoundaryRef.current;
    const sunsetBoundary = sunsetBoundaryRef.current;
    const sunsetDepth = sunsetDepthRef.current;
    const pointerBlob = blobRef.current;
    const pointerLobes = lobeRefs.current.filter(
      (node): node is SVGCircleElement => node !== null,
    );
    const supportsPointerEffect = window.matchMedia(POINTER_MEDIA_QUERY);

    if (
      !svg ||
      !gooFilter ||
      !submergeGradient ||
      !glassBoundary ||
      !sunsetBoundary ||
      !sunsetDepth ||
      !pointerBlob ||
      pointerLobes.length !== 5
    ) return;

    const scene = svg;
    const head = pointerBlob;

    const particles: TrailParticle[] = trailRefs.current
      .filter((node): node is SVGCircleElement => node !== null)
      .map((node) => ({
        node,
        active: false,
        x: 0,
        y: 0,
        radius: 0,
        age: 0,
        lifetime: 0,
        driftX: 0,
        driftY: 0,
      }));
    const pointer = createPointerState();

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let nextParticleIndex = 0;
    let animationFrame: number | null = null;
    let previousFrameAt = performance.now();

    const updateSubmergeGradient = () => {
      const footer = document.querySelector<HTMLElement>(".contact-footer");
      const waterline = footer?.getBoundingClientRect().top ?? viewportHeight;
      const boundary = Math.max(0, Math.min(1, waterline / viewportHeight));
      const feather = Math.min(0.018, 7 / viewportHeight);
      const glassEdge = Math.max(0, boundary - feather);
      const sunsetEdge = Math.min(1, boundary + feather);
      const sunsetDeep = Math.min(1, sunsetEdge + 0.24);

      submergeGradient.setAttribute("y2", String(viewportHeight));
      glassBoundary.setAttribute("offset", glassEdge.toFixed(4));
      sunsetBoundary.setAttribute("offset", sunsetEdge.toFixed(4));
      sunsetDepth.setAttribute("offset", sunsetDeep.toFixed(4));
    };

    const setViewport = () => {
      viewportWidth = Math.max(1, window.innerWidth);
      viewportHeight = Math.max(1, window.innerHeight);
      scene.setAttribute("viewBox", `0 0 ${viewportWidth} ${viewportHeight}`);

      // Extend the filter region so blobs remain intact at viewport edges.
      gooFilter.setAttribute("x", "-160");
      gooFilter.setAttribute("y", "-160");
      gooFilter.setAttribute("width", String(viewportWidth + 320));
      gooFilter.setAttribute("height", String(viewportHeight + 320));
      updateSubmergeGradient();
    };

    const hasLiveParticles = () => particles.some((particle) => particle.active);

    const spawnParticle = (x: number, y: number, speed: number) => {
      const particle = particles[nextParticleIndex];
      if (!particle) return;

      nextParticleIndex = (nextParticleIndex + 1) % particles.length;
      const speedFactor = Math.min(1, speed / 1.6);

      Object.assign(particle, {
        active: true,
        x,
        y,
        radius: 13 + speedFactor * 11,
        age: 0,
        lifetime: 760 + speedFactor * 260,
        driftX: -Math.cos(pointer.angle) * speedFactor * 0.016,
        driftY: -Math.sin(pointer.angle) * speedFactor * 0.016,
      });
    };

    const seedTrail = (
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      speed: number,
    ) => {
      const distance = Math.hypot(toX - fromX, toY - fromY);
      const count = Math.min(12, Math.floor(distance / TRAIL_SPACING));

      for (let index = 1; index <= count; index += 1) {
        const progress = index / (count + 1);
        spawnParticle(
          fromX + (toX - fromX) * progress,
          fromY + (toY - fromY) * progress,
          speed,
        );
      }
    };

    const scheduleFrame = () => {
      if (animationFrame !== null) return;
      previousFrameAt = performance.now();
      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!supportsPointerEffect.matches) return;

      const target = event.target;
      const now = performance.now();
      const eventX = event.clientX;
      const eventY = event.clientY;
      const isInsideFooter =
        target instanceof Element && Boolean(target.closest(".contact-footer"));
      const nextTone = isInsideFooter ? "sunset" : "glass";

      scene.dataset.tone = nextTone;
      updateSubmergeGradient();

      if (!pointer.initialized) {
        Object.assign(pointer, {
          x: eventX,
          y: eventY,
          targetX: eventX,
          targetY: eventY,
          previousX: eventX,
          previousY: eventY,
          lastEventX: eventX,
          lastEventY: eventY,
          lastSpawnX: eventX,
          lastSpawnY: eventY,
          initialized: true,
        });
      }

      const eventDistance = Math.hypot(
        eventX - pointer.lastEventX,
        eventY - pointer.lastEventY,
      );
      const eventDelta = Math.max(8, now - pointer.lastMoveAt);
      const eventSpeed = eventDistance / eventDelta;

      if (eventDistance > 2) {
        pointer.angle = Math.atan2(
          eventY - pointer.lastEventY,
          eventX - pointer.lastEventX,
        );
        seedTrail(
          pointer.lastSpawnX,
          pointer.lastSpawnY,
          eventX,
          eventY,
          eventSpeed,
        );
        pointer.lastSpawnX = eventX;
        pointer.lastSpawnY = eventY;
      }

      pointer.targetX = eventX;
      pointer.targetY = eventY;
      pointer.lastEventX = eventX;
      pointer.lastEventY = eventY;
      pointer.lastMoveAt = now;
      pointer.active = true;
      scene.dataset.visible = "true";
      scheduleFrame();
    };

    const hidePointer = () => {
      pointer.active = false;

      // Leaving the viewport accelerates the remaining trail without snapping it off.
      particles.forEach((particle) => {
        if (particle.active) {
          particle.lifetime = Math.min(particle.lifetime, particle.age + 260);
        }
      });
      scheduleFrame();
    };

    const updateParticles = (delta: number) => {
      particles.forEach((particle) => {
        if (!particle.active) return;

        particle.age += delta;
        if (particle.age >= particle.lifetime) {
          particle.active = false;
          particle.node.setAttribute("r", "0");
          return;
        }

        const remaining = 1 - particle.age / particle.lifetime;
        const radius = particle.radius * Math.pow(remaining, 0.72);
        particle.x += particle.driftX * delta;
        particle.y += particle.driftY * delta;
        particle.node.setAttribute("cx", particle.x.toFixed(2));
        particle.node.setAttribute("cy", particle.y.toFixed(2));
        particle.node.setAttribute("r", radius.toFixed(2));
      });
    };

    const updatePointerBlob = (now: number, delta: number) => {
      if (!pointer.initialized) return;

      const follow = 1 - Math.exp(-delta * 0.013);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;

      const frameDistance = Math.hypot(
        pointer.x - pointer.previousX,
        pointer.y - pointer.previousY,
      );
      const measuredSpeed = frameDistance / Math.max(1, delta);
      pointer.speed += (measuredSpeed - pointer.speed) * 0.2;
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;

      const targetScale = pointer.active ? 1 : 0;
      const scaleFollow = 1 - Math.exp(-delta * (pointer.active ? 0.018 : 0.012));
      pointer.scale += (targetScale - pointer.scale) * scaleFollow;

      const idleFor = now - pointer.lastMoveAt;
      const breathing = idleFor > 100 ? 1 + Math.sin(now * 0.0022) * 0.035 : 1;
      const speedFactor = Math.min(1, pointer.speed / 1.15);
      const baseRadius = Math.max(
        27,
        Math.min(38, Math.min(viewportWidth, viewportHeight) * 0.045),
      );
      const radiusX = baseRadius * (1 + speedFactor * 1.02) * breathing * pointer.scale;
      const radiusY = baseRadius * (1 - speedFactor * 0.3) * breathing * pointer.scale;
      const angleDegrees = pointer.angle * 180 / Math.PI;

      head.setAttribute("cx", pointer.x.toFixed(2));
      head.setAttribute("cy", pointer.y.toFixed(2));
      head.setAttribute("rx", Math.max(0, radiusX).toFixed(2));
      head.setAttribute("ry", Math.max(0, radiusY).toFixed(2));
      head.setAttribute(
        "transform",
        `rotate(${angleDegrees.toFixed(2)} ${pointer.x.toFixed(2)} ${pointer.y.toFixed(2)})`,
      );

      pointerLobes.forEach((lobe, index) => {
        const phase = now * (0.0011 + index * 0.00008) + index * 1.257;
        const orbit = baseRadius * (0.32 + (index % 2) * 0.07) * pointer.scale;
        const lobeRadius =
          baseRadius * (0.36 + Math.sin(phase * 0.77) * 0.045) * pointer.scale;

        lobe.setAttribute("cx", (pointer.x + Math.cos(phase) * orbit).toFixed(2));
        lobe.setAttribute(
          "cy",
          (pointer.y + Math.sin(phase * 1.17) * orbit).toFixed(2),
        );
        lobe.setAttribute("r", Math.max(0, lobeRadius).toFixed(2));
      });
    };

    function render(now: number) {
      animationFrame = null;
      const delta = Math.min(34, now - previousFrameAt);
      previousFrameAt = now;
      updatePointerBlob(now, delta);
      updateParticles(delta);

      const shouldContinue =
        pointer.active || pointer.scale > 0.01 || hasLiveParticles();

      if (shouldContinue) {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        scene.dataset.visible = "false";
        head.setAttribute("rx", "0");
        head.setAttribute("ry", "0");
        pointerLobes.forEach((lobe) => lobe.setAttribute("r", "0"));
      }
    }

    const handleCapabilityChange = () => {
      if (!supportsPointerEffect.matches) hidePointer();
    };

    setViewport();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", hidePointer);
    window.addEventListener("resize", setViewport, { passive: true });
    document.documentElement.addEventListener("mouseleave", hidePointer);
    document.addEventListener("visibilitychange", hidePointer);
    supportsPointerEffect.addEventListener("change", handleCapabilityChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", hidePointer);
      window.removeEventListener("resize", setViewport);
      document.documentElement.removeEventListener("mouseleave", hidePointer);
      document.removeEventListener("visibilitychange", hidePointer);
      supportsPointerEffect.removeEventListener("change", handleCapabilityChange);

      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="global-pointer-spotlight"
      data-visible="false"
      data-tone="glass"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          ref={submergeGradientRef}
          id="global-pointer-submerge"
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop offset="0" stopColor="var(--color-glass-edge)" />
          <stop
            ref={glassBoundaryRef}
            offset="1"
            stopColor="var(--color-glass-edge)"
          />
          <stop
            ref={sunsetBoundaryRef}
            offset="1"
            stopColor="var(--color-sunset-gold)"
          />
          <stop
            ref={sunsetDepthRef}
            offset="1"
            stopColor="var(--color-sunset-orange)"
          />
          <stop offset="1" stopColor="var(--color-sunset-coral)" />
        </linearGradient>
        <filter
          ref={filterRef}
          id="global-pointer-goo"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blurredField" />
          <feColorMatrix
            in="blurredField"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 23 -10"
          />
        </filter>

        <mask
          id="global-pointer-shape"
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
        >
          <rect width="100%" height="100%" fill="black" />
          <g fill="white" filter="url(#global-pointer-goo)">
            <ellipse ref={blobRef} className="global-pointer-head" rx="0" ry="0" />
            {Array.from({ length: 5 }, (_, index) => (
              <circle
                key={`lobe-${index}`}
                className="global-pointer-head"
                ref={(node) => {
                  lobeRefs.current[index] = node;
                }}
                r="0"
              />
            ))}
            {Array.from({ length: TRAIL_COUNT }, (_, index) => (
              <circle
                key={`trail-${index}`}
                ref={(node) => {
                  trailRefs.current[index] = node;
                }}
                r="0"
              />
            ))}
          </g>
        </mask>
      </defs>

      <rect
        className="global-pointer-goo"
        width="100%"
        height="100%"
        fill="url(#global-pointer-submerge)"
        mask="url(#global-pointer-shape)"
      />
    </svg>
  );
}
