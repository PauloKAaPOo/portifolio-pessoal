"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Code2, Coffee, Database } from "lucide-react";
import { technologyIcons } from "@/data/technology-icons";
import type { Skill } from "@/types/portfolio";

type Point = { x: number; y: number };
type Size = { width: number; height: number };

type Body = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  width: number;
  height: number;
};

type TechnologyFieldProps = {
  skills: Skill[];
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

export default function TechnologyField({ skills }: TechnologyFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const bodiesRef = useRef<Body[]>([]);
  const fieldSizeRef = useRef<Size | null>(null);
  const frameRef = useRef<number | null>(null);
  const draggingRef = useRef<number | null>(null);
  const lastInteractionRef = useRef(0);
  const restoringRef = useRef(false);
  const pointerRef = useRef<Record<number, { point: Point; time: number }>>({});
  const velocityRef = useRef<Record<number, Point>>({});
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<number | null>(null);

  const uniqueSkills = useMemo(
    () => Array.from(
      new Map(skills.map((skill) => [skill.name, skill])).values(),
    ),
    [skills],
  );

  const applyBodyTransform = (index: number) => {
    const body = bodiesRef.current[index];
    const card = cardRefs.current[index];
    if (!body || !card) return;
    card.style.transform =
      `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`;
  };

  const getBodyBounds = useCallback((body: Body) => {
    const field = fieldRef.current;
    const radians = (body.angle * Math.PI) / 180;
    const halfWidth =
      (Math.abs(Math.cos(radians)) * body.width +
        Math.abs(Math.sin(radians)) * body.height) *
      (draggingRef.current !== null &&
      bodiesRef.current[draggingRef.current] === body
        ? 1.06
        : 1) /
      2;
    const halfHeight =
      (Math.abs(Math.sin(radians)) * body.width +
        Math.abs(Math.cos(radians)) * body.height) *
      (draggingRef.current !== null &&
      bodiesRef.current[draggingRef.current] === body
        ? 1.06
        : 1) /
      2;
    const padding = 8;
    const minimumX = padding + halfWidth - body.width / 2;
    const minimumY = padding + halfHeight - body.height / 2;

    return {
      minimumX,
      minimumY,
      maximumX: Math.max(
        minimumX,
        (field?.clientWidth ?? body.width) - padding - halfWidth - body.width / 2,
      ),
      maximumY: Math.max(
        minimumY,
        (field?.clientHeight ?? body.height) - padding - halfHeight - body.height / 2,
      ),
    };
  }, []);

  const constrainBody = useCallback((body: Body, bounce = false) => {
    const bounds = getBodyBounds(body);
    if (body.x < bounds.minimumX) {
      body.x = bounds.minimumX;
      if (bounce && body.vx < 0) body.vx *= -0.24;
    } else if (body.x > bounds.maximumX) {
      body.x = bounds.maximumX;
      if (bounce && body.vx > 0) body.vx *= -0.24;
    }
    if (body.y < bounds.minimumY) {
      body.y = bounds.minimumY;
      if (bounce && body.vy < 0) body.vy *= -0.24;
    } else if (body.y > bounds.maximumY) {
      body.y = bounds.maximumY;
      if (bounce && body.vy > 0) body.vy *= -0.24;
    }
  }, [getBodyBounds]);

  const stopLoop = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const startLoop = () => {
    if (frameRef.current !== null) return;
    let previousTime = 0;

    const animate = (now: number) => {
      const dt = previousTime === 0
        ? 1 / 60
        : clamp((now - previousTime) / 1000, 0.001, 0.032);
      previousTime = now;
      const bodies = bodiesRef.current;
      const activeIndex = draggingRef.current;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!restoringRef.current && activeIndex === null && now - lastInteractionRef.current > 2800) {
        const isSettled = bodies.every((body) =>
          Math.hypot(body.vx, body.vy) < 18,
        );
        if (isSettled) restoringRef.current = true;
      }

      for (let index = 0; index < bodies.length; index += 1) {
        const body = bodies[index];
        if (index === activeIndex) continue;

        if (restoringRef.current) {
          if (reducedMotion) {
            body.x = body.originX;
            body.y = body.originY;
            body.vx = 0;
            body.vy = 0;
            body.angle = 0;
            body.angularVelocity = 0;
          } else {
            const dx = body.originX - body.x;
            const dy = body.originY - body.y;
            body.vx = (body.vx + dx * 22 * dt) * Math.exp(-6.2 * dt);
            body.vy = (body.vy + dy * 22 * dt) * Math.exp(-6.2 * dt);
            body.angle =
              body.angle + body.angularVelocity * dt;
            body.angularVelocity =
              (body.angularVelocity - body.angle * 20 * dt) * Math.exp(-7 * dt);
            body.x += body.vx * dt;
            body.y += body.vy * dt;

            if (
              Math.abs(dx) < 0.8 &&
              Math.abs(dy) < 0.8 &&
              Math.hypot(body.vx, body.vy) < 8
            ) {
              body.x = body.originX;
              body.y = body.originY;
              body.vx = 0;
              body.vy = 0;
              body.angle = 0;
              body.angularVelocity = 0;
            }
          }
        } else {
          body.vx *= Math.exp(-1.25 * dt);
          body.vy *= Math.exp(-1.25 * dt);
          body.angularVelocity *= Math.exp(-2.4 * dt);
          body.x += body.vx * dt;
          body.y += body.vy * dt;
          body.angle += body.angularVelocity * dt;
        }

        const maxSpeed = window.innerWidth < 720 ? 620 : 820;
        const speed = Math.hypot(body.vx, body.vy);
        if (speed > maxSpeed) {
          const scale = maxSpeed / speed;
          body.vx *= scale;
          body.vy *= scale;
        }

        constrainBody(body, true);
        applyBodyTransform(index);
      }

      if (!restoringRef.current) {
        for (let first = 0; first < bodies.length; first += 1) {
          for (let second = first + 1; second < bodies.length; second += 1) {
            const a = bodies[first];
            const b = bodies[second];

            const dx = b.x + b.width / 2 - (a.x + a.width / 2);
            const dy = b.y + b.height / 2 - (a.y + a.height / 2);
            const overlapX = (a.width + b.width) / 2 - Math.abs(dx);
            const overlapY = (a.height + b.height) / 2 - Math.abs(dy);

            if (overlapX > 0 && overlapY > 0) {
              let normalX = 0;
              let normalY = 0;
              let penetration = 0;
              if (overlapX < overlapY) {
                normalX = dx >= 0 ? 1 : -1;
                penetration = overlapX;
              } else {
                normalY = dy >= 0 ? 1 : -1;
                penetration = overlapY;
              }

              a.x -= normalX * penetration * 0.5;
              a.y -= normalY * penetration * 0.5;
              b.x += normalX * penetration * 0.5;
              b.y += normalY * penetration * 0.5;

              const relativeVelocityX = b.vx - a.vx;
              const relativeVelocityY = b.vy - a.vy;
              const velocityAlongNormal =
                relativeVelocityX * normalX + relativeVelocityY * normalY;

              if (velocityAlongNormal < 0) {
                const restitution = 0.28;
                const impulse = -(1 + restitution) * velocityAlongNormal / 2;
                a.vx -= impulse * normalX;
                a.vy -= impulse * normalY;
                b.vx += impulse * normalX;
                b.vy += impulse * normalY;

                const impact = Math.abs(velocityAlongNormal);
                a.angularVelocity -= impact * normalY * 0.018;
                b.angularVelocity += impact * normalX * 0.018;
                a.vx *= 0.98;
                a.vy *= 0.98;
                b.vx *= 0.98;
                b.vy *= 0.98;
              }

              applyBodyTransform(first);
              applyBodyTransform(second);
            }
          }
        }
      }

      bodies.forEach((body, index) => {
        constrainBody(body, true);
        applyBodyTransform(index);
      });

      const allBack = restoringRef.current && bodies.every((body) =>
        body.x === body.originX &&
        body.y === body.originY &&
        body.angle === 0,
      );
      if (allBack) {
        restoringRef.current = false;
        frameRef.current = null;
        return;
      }

      const hasMovement = activeIndex !== null ||
        (!restoringRef.current && now - lastInteractionRef.current <= 2800) ||
        bodies.some((body) => Math.hypot(body.vx, body.vy) > 5 ||
          Math.abs(body.angularVelocity) > 0.02 ||
          (restoringRef.current && (
            body.x !== body.originX || body.y !== body.originY
          )));
      if (!hasMovement) {
        frameRef.current = null;
        return;
      }
      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const arrange = (forceReset = false) => {
      field.style.height = "";
      const baseRect = field.getBoundingClientRect();
      const columns = baseRect.width < 560 ? 2 : baseRect.width < 900 ? 3 : 4;
      const firstCard = cardRefs.current[0];
      const width = firstCard?.offsetWidth ?? 150;
      const height = firstCard?.offsetHeight ?? 94;
      const rows = Math.ceil(uniqueSkills.length / columns);
      const gapX = columns === 2 ? 12 : 18;
      const gapY = columns === 2 ? 16 : 18;
      const gridWidth = columns * width + (columns - 1) * gapX;
      const gridHeight = rows * height + (rows - 1) * gapY;
      if (gridHeight + 48 > baseRect.height) {
        field.style.height = `${gridHeight + 48}px`;
      }
      const rect = field.getBoundingClientRect();
      const left = Math.max(8, (rect.width - gridWidth) / 2);
      const top = Math.max(24, (rect.height - gridHeight) / 2);

      if (bodiesRef.current.length !== uniqueSkills.length) {
        bodiesRef.current = uniqueSkills.map((_, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);
          const x = left + column * (width + gapX);
          const y = top + row * (height + gapY);
          return {
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            angle: 0,
            angularVelocity: 0,
            width,
            height,
          };
        });
      } else {
        const previousSize = fieldSizeRef.current;
        uniqueSkills.forEach((_, index) => {
          const body = bodiesRef.current[index];
          const previousOriginX = body.originX;
          const previousOriginY = body.originY;
          const isAtPreviousOrigin =
            Math.abs(body.x - previousOriginX) < 2 &&
            Math.abs(body.y - previousOriginY) < 2 &&
            Math.hypot(body.vx, body.vy) < 2;
          const column = index % columns;
          const row = Math.floor(index / columns);
          const x = left + column * (width + gapX);
          const y = top + row * (height + gapY);
          if (previousSize) {
            body.x *= rect.width / previousSize.width;
            body.y *= rect.height / previousSize.height;
            body.vx *= rect.width / previousSize.width;
            body.vy *= rect.height / previousSize.height;
          }
          body.width = width;
          body.height = height;
          body.originX = x;
          body.originY = y;
          if (forceReset || (draggingRef.current === null && !restoringRef.current && isAtPreviousOrigin)) {
            body.x = x;
            body.y = y;
            body.vx = 0;
            body.vy = 0;
            body.angle = 0;
            body.angularVelocity = 0;
          } else {
            constrainBody(body);
          }
          applyBodyTransform(index);
        });
      }

      fieldSizeRef.current = { width: rect.width, height: rect.height };
      bodiesRef.current.forEach((_, index) => applyBodyTransform(index));
    };

    const frame = window.requestAnimationFrame(() => arrange(true));
    const handleResize = () => arrange(false);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      stopLoop();
    };
  }, [uniqueSkills, constrainBody]);

  const startDrag = (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    const body = bodiesRef.current[index];
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!body || !rect) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      body.vx = 0;
      body.vy = 0;
    }
    restoringRef.current = false;
    draggingRef.current = index;
    lastInteractionRef.current = event.timeStamp;
    dragOffsetRef.current = {
      x: event.clientX - rect.left - body.x,
      y: event.clientY - rect.top - body.y,
    };
    pointerRef.current[index] = { point: { x: event.clientX, y: event.clientY }, time: event.timeStamp };
    velocityRef.current[index] = { x: 0, y: 0 };
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
    event.currentTarget.style.zIndex = "120";
    setDragging(index);
    startLoop();
  };

  const moveDrag = (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (draggingRef.current !== index) return;
    const body = bodiesRef.current[index];
    const field = fieldRef.current;
    if (!body || !field) return;
    const rect = field.getBoundingClientRect();

    const now = event.timeStamp;
    const previous = pointerRef.current[index];
    if (previous) {
      const elapsed = Math.max(8, now - previous.time);
      velocityRef.current[index] = {
        x: clamp((event.clientX - previous.point.x) / elapsed * 1000, -900, 900),
        y: clamp((event.clientY - previous.point.y) / elapsed * 1000, -900, 900),
      };
    }
    pointerRef.current[index] = {
      point: { x: event.clientX, y: event.clientY },
      time: now,
    };

    const bounds = getBodyBounds(body);
    body.x = clamp(
      event.clientX - rect.left - dragOffsetRef.current.x,
      bounds.minimumX,
      bounds.maximumX,
    );
    body.y = clamp(
      event.clientY - rect.top - dragOffsetRef.current.y,
      bounds.minimumY,
      bounds.maximumY,
    );
    body.vx = 0;
    body.vy = 0;
    applyBodyTransform(index);
  };

  const endDrag = (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (draggingRef.current !== index) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const body = bodiesRef.current[index];
    if (body) {
      const velocity = velocityRef.current[index] ?? { x: 0, y: 0 };
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      body.vx = reducedMotion ? 0 : velocity.x;
      body.vy = reducedMotion ? 0 : velocity.y;
      body.angularVelocity = reducedMotion ? 0 : clamp(velocity.x * 0.0022, -1.8, 1.8);
    }
    event.currentTarget.classList.remove("is-dragging");
    event.currentTarget.style.zIndex = "";
    draggingRef.current = null;
    lastInteractionRef.current = event.timeStamp;
    setDragging(null);
  };

  const moveWithKeyboard = (
    index: number,
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    const body = bodiesRef.current[index];
    if (!body) return;
    const distance = event.shiftKey ? 28 : 12;
    const offset: Record<string, Point> = {
      ArrowLeft: { x: -distance, y: 0 },
      ArrowRight: { x: distance, y: 0 },
      ArrowUp: { x: 0, y: -distance },
      ArrowDown: { x: 0, y: distance },
    };
    const movement = offset[event.key];
    if (!movement) return;
    event.preventDefault();
    restoringRef.current = false;
    draggingRef.current = null;
    lastInteractionRef.current = event.timeStamp;
    const bounds = getBodyBounds(body);
    body.x = clamp(body.x + movement.x, bounds.minimumX, bounds.maximumX);
    body.y = clamp(body.y + movement.y, bounds.minimumY, bounds.maximumY);
    body.vx = movement.x * 18;
    body.vy = movement.y * 18;
    applyBodyTransform(index);
    startLoop();
  };

  return (
    <div className="technology-field" ref={fieldRef} aria-label="Tecnologias interativas">
      {uniqueSkills.map((skill, index) => {
        const icons = technologyIcons[skill.name] ?? [];
        return (
          <button
            type="button"
            className={`technology-item${dragging === index ? " is-dragging" : ""}`}
            data-technology-index={index}
            key={skill.name}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            onPointerDown={(event) => startDrag(index, event)}
            onPointerMove={(event) => moveDrag(index, event)}
            onPointerUp={(event) => endDrag(index, event)}
            onPointerCancel={(event) => endDrag(index, event)}
            onKeyDown={(event) => moveWithKeyboard(index, event)}
            aria-label={`${skill.name}. Use as setas para mover esta tecnologia.`}
          >
            <span className="technology-logo" aria-hidden="true">
              {icons.length > 0 ? (
                icons.map((icon) => (
                  <svg key={icon.slug} viewBox="0 0 24 24">
                    <path d={icon.path} />
                  </svg>
                ))
              ) : skill.name === "Java" ? (
                <Coffee size={25} />
              ) : skill.name === "SQL" || skill.name === "pgvector" ? (
                <Database size={25} />
              ) : (
                <Code2 size={25} />
              )}
            </span>
            <span className="technology-name">{skill.name}</span>
          </button>
        );
      })}
    </div>
  );
}
