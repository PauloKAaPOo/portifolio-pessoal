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
  const informationRef = useRef<HTMLElement>(null);
  const swipeStartX = useRef<number | null>(null);
  const slides = project.slides;
  const activeSlide = slides[galleryIndex];

  useEffect(() => {
    const information = informationRef.current;
    if (
      !information ||
      !origin ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = information.getBoundingClientRect();
    animationRef.current = information.animate(
      [
        {
          transformOrigin: "center center",
          transform: `translate(${origin.left - bounds.left}px, ${origin.top - bounds.top}px) scale(${origin.width / bounds.width}, ${origin.height / bounds.height}) rotate(0deg)`,
          borderRadius: "10px",
        },
        {
          transformOrigin: "center center",
          transform: "translate(0, 0) scale(1) rotateY(-360deg)",
          borderRadius: "18px",
        },
      ],
      {
        duration: 750,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      },
    );

    return () => animationRef.current?.cancel();
  }, [origin]);

  useEffect(() => {
    if (!isClosing) return;
    animationRef.current?.reverse();
  }, [isClosing]);

  const showSlide = (index: number) => {
    if (!slides.length) return;
    onGalleryIndexChange((index + slides.length) % slides.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const startX = swipeStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    swipeStartX.current = null;
    if (startX === null || endX === undefined || Math.abs(startX - endX) < 45) {
      return;
    }
    showSlide(galleryIndex + (startX > endX ? 1 : -1));
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
        aria-labelledby="project-project-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <section
          className={`project-information${isClosing ? " is-closing" : ""}`}
          ref={informationRef}
        >
          <button
            className="project-back-button"
            type="button"
            onClick={onClose}
            aria-label="Voltar aos projetos"
          >
            <X size={17} />
            <span>Voltar aos projetos</span>
          </button>
          <div className="project-information-content" aria-live="polite">
            <div className="project-context">
              <span className="eyebrow">{project.category}</span>
              <span className="project-status-badge">{project.status}</span>
            </div>
            <h2 id="project-project-title">{project.name}</h2>
            <span className="project-step-index">
              ETAPA {String(galleryIndex + 1).padStart(2, "0")} DE{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            {activeSlide && (
              <div className="project-slide-summary" key={galleryIndex}>
                <h3>{activeSlide.tituloEtapa}</h3>
                <div className="project-details">
                  <div>
                    <b>O que esta tela representa</b>
                    <p>{activeSlide.oQueRepresenta}</p>
                  </div>
                  <div>
                    <b>Como funciona</b>
                    <p>{activeSlide.comoFunciona}</p>
                  </div>
                  <div>
                    <b>Tecnologias desta etapa</b>
                    <div className="project-technology-list">
                      {activeSlide.tecnologias.map((technology) => (
                        <span className="project-technology" key={technology}>
                          <span className="technology-mark" aria-hidden="true">
                            {(technologyIcons[technology] ?? []).length ? (
                              technologyIcons[technology].map((icon) => (
                                <svg key={icon.slug} viewBox="0 0 24 24">
                                  <path d={icon.path} />
                                </svg>
                              ))
                            ) : technology === "Java" ? (
                              <Coffee size={14} />
                            ) : (
                              <Code2 size={14} />
                            )}
                          </span>
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="project-summary-links">
            {project.repositoryUrl && (
              <a
                className="button button-primary"
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={17} /> Repositório
              </a>
            )}
            {project.demoUrl && (
              <a
                className="button button-secondary"
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
              >
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
            <span>
              {String(galleryIndex + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
          {activeSlide ? (
            <>
              <div className="project-gallery-slide" key={galleryIndex}>
                <div className="project-gallery-image">
                  {activeSlide.imagem ? (
                    <Image
                      src={activeSlide.imagem}
                      alt={activeSlide.tituloEtapa}
                      fill
                      sizes="(max-width: 980px) 100vw, 58vw"
                    />
                  ) : (
                    <div className="project-slide-placeholder">
                      <div className="project-slide-placeholder-window">
                        <span />
                        <span />
                        <span />
                        <Code2 size={30} aria-hidden="true" />
                      </div>
                      <span className="project-slide-placeholder-label">
                        Captura real não cadastrada
                      </span>
                      <strong>{activeSlide.tituloEtapa}</strong>
                    </div>
                  )}
                </div>
                <div className="project-gallery-caption">
                  <h3>{activeSlide.tituloEtapa}</h3>
                  <p>{activeSlide.oQueRepresenta}</p>
                </div>
              </div>
              <button
                className="gallery-arrow gallery-arrow-previous"
                type="button"
                aria-label="Tela anterior"
                onClick={() => showSlide(galleryIndex - 1)}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="gallery-arrow gallery-arrow-next"
                type="button"
                aria-label="Próxima tela"
                onClick={() => showSlide(galleryIndex + 1)}
              >
                <ChevronRight size={20} />
              </button>
              <div className="gallery-thumbnails" aria-label="Selecionar etapa">
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.tituloEtapa}-${index}`}
                    className={`gallery-thumbnail${index === galleryIndex ? " is-active" : ""}`}
                    type="button"
                    aria-label={`Mostrar etapa ${index + 1}: ${slide.tituloEtapa}`}
                    aria-current={index === galleryIndex ? "true" : undefined}
                    onClick={() => showSlide(index)}
                  >
                    <span className="gallery-thumbnail-preview" aria-hidden="true">
                      {slide.imagem ? (
                        <Image
                          src={slide.imagem}
                          alt=""
                          width={64}
                          height={42}
                        />
                      ) : (
                        <Code2 size={13} />
                      )}
                    </span>
                    <span className="gallery-thumbnail-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <b>{slide.tituloEtapa}</b>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="project-gallery-empty">
              <div className="project-gallery-empty-icon">
                <Code2 size={30} />
              </div>
              <h3>Nenhuma etapa cadastrada</h3>
              <p>Adicione três etapas em <code>src/data/portfolio.ts</code>.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
