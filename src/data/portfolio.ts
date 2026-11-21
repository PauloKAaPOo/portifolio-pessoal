import type {
  Certificate,
  Education,
  Hobby,
  Project,
  SkillCategory,
  SocialLink,
} from "@/types/portfolio";

export const profile = {
  name: "Paulo Henrique de Freitas Coelho",
  role: "Estudante de Engenharia da Computação",
  location: "Brasil",
  email: "[INSERIR E-MAIL]",
  photoUrl: null as string | null,
  summary:
    "Estudante do 4º período de Engenharia da Computação na Universidade Ceuma, com foco em desenvolvimento Java, arquitetura de sistemas e inteligência artificial.",
  impactPhrase:
    "Construindo uma base sólida em software para transformar problemas reais em soluções bem organizadas.",
};

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: null },
  { label: "LinkedIn", href: null },
];

export const projects: Project[] = [
  {
    name: "Sistema de Presença das Ligas CEUMA",
    description:
      "Sistema para gerenciar presença em ligas acadêmicas por meio de reconhecimento facial e controle de reuniões.",
    objective:
      "Unificar o registro de participantes, reuniões e presenças em uma aplicação com recursos administrativos.",
    technologies: ["Python", "InsightFace", "PostgreSQL", "pgvector", "Docker"],
    features: [
      "Reconhecimento facial por embeddings",
      "Gerenciamento de reuniões e presenças",
      "Consulta de registros por liga",
      "Funcionalidades administrativas",
      "Sistema de notificações",
    ],
    participation:
      "Atuação no desenvolvimento da solução, integração de reconhecimento facial e organização dos dados.",
    status: "Em desenvolvimento",
  },
  {
    name: "Sistema de Reservas em Java",
    description:
      "Projeto de estudo voltado à modelagem orientada a objetos e gerenciamento de reservas.",
    objective:
      "Praticar POO e organização de responsabilidades por meio de um sistema com regras de negócio.",
    technologies: ["Java", "POO", "Coleções"],
    features: [
      "Modelagem de entidades",
      "Herança e classes abstratas",
      "Encapsulamento e enums",
      "Validações e regras de negócio",
      "Histórico e estados das reservas",
    ],
    participation:
      "Desenvolvimento individual com foco em abstração, organização de classes e controle de estados.",
    status: "Em desenvolvimento",
  },
  {
    name: "Projetos práticos em Java",
    description:
      "Coleção de exercícios para consolidar os fundamentos da linguagem e da programação orientada a objetos.",
    objective:
      "Aplicar conceitos de Java em problemas pequenos e bem definidos.",
    technologies: ["Java", "POO", "Enums", "Coleções"],
    features: [
      "Sistema de Cadastro de Alunos",
      "Sistema de Pedidos com Enum",
      "Sistema de Gerenciamento de Salários",
      "Construtores, encapsulamento e métodos",
      "Validações básicas",
    ],
    participation:
      "Implementação dos exercícios para evoluir fundamentos de Java e organização de código.",
    status: "Concluído",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Linguagens e fundamentos",
    skills: [
      { name: "Java", level: "Intermediário", description: "POO e desenvolvimento de aplicações em estudo." },
      { name: "C", description: "Conhecimentos acadêmicos, lógica e fundamentos de programação." },
      { name: "Python", description: "Utilizado no projeto de reconhecimento facial." },
      { name: "SQL", description: "Consultas e manipulação de dados." },
    ],
  },
  {
    title: "Back-end e sistemas",
    skills: [
      { name: "Spring Boot", level: "Básico", description: "Primeiros estudos em aplicações back-end." },
      { name: "Programação orientada a objetos", description: "Classes, objetos, responsabilidades e encapsulamento." },
      { name: "Herança e abstração", description: "Estruturação de hierarquias e polimorfismo." },
      { name: "Regras de negócio", description: "Validações e tratamento de exceções." },
    ],
  },
  {
    title: "Dados e inteligência artificial",
    skills: [
      { name: "MySQL", description: "Fundamentos de modelagem e consultas." },
      { name: "PostgreSQL", description: "Utilizado no projeto de presença das ligas." },
      { name: "pgvector", description: "Armazenamento e pesquisa de vetores." },
      { name: "InsightFace / buffalo_sc", description: "Reconhecimento facial e processamento de embeddings." },
      { name: "Ollama / Open WebUI", description: "Ambientes utilizados em experimentos com IA." },
    ],
  },
  {
    title: "Front-end e ferramentas",
    skills: [
      { name: "Next.js", description: "Framework utilizado na construção deste portfólio." },
      { name: "React", description: "Componentes e interfaces em estudo aplicado." },
      { name: "TypeScript", description: "Tipagem aplicada no desenvolvimento deste portfólio." },
      { name: "HTML / CSS", description: "Estruturação e estilização de interfaces." },
      { name: "Git / GitHub", description: "Versionamento e organização de código." },
      { name: "Docker", description: "Utilizado na integração do projeto de reconhecimento facial." },
    ],
  },
];

export const education: Education[] = [
  {
    institution: "Universidade Ceuma",
    course: "Engenharia da Computação",
    period: "4º período",
    startDate: "Graduação",
    description:
      "Formação com estudos em lógica de programação, orientação a objetos, bancos de dados, sistemas e desenvolvimento de software.",
  },
  {
    institution: "Liga LIA — Desenvolvimento e Aprendizagem de IA",
    course: "Atividade acadêmica",
    period: "Participação",
    startDate: "Liga acadêmica",
    description:
      "Participação em iniciativas relacionadas à inteligência artificial, reconhecimento facial e desenvolvimento de soluções acadêmicas.",
  },
];

export const certificates: Certificate[] = [];

export const hobbies: Hobby[] = [];
