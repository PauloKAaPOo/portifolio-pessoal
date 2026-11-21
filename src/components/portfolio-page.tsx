"use client";

import Image from "next/image";
import {
  ArrowUp,
  Award,
  Code2,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  Menu,
  Moon,
  MapPin,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
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

const navItems = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "skills", label: "Skills" },
  { id: "formacao", label: "Formação" },
  { id: "certificados", label: "Certificados" },
  { id: "interesses", label: "Interesses" },
  { id: "contato", label: "Contato" },
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
  const [contactStatus, setContactStatus] = useState("");

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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      setContactStatus("Preencha todos os campos antes de continuar.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactStatus("Informe um e-mail válido.");
      return;
    }
    if (!profile.email || profile.email.startsWith("[INSERIR")) {
      setContactStatus("Informe um endereço de e-mail antes de ativar o formulário.");
      return;
    }

    const mailBody = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      "",
      message,
    ].join("\n");
    setContactStatus("Abrindo seu aplicativo de e-mail...");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
  };

  return (
    <>
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

          <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Navegação principal">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={activeSection === item.id ? "active" : ""}
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
              onClick={() => setMenuOpen((current) => !current)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
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
                <button className="button button-secondary" onClick={() => navigateTo("contato")}>
                  Entrar em contato
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
            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.name}>
                  <div className="project-visual">
                    <div className="window-dots"><i /><i /><i /></div>
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={`Prévia do projeto ${project.name}`} fill sizes="(max-width: 720px) 100vw, 580px" />
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
                    <button className="text-link" onClick={() => setSelectedProject(project)}>
                      Ver detalhes <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Tecnologias"
              title="Skills e conhecimentos"
              description="Competências organizadas por área, preparadas para atualização contínua."
            />
            <div className="skills-grid">
              {skillCategories.map((category) => (
                <article className="skill-card" key={category.title}>
                  <div className="card-icon"><Code2 size={20} /></div>
                  <h3>{category.title}</h3>
                  {category.skills.map((skill) => (
                    <div className="skill-item" key={skill.name}>
                      <div>
                        <b>{skill.name}</b>
                        {skill.level && <span>{skill.level}</span>}
                      </div>
                      <p>{skill.description}</p>
                    </div>
                  ))}
                </article>
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

        <section id="contato" className="section contact-section">
          <div className="container">
            <SectionHeading
              eyebrow="Conecte-se"
              title="Vamos conversar"
              description="Tem uma oportunidade ou projeto em mente? Envie uma mensagem."
            />
            <div className="contact-grid">
              <div className="contact-details">
                <h3>Informações de contato</h3>
                <p>Os dados reais serão publicados após serem informados.</p>
                <div className="contact-list">
                  {profile.email.startsWith("[INSERIR") ? (
                    <div><Mail size={18} /><span><b>E-mail</b>Configurar e-mail</span></div>
                  ) : (
                    <a href={`mailto:${profile.email}`}><Mail size={18} /><span><b>E-mail</b>{profile.email}</span></a>
                  )}
                  {profile.location && (
                    <div><MapPin size={18} /><span><b>Localização</b>{profile.location}</span></div>
                  )}
                  {socialLinks.map((social) =>
                    social.href ? (
                      <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                        <LinkIcon size={18} />
                        <span><b>{social.label}</b>{social.href}</span>
                      </a>
                    ) : (
                      <div key={social.label}>
                        <LinkIcon size={18} />
                        <span><b>{social.label}</b>Configurar URL</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <form className="contact-form" onSubmit={submitContact} noValidate>
                <div className="form-row">
                  <label>
                    Nome
                    <input name="name" type="text" placeholder="Seu nome" required />
                  </label>
                  <label>
                    E-mail
                    <input name="email" type="email" placeholder="seu@email.com" required />
                  </label>
                </div>
                <label>
                  Assunto
                  <input name="subject" type="text" placeholder="Assunto da mensagem" required />
                </label>
                <label>
                  Mensagem
                  <textarea name="message" rows={5} placeholder="Escreva sua mensagem" required />
                </label>
                <button className="button button-primary" type="submit">Enviar mensagem</button>
                {contactStatus && <p className="form-status" role="status">{contactStatus}</p>}
                <small>O formulário abre o aplicativo de e-mail configurado no dispositivo.</small>
              </form>
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
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedProject(null)}>
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes do projeto ${selectedProject.name}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Fechar detalhes">
              <X size={19} />
            </button>
            <span className="eyebrow">Projeto em destaque</span>
            <h2>{selectedProject.name}</h2>
            <p>{selectedProject.description}</p>
            <div className="modal-grid">
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
          </div>
        </div>
      )}
    </>
  );
}
