export type SocialLink = {
  label: string;
  href: string | null;
};

export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  coverImage?: string;
  objective: string;
  technologies: string[];
  features: string[];
  participation: string;
  slides: [ProjectSlide, ProjectSlide, ProjectSlide];
  status: "Em desenvolvimento" | "Concluído";
  repositoryUrl?: string;
  demoUrl?: string;
};

export type ProjectSlide = {
  imagem: string | null;
  tituloEtapa: string;
  oQueRepresenta: string;
  comoFunciona: string;
  tecnologias: string[];
};

export type Skill = {
  name: string;
  description: string;
};

export type SkillCategory = {
  title: string;
  skills: Skill[];
};

export type Education = {
  institution: string;
  course: string;
  period: string;
  startDate: string;
  expectedEnd?: string;
  description: string;
};

export type Certificate = {
  name: string;
  institution: string;
  date: string;
  workload?: string;
  description: string;
  imageUrl?: string;
  validationUrl?: string;
};

export type Hobby = {
  name: string;
  description: string;
  imageUrl?: string;
};
