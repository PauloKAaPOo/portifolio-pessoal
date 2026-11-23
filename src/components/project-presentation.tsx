"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Coffee,
  ExternalLink,
  X,
} from "lucide-react";
import { useEffect, useRef, type RefObject, type TouchEvent } from "react";
import { technologyIcons } from "@/data/technology-icons";
import type { Project } from "@/types/portfolio";

type ProjectOrigin = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type ProjectPresentationProps = {
  project: Project;
  galleryIndex: number;
  isClosing: boolean;
  origin: ProjectOrigin | null;
  dialogRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onGalleryIndexChange: (index: number) => void;
};

export default function ProjectPresentation({
  project,
  galleryIndex,
  isClosing,
  origin,
  dialogRef,
  onClose,
  onGalleryIndexChange,
}: ProjectPresentationProps) {
  const animationRef = useRef<Animation | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const images = project.images;
  const activeImage = images[galleryIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !origin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const bounds = dialog.getBoundingClientRect();
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    animationRef.current = dialog.animate(
      isMobile
        ? [
            { opacity: 0, transform: "translateY(14px) scale(.98)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ]
        : [
            {
              transformOrigin: "top left",
              transform: `translate(${origin.left - bounds.left}px, ${origin.top - bounds.top}px) scale(${origin.width / bounds.width}, ${origin.height / bounds.height})`,
              borderRadius: "10px",
            },
            { transformOrigin: "top left", transform: "translate(0, 0) scale(1, 1)", borderRadius: "14px" },
          ],
      { duration: 540, easing: "cubic-bezier(.2, .75, .25, 1)", fill: "both" },
    );

    return () => animationRef.current?.cancel();
  }, [dialogRef, origin]);

  useEffect(() => {
    if (!isClosing) return;
    animationRef.current?.reverse();
  }, [isClosing]);

  const showImage = (index: number) => {
    if (!images.length) return;
    onGalleryIndexChange((index + images.length) % images.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const startX = swipeStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    swipeStartX.current = null;
    if (startX === null || endX === undefined || Math.abs(startX - endX) < 45) return;
    showImage(galleryIndex + (startX > endX ? 1 : -1));
  };

  return (
    <div
      className={`project-presentation-backdrop${isClosing ? " is-closing" : ""}`}
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className={`project-presentation${isClosing ? " is-closing" : ""}`}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <section className={`project-information${isClosing ? " is-closing" : ""}`}>
          <button className="modal-close" onClick={onClose} aria-label="Fechar apresentação">
            <X size={19} />
          </button>
          <span className="eyebrow">{project.category} · {project.status}</span>
          <h2 id="project-modal-title">{project.name}</h2>
          <p className="project-presentation-description">{project.description}</p>
          <div className="project-details">
            <div>
              <b>Objetivo</b>
              <p>{project.objective}</p>
            </div>
            <div>
              <b>Participação</b>
              <p>{project.participation}</p>
            </div>
            <div>
              <b>Funcionalidades</b>
              <ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </div>
            <div>
              <b>Tecnologias</b>
              <div className="project-technology-list">
                {project.technologies.map((technology) => (
                  <span className="project-technology" key={technology}>
                    <span className="technology-mark" aria-hidden="true">
                      {(technologyIcons[technology] ?? []).length ? (
                        technologyIcons[technology].map((icon) => (
                          <svg key={icon.slug} viewBox="0 0 24 24">
                            <path d={icon.path} />
                          </svg>
                        ))
                      ) : (
                        technology === "Java" ? <Coffee size={14} /> : <Code2 size={14} />
                      )}
                    </span>
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-actions">
            {project.repositoryUrl && (
              <a className="button button-primary" href={project.repositoryUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={17} /> Repositório
              </a>
            )}
            {project.demoUrl && (
              <a className="button button-secondary" href={project.demoUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={17} /> Demonstração
              </a>
            )}
          </div>
        </section>

        <section
          className={`project-gallery${isClosing ? " is-closing" : ""}`}
          aria-label={`Galeria de telas de ${project.name}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="project-gallery-heading">
            <span>Galeria de telas</span>
            <span>{activeImage ? `${String(galleryIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}` : "Sem capturas"}</span>
          </div>
          {activeImage ? (
            <>
              <div className="project-gallery-slide" key={activeImage.id} aria-live="polite">
                <div className="project-gallery-image">
                  <Image
                    src={activeImage.image}
                    alt={activeImage.title}
                    fill
                    sizes="(max-width: 720px) 100vw, 55vw"
                  />
                </div>
                <div className="project-gallery-caption">
                  <h3>{activeImage.title}</h3>
                  <p>{activeImage.description}</p>
                </div>
              </div>
              {images.length > 1 && (
                <>
                  <button
                    className="gallery-arrow gallery-arrow-previous"
                    type="button"
                    aria-label="Tela anterior"
                    onClick={() => showImage(galleryIndex - 1)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className="gallery-arrow gallery-arrow-next"
                    type="button"
                    aria-label="Próxima tela"
                    onClick={() => showImage(galleryIndex + 1)}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="gallery-pagination" aria-label="Selecionar tela">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        className={index === galleryIndex ? "is-active" : ""}
                        type="button"
                        aria-label={`Mostrar tela ${index + 1}: ${image.title}`}
                        aria-current={index === galleryIndex ? "true" : undefined}
                        onClick={() => showImage(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="project-gallery-empty">
              <div className="project-gallery-empty-icon"><Code2 size={30} /></div>
              <h3>Capturas ainda não cadastradas</h3>
              <p>Adicione as telas reais deste projeto em <code>src/data/portfolio.ts</code> e salve os arquivos em <code>public/images/projects/</code>.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
