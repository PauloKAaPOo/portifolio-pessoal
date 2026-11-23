"use client";

import Image from "next/image";
import {
  ArrowUp,
  Award,
  Code2,
  Coffee,
  Database,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Link as LinkIcon,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import {
  siC,
  siCss,
  siDocker,
  siGit,
  siGithub,
  siHtml5,
  siMysql,
  siNextdotjs,
  siOllama,
  siPostgresql,
  siPython,
  siReact,
  siSpringboot,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  certificates,
  education,
  hobbies,
  profile,
  projects,
  skillCategories,
  socialLinks,
} from "@/data/portfolio";
import type { Project } from "@/types/portfolio";

const technologyIcons: Record<string, SimpleIcon[]> = {
  C: [siC],
  Python: [siPython],
  "Spring Boot": [siSpringboot],
  MySQL: [siMysql],
  PostgreSQL: [siPostgresql],
  "Ollama / Open WebUI": [siOllama],
  "Next.js": [siNextdotjs],
  React: [siReact],
  TypeScript: [siTypescript],
  "HTML / CSS": [siHtml5, siCss],
  "Git / GitHub": [siGit, siGithub],
  Docker: [siDocker],
};

const navItems = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "skills", label: "Skills" },
  { id: "formacao", label: "Formação" },
  { id: "certificados", label: "Certificados" },
  { id: "interesses", label: "Interesses" },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default function PortfolioPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [showTop, setShowTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectGalleryIndex, setProjectGalleryIndex] = useState(0);
  const [isClosingProject, setIsClosingProject] = useState(false);
  const [projectPage, setProjectPage] = useState(0);
  const [projectsPerPage, setProjectsPerPage] = useState(3);
  const swipeStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const projectModalRef = useRef<HTMLDivElement>(null);
  const dialogReturnFocus = useRef<HTMLElement | null>(null);
  const closeProjectTimeout = useRef<number | null>(null);
  const projectPages = Array.from(
    { length: Math.ceil(projects.length / projectsPerPage) },
    (_, pageIndex) =>
      projects.slice(
        pageIndex * projectsPerPage,
        (pageIndex + 1) * projectsPerPage,
      ),
  );
  const activeProjectPage = Math.min(
    projectPage,
    Math.max(0, projectPages.length - 1),
  );

  const openProject = (project: Project) => {
    if (closeProjectTimeout.current) {
      window.clearTimeout(closeProjectTimeout.current);
      closeProjectTimeout.current = null;
    }
    setProjectGalleryIndex(0);
    setIsClosingProject(false);
    setSelectedProject(project);
  };

  const closeProject = useCallback(() => {
    if (!selectedProject) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelectedProject(null);
      return;
    }

    if (closeProjectTimeout.current) {
      window.clearTimeout(closeProjectTimeout.current);
    }
    setIsClosingProject(true);
    closeProjectTimeout.current = window.setTimeout(() => {
      setSelectedProject(null);
      setIsClosingProject(false);
      closeProjectTimeout.current = null;
    }, 420);
  }, [selectedProject]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    const shouldUseDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const frame = window.requestAnimationFrame(() => {
      setDarkMode(shouldUseDark);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem(
      "portfolio-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealTargets = document.querySelectorAll(
      ".section-heading, .about-grid > *, .project-card, .skill-card, .timeline-item, .certificate-card, .hobby-card, .empty-state",
    );
    revealTargets.forEach((element) => element.classList.add("scroll-reveal"));
    document.documentElement.classList.add("scroll-reveal-enabled");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    revealTargets.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("scroll-reveal-enabled");
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    dialogReturnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    projectModalRef.current
      ?.querySelector<HTMLElement>("button, a[href]")
      ?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProject();
        return;
      }

      if (event.key !== "Tab" || !projectModalRef.current) return;

      const focusable = projectModalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      dialogReturnFocus.current?.focus();
      if (closeProjectTimeout.current) {
        window.clearTimeout(closeProjectTimeout.current);
        closeProjectTimeout.current = null;
      }
    };
  }, [selectedProject, closeProject]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      document.getElementById("menu-toggle")?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !hasFinePointer) return;

    let frame = 0;
    let latestPointer: PointerEvent | null = null;
    const onPointerMove = (event: PointerEvent) => {
      latestPointer = event;
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        if (latestPointer) {
          document.documentElement.style.setProperty(
            "--pointer-x",
            `${latestPointer.clientX}px`,
          );
          document.documentElement.style.setProperty(
            "--pointer-y",
            `${latestPointer.clientY}px`,
          );
        }
        frame = 0;
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const updateProjectsPerPage = () => {
      setProjectsPerPage(
        window.innerWidth <= 720 ? 1 : window.innerWidth <= 980 ? 2 : 3,
      );
    };

    updateProjectsPerPage();
    window.addEventListener("resize", updateProjectsPerPage, {
      passive: true,
    });
    return () => window.removeEventListener("resize", updateProjectsPerPage);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -65%", threshold: [0.1, 0.3, 0.6] },
    );

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navigateTo = (id: string) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    document.getElementById(id)?.scrollIntoView({ behavior });
    setMenuOpen(false);
  };

  const goToProjectPage = (page: number) => {
    setProjectPage(Math.max(0, Math.min(page, projectPages.length - 1)));
  };

  return (
    <>
      <div className="ambient-background" aria-hidden="true" />
      <header className="site-header">
        <div className="nav-shell">
          <button
            className="brand"
            onClick={() => navigateTo("inicio")}
            aria-label="Voltar ao início"
          >
            <span>PH</span>
            <b>Paulo Coelho</b>
          </button>

          <nav
            id="primary-navigation"
            className={menuOpen ? "nav-links is-open" : "nav-links"}
            aria-label="Navegação principal"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                className={activeSection === item.id ? "active" : ""}
                aria-current={activeSection === item.id ? "location" : undefined}
                onClick={() => navigateTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="icon-button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={darkMode ? "Ativar tema claro" : "Ativar tema escuro"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="icon-button menu-button"
              id="menu-toggle"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero section">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="availability">
                <span className="status-dot" />
                Disponível para oportunidades
              </span>
              <p className="hero-kicker">Olá, eu sou</p>
              <h1>{profile.name}</h1>
              <h2>{profile.role}</h2>
              <p className="hero-summary">{profile.summary}</p>
              <blockquote>{profile.impactPhrase}</blockquote>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => navigateTo("projetos")}>
                  Ver projetos
                </button>
              </div>
              <div className="social-row">
                {socialLinks.map((social) =>
                  social.href ? (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                      <LinkIcon size={17} />
                      {social.label}
                    </a>
                  ) : (
                    <span className="social-placeholder" key={social.label}>
                      <LinkIcon size={17} />
                      {social.label}: configurar
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="portrait-wrap" aria-label="Espaço para fotografia profissional">
              <div className="portrait-frame">
                {profile.photoUrl ? (
                  <Image src={profile.photoUrl} alt={`Fotografia de ${profile.name}`} fill sizes="410px" priority />
                ) : (
                  <div className="portrait-placeholder">
                    <Code2 size={58} />
                    <span>Adicionar fotografia</span>
                  </div>
                )}
              </div>
              <div className="code-chip chip-one">{"<software />"}</div>
              <div className="code-chip chip-two">{"AI + Code"}</div>
            </div>
          </div>
        </section>

        <section id="sobre" className="section about-section">
          <div className="container">
            <div className="about-grid">
              <div>
                <SectionHeading
                  eyebrow="01 — Apresentação"
                  title="Sobre mim"
                  description="Uma trajetória construída com aprendizado contínuo, disciplina técnica e interesse em criar soluções úteis."
                />
                <p className="about-text">
                  Sou estudante de Engenharia da Computação na Universidade Ceuma, atualmente no 4º período.
                  Tenho direcionado meus estudos para desenvolvimento back-end com Java, programação orientada
                  a objetos e arquitetura de sistemas.
                </p>
                <p className="about-text">
                  Também estudo inteligência artificial, bancos de dados e segurança de dados, buscando unir
                  fundamentos sólidos a projetos práticos. Possuo experiência profissional como correspondente
                  bancário, com atendimento ao público e cadastramento de pessoas em sistemas.
                </p>
              </div>
              <aside className="about-profile-card">
                <span className="portrait-label">Fotografia profissional</span>
                <div className="about-portrait">
                  {profile.photoUrl ? (
                    <Image src={profile.photoUrl} alt={`Fotografia de ${profile.name}`} fill sizes="360px" />
                  ) : (
                    <div className="portrait-placeholder">
                      <Code2 size={46} />
                      <span>Adicionar fotografia</span>
                    </div>
                  )}
                </div>
                <div className="about-facts">
                  <div><span>Curso</span><b>Engenharia da Computação</b></div>
                  <div><span>Instituição</span><b>Universidade Ceuma</b></div>
                  <div><span>Foco atual</span><b>Java e IA</b></div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="projetos" className="section section-alt">
          <div className="container">
            <SectionHeading
              eyebrow="03 — Portfólio"
              title="Projetos"
              description="Seleção de soluções acadêmicas e práticas, com destaque para complexidade técnica e aprendizado."
            />
            <div className="project-carousel-shell">
              <button
                className="carousel-arrow"
                type="button"
                aria-label="Projetos anteriores"
                onClick={() => goToProjectPage(activeProjectPage - 1)}
                disabled={activeProjectPage === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <div
                className="project-viewport"
                role="region"
                aria-roledescription="carrossel"
                aria-label="Projetos em destaque"
                onTouchStart={(event) => {
                  swipeStartX.current = event.touches[0]?.clientX ?? null;
                  didSwipe.current = false;
                }}
                onTouchEnd={(event) => {
                  const startX = swipeStartX.current;
                  const endX = event.changedTouches[0]?.clientX;
                  swipeStartX.current = null;
                  if (startX === null || endX === undefined) return;

                  const distance = startX - endX;
                  if (Math.abs(distance) < 50) return;

                  didSwipe.current = true;
                  goToProjectPage(activeProjectPage + (distance > 0 ? 1 : -1));
                }}
                onClickCapture={(event) => {
                  if (!didSwipe.current) return;
                  event.preventDefault();
                  event.stopPropagation();
                  didSwipe.current = false;
                }}
              >
                <div
                  className="project-track"
                  style={{ transform: `translateX(-${activeProjectPage * 100}%)` }}
                >
                  {projectPages.map((pageProjects, pageIndex) => (
                    <div
                      className="project-page"
                      key={pageIndex}
                      role="group"
                      aria-roledescription="slide"
                      aria-hidden={pageIndex !== activeProjectPage}
                      inert={pageIndex !== activeProjectPage}
                      aria-label={`Página ${pageIndex + 1} de ${projectPages.length}`}
                    >
                      {pageProjects.map((project) => (
                        <article
                          className="project-card"
                          key={project.name}
                          role="button"
                          tabIndex={0}
                          aria-haspopup="dialog"
                          aria-label={`Ver detalhes do projeto ${project.name}`}
                          onClick={() => openProject(project)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              openProject(project);
                            }
                          }}
                        >
                          <div className="project-visual">
                            <div className="window-dots"><i /><i /><i /></div>
                            {project.imageUrl ? (
                              <Image src={project.imageUrl} alt={`Prévia do projeto ${project.name}`} fill sizes="(max-width: 720px) 100vw, 340px" />
                            ) : (
                              <>
                                <Code2 size={52} />
                                <span>Captura do projeto</span>
                              </>
                            )}
                          </div>
                          <div className="project-content">
                            <span className="project-status">{project.status}</span>
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                            <div className="tag-list">
                              {project.technologies.map((technology) => (
                                <span key={technology}>{technology}</span>
                              ))}
                            </div>
                            <span className="text-link">
                              Ver detalhes <span aria-hidden="true">→</span>
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="carousel-arrow"
                type="button"
                aria-label="Próximos projetos"
                onClick={() => goToProjectPage(activeProjectPage + 1)}
                disabled={activeProjectPage >= projectPages.length - 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="carousel-pagination" aria-label="Paginação dos projetos">
              {projectPages.map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  type="button"
                  className={`carousel-dot${pageIndex === activeProjectPage ? " is-active" : ""}`}
                  aria-label={`Ir para a página ${pageIndex + 1}`}
                  aria-current={pageIndex === activeProjectPage ? "step" : undefined}
                  onClick={() => goToProjectPage(pageIndex)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Tecnologias"
              title="Tecnologias que conheço"
              description="Linguagens, ferramentas e fundamentos que fazem parte dos meus estudos e projetos."
            />
            <div className="skills-grid">
              {skillCategories.map((category) => (
                category.skills.map((skill) => {
                  const icons = technologyIcons[skill.name] ?? [];
                  return (
                    <article className="skill-card" key={skill.name}>
                      <div className="skill-logo" aria-hidden="true">
                        {icons.length > 0 ? (
                          icons.map((icon) => (
                            <svg
                              key={icon.slug}
                              viewBox="0 0 24 24"
                              role="presentation"
                            >
                              <defs>
                                <linearGradient
                                  id={`skill-icon-gradient-${icon.slug}`}
                                  x1="0"
                                  y1="0"
                                  x2="24"
                                  y2="24"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#5c9bff" />
                                  <stop offset="1" stopColor="#a56bff" />
                                </linearGradient>
                              </defs>
                              <path
                                d={icon.path}
                                fill={`url(#skill-icon-gradient-${icon.slug})`}
                              />
                            </svg>
                          ))
                        ) : skill.name === "Java" ? (
                          <Coffee size={25} />
                        ) : skill.name === "SQL" ||
                          skill.name === "pgvector" ? (
                          <Database size={25} />
                        ) : (
                          <Code2 size={25} />
                        )}
                      </div>
                      <h3>{skill.name}</h3>
                      <p>{skill.description}</p>
                    </article>
                  );
                })
              ))}
            </div>
          </div>
        </section>

        <section id="formacao" className="section section-alt">
          <div className="container">
            <SectionHeading
              eyebrow="Trajetória"
              title="Formação acadêmica"
              description="Minha base educacional e atividades complementares."
            />
            <div className="timeline">
              {education.map((item) => (
                <article className="timeline-item" key={item.institution}>
                  <div className="timeline-marker"><GraduationCap size={19} /></div>
                  <div className="timeline-card">
                    <div className="timeline-meta">
                      <span>{item.startDate} — {item.expectedEnd}</span>
                      <b>{item.period}</b>
                    </div>
                    <h3>{item.course}</h3>
                    <h4>{item.institution}</h4>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="certificados" className="section">
          <div className="container">
            <SectionHeading
              eyebrow="06 — Aprendizado contínuo"
              title="Certificados"
              description="Espaço reservado para cursos e qualificações adicionados posteriormente."
            />
            <div className="certificate-grid">
              {certificates.length > 0 ? (
                certificates.map((certificate) => (
                  <article className="certificate-card" key={certificate.name}>
                    <div className="certificate-icon"><Award size={25} /></div>
                    <div>
                      <h3>{certificate.name}</h3>
                      <p className="certificate-institution">{certificate.institution}</p>
                      <p>{certificate.description}</p>
                      <div className="certificate-meta">
                        <span>{certificate.date}</span>
                        {certificate.workload && <span>{certificate.workload}</span>}
                      </div>
                      {certificate.validationUrl && (
                        <a href={certificate.validationUrl} target="_blank" rel="noreferrer" className="text-link">
                          Ver certificado →
                        </a>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <Award size={28} />
                  <div><b>Certificados em atualização</b><p>Os certificados reais serão exibidos assim que forem adicionados.</p></div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="interesses" className="section section-alt">
          <div className="container">
            <SectionHeading
              eyebrow="07 — Além do código"
              title="Interesses pessoais"
              description="Esta seção será preenchida com meus interesses pessoais quando as informações forem adicionadas."
            />
            <div className="hobbies-grid">
              {hobbies.length > 0 ? (
                hobbies.map((hobby) => (
                  <article className="hobby-card" key={hobby.name}>
                    <div className="hobby-icon"><Sparkles size={22} /></div>
                    <h3>{hobby.name}</h3>
                    <p>{hobby.description}</p>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <Sparkles size={28} />
                  <div><b>Espaço reservado</b><p>Nenhum hobby foi informado; nenhuma atividade foi inventada.</p></div>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      <footer>
        <div className="footer-shell">
          <p>© 2026 {profile.name}. Todos os direitos reservados.</p>
          <button onClick={() => navigateTo("inicio")}>Voltar ao topo</button>
        </div>
      </footer>

      {showTop && (
        <button className="back-to-top" onClick={() => navigateTo("inicio")} aria-label="Voltar ao topo">
          <ArrowUp size={19} />
        </button>
      )}

      {selectedProject && (
        <div
          className={`project-presentation-backdrop${isClosingProject ? " is-closing" : ""}`}
          role="presentation"
          onMouseDown={closeProject}
        >
          <div
            className={`project-presentation${isClosingProject ? " is-closing" : ""}`}
            ref={projectModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <section className="project-information">
              <button className="modal-close" onClick={closeProject} aria-label="Fechar detalhes">
                <X size={19} />
              </button>
              <span className="eyebrow">Projeto em destaque</span>
              <h2 id="project-modal-title">{selectedProject.name}</h2>
              <p className="project-presentation-description">{selectedProject.description}</p>
              <div className="project-details">
                <div><b>Objetivo</b><p>{selectedProject.objective}</p></div>
                <div><b>Participação</b><p>{selectedProject.participation}</p></div>
                <div>
                  <b>Tecnologias</b>
                  <div className="tag-list">
                    {selectedProject.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                  </div>
                </div>
                <div><b>Funcionalidades</b><ul>{selectedProject.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
              </div>
              <div className="modal-actions">
                {selectedProject.repositoryUrl && (
                  <a className="button button-primary" href={selectedProject.repositoryUrl} target="_blank" rel="noreferrer">
                    <LinkIcon size={17} /> Repositório
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a className="button button-secondary" href={selectedProject.demoUrl} target="_blank" rel="noreferrer">Ver demonstração</a>
                )}
              </div>
            </section>
            <section className="project-gallery" aria-label="Galeria de prévias ilustrativas">
              <div className="project-gallery-heading">
                <span>Visão do projeto</span>
                <span>{String(projectGalleryIndex + 1).padStart(2, "0")} / 03</span>
              </div>
              <div
                key={projectGalleryIndex}
                className={`project-gallery-art project-gallery-art-${projectGalleryIndex + 1}`}
                role="img"
                aria-label={`Prévia ilustrativa ${projectGalleryIndex + 1} de 3 para ${selectedProject.name}`}
              >
                <div className="gallery-window-bar" aria-hidden="true">
                  <span /><span /><span />
                  <b>PRÉVIA ILUSTRATIVA</b>
                </div>
                <div className="gallery-window-content" aria-hidden="true">
                  <div className="gallery-side-mark" />
                  <div className="gallery-content-main">
                    <div className="gallery-preview-kicker">
                      {projectGalleryIndex === 0 ? "PAINEL DO PROJETO" : projectGalleryIndex === 1 ? "VISÃO GERAL" : "DETALHES"}
                    </div>
                    <div className="gallery-preview-title">{selectedProject.name}</div>
                    {projectGalleryIndex === 0 ? (
                      <div className="gallery-dashboard">
                        <div className="gallery-stat"><span>STATUS</span><b>{selectedProject.status}</b></div>
                        <div className="gallery-stat"><span>TECNOLOGIAS</span><b>{selectedProject.technologies.length}</b></div>
                        <div className="gallery-chart"><i /><i /><i /><i /><i /><i /><i /></div>
                      </div>
                    ) : projectGalleryIndex === 1 ? (
                      <div className="gallery-list">
                        {selectedProject.features.slice(0, 3).map((feature, index) => (
                          <div className="gallery-list-row" key={feature}>
                            <span>0{index + 1}</span><b>{feature}</b><i />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="gallery-code">
                        <span>01</span><i /><b>{selectedProject.technologies[0] ?? "Projeto"}</b>
                        <span>02</span><i /><b>Organização e estrutura</b>
                        <span>03</span><i /><b>Solução em desenvolvimento</b>
                        <span>04</span><i /><b>Experiência clara e funcional</b>
                      </div>
                    )}
                    <div className="gallery-tech-list">
                      {selectedProject.technologies.slice(0, 3).map((technology) => <span key={technology}>{technology}</span>)}
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="gallery-arrow gallery-arrow-previous"
                type="button"
                aria-label="Prévia anterior"
                onClick={() => setProjectGalleryIndex((index) => (index + 2) % 3)}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="gallery-arrow gallery-arrow-next"
                type="button"
                aria-label="Próxima prévia"
                onClick={() => setProjectGalleryIndex((index) => (index + 1) % 3)}
              >
                <ChevronRight size={20} />
              </button>
              <div className="gallery-pagination" aria-label="Indicadores da galeria">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className={index === projectGalleryIndex ? "is-active" : ""}
                    type="button"
                    aria-label={`Mostrar prévia ${index + 1}`}
                    aria-current={index === projectGalleryIndex ? "true" : undefined}
                    onClick={() => setProjectGalleryIndex(index)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
