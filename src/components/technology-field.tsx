"use client";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Code2, Coffee, Database } from "lucide-react";
import { technologyIcons } from "@/data/technology-icons";
import type { Skill } from "@/types/portfolio";

type Position = { x: number; y: number };

type TechnologyFieldProps = {
  skills: Skill[];
};

export default function TechnologyField({ skills }: TechnologyFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const velocityRef = useRef<Record<number, Position>>({});
  const lastPointerRef = useRef<Record<number, { x: number; y: number; time: number }>>({});
  const [positions, setPositions] = useState<Position[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);

  const uniqueSkills = useMemo(
    () => Array.from(
      new Map(skills.map((skill) => [skill.name, skill])).values(),
    ),
    [skills],
  );

  const clampPosition = (
    index: number,
    position: Position,
  ): Position => {
    const field = fieldRef.current;
    const element = field?.querySelector<HTMLElement>(
      `[data-technology-index="${index}"]`,
    );
    if (!field || !element) return position;

    const maxX = Math.max(0, field.clientWidth - element.offsetWidth);
    const maxY = Math.max(0, field.clientHeight - element.offsetHeight);
    return {
      x: Math.min(maxX, Math.max(0, position.x)),
      y: Math.min(maxY, Math.max(0, position.y)),
    };
  };

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const arrange = () => {
      const width = field.clientWidth;
      const height = field.clientHeight;
      const compact = width < 560;
      const columns = compact ? 2 : width < 900 ? 3 : 4;
      const cardWidth = compact ? 132 : 150;
      const cardHeight = compact ? 84 : 94;
      const rows = Math.ceil(uniqueSkills.length / columns);
      const rowGap = Math.max(18, (height - rows * cardHeight) / (rows + 1));
      const columnGap =
        columns > 1 ? (width - columns * cardWidth) / (columns + 1) : 0;

      setPositions((current) => uniqueSkills.map((_, index) => {
        if (current[index]) {
          return {
            x: Math.min(width - cardWidth, Math.max(8, current[index].x)),
            y: Math.min(height - cardHeight, Math.max(8, current[index].y)),
          };
        }
        const column = index % columns;
        const row = Math.floor(index / columns);
        const x = Math.max(8, columnGap * (column + 1) + cardWidth * column);
        const y = Math.max(8, rowGap * (row + 1) + cardHeight * row);
        return {
          x: Math.min(width - cardWidth, Math.max(8, x)),
          y: Math.min(height - cardHeight, Math.max(8, y)),
        };
      }));
    };

    arrange();
    window.addEventListener("resize", arrange);
    return () => window.removeEventListener("resize", arrange);
  }, [uniqueSkills]);

  const stopInertia = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const startDrag = (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    stopInertia();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    velocityRef.current[index] = { x: 0, y: 0 };
    lastPointerRef.current[index] = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };
    setDragging(index);
  };

  const moveDrag = (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragging !== index) return;
    const field = fieldRef.current;
    if (!field) return;

    const bounds = field.getBoundingClientRect();
    const element = event.currentTarget;
    const next = clampPosition(index, {
      x: event.clientX - bounds.left - element.offsetWidth / 2,
      y: event.clientY - bounds.top - element.offsetHeight / 2,
    });
    const now = event.timeStamp;
    const last = lastPointerRef.current[index];
    if (last) {
      const elapsed = Math.max(8, now - last.time);
      velocityRef.current[index] = {
        x: (event.clientX - last.x) / elapsed,
        y: (event.clientY - last.y) / elapsed,
      };
    }
    lastPointerRef.current[index] = {
      x: event.clientX,
      y: event.clientY,
      time: now,
    };
    setPositions((current) => current.map((position, itemIndex) =>
      itemIndex === index ? next : position,
    ));
  };

  const endDrag = (index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragging !== index) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(null);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let velocity = velocityRef.current[index] ?? { x: 0, y: 0 };
    const animateInertia = () => {
      const speed = Math.hypot(velocity.x, velocity.y);
      if (speed < 0.045) {
        frameRef.current = null;
        return;
      }

      setPositions((current) => current.map((position, itemIndex) => {
        if (itemIndex !== index) return position;
        return clampPosition(index, {
          x: position.x + velocity.x * 16,
          y: position.y + velocity.y * 16,
        });
      }));
      velocity = { x: velocity.x * 0.88, y: velocity.y * 0.88 };
      frameRef.current = window.requestAnimationFrame(animateInertia);
    };
    frameRef.current = window.requestAnimationFrame(animateInertia);
  };

  const moveWithKeyboard = (
    index: number,
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    const distance = event.shiftKey ? 28 : 12;
    const offsets: Record<string, Position> = {
      ArrowLeft: { x: -distance, y: 0 },
      ArrowRight: { x: distance, y: 0 },
      ArrowUp: { x: 0, y: -distance },
      ArrowDown: { x: 0, y: distance },
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    setPositions((current) => current.map((position, itemIndex) =>
      itemIndex === index
        ? clampPosition(index, { x: position.x + offset.x, y: position.y + offset.y })
        : position,
    ));
  };

  return (
    <div className="technology-field" ref={fieldRef} aria-label="Tecnologias arrastáveis">
      <div className="technology-field-decoration" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      {uniqueSkills.map((skill, index) => {
        const icons = technologyIcons[skill.name] ?? [];
        const position = positions[index] ?? { x: 8, y: 8 };
        return (
          <div
            className="technology-float"
            style={{
              "--float-delay": `${(index % 7) * -0.63}s`,
              "--float-duration": `${5.2 + (index % 5) * 0.48}s`,
              "--float-y": `${-5 - (index % 3) * 2}px`,
              "--float-x": `${index % 2 === 0 ? 3 : -3}px`,
              "--float-rotate": `${index % 2 === 0 ? 1.2 : -1.2}deg`,
            } as CSSProperties}
            key={skill.name}
          >
            <button
              type="button"
              className={`technology-item${dragging === index ? " is-dragging" : ""}`}
              data-technology-index={index}
              style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
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
          </div>
        );
      })}
    </div>
  );
}
