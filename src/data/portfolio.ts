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
    id: "presenca-ligas-ceuma",
    name: "Sistema de Presença das Ligas CEUMA",
    category: "Sistema acadêmico",
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
    slides: [
      {
        imagem: null,
        tituloEtapa: "Cadastro e identificação da liga",
        oQueRepresenta:
          "A organização das ligas e dos participantes que poderão registrar presença nas reuniões.",
        comoFunciona:
          "A equipe administrativa mantém os dados da liga e dos participantes; esses registros dão contexto às reuniões e às consultas de presença.",
        tecnologias: ["Python", "PostgreSQL"],
      },
      {
        imagem: null,
        tituloEtapa: "Reconhecimento facial",
        oQueRepresenta:
          "A etapa de identificação do participante por meio da captura e análise facial.",
        comoFunciona:
          "A captura é processada para gerar embeddings, que são comparados com os registros cadastrados para apoiar o reconhecimento do participante.",
        tecnologias: ["Python", "InsightFace", "pgvector"],
      },
      {
        imagem: null,
        tituloEtapa: "Reuniões e registros de presença",
        oQueRepresenta:
          "O acompanhamento de reuniões e das presenças associadas a cada liga.",
        comoFunciona:
          "Os registros de presença ficam relacionados à reunião e à liga, permitindo que a equipe consulte o histórico e acompanhe os participantes.",
        tecnologias: ["PostgreSQL", "pgvector", "Docker"],
      },
    ],
    status: "Em desenvolvimento",
  },
  {
    id: "busca-pos-graduacao",
    name: "Plataforma de busca de pós-graduação",
    category: "Plataforma educacional",
    description:
      "Plataforma para organizar e facilitar a descoberta de oportunidades de especialização, mestrado e doutorado no Brasil e no exterior.",
    objective:
      "Estruturar informações sobre instituições e programas acadêmicos para facilitar a busca e a comparação de oportunidades nacionais e internacionais.",
    technologies: ["Java", "Spring Boot", "MySQL", "SQL", "IntelliJ IDEA"],
    features: [
      "Levantamento e especificação de requisitos",
      "Modelagem orientada a objetos e banco de dados",
      "Organização de instituições e programas acadêmicos",
      "Busca por oportunidades de especialização, mestrado e doutorado",
      "Descoberta de instituições via APIs e IA generativa como possibilidades de expansão",
    ],
    participation:
      "Participei do planejamento e desenvolvimento da solução, definição de requisitos e funcionalidades, estruturação de casos de uso, elaboração do diagrama de classes e modelagem do banco de dados.",
    slides: [
      {
        imagem: null,
        tituloEtapa: "Exploração de oportunidades",
        oQueRepresenta:
          "A entrada da plataforma, voltada à descoberta de programas de especialização, mestrado e doutorado.",
        comoFunciona:
          "A pessoa inicia a busca e informa critérios para encontrar oportunidades acadêmicas organizadas na plataforma.",
        tecnologias: ["Java", "Spring Boot"],
      },
      {
        imagem: null,
        tituloEtapa: "Busca e comparação de programas",
        oQueRepresenta:
          "A consulta aos programas e instituições encontrados de acordo com os critérios escolhidos.",
        comoFunciona:
          "Os dados estruturados de instituições e programas ajudam a filtrar resultados e comparar oportunidades nacionais e internacionais.",
        tecnologias: ["Java", "Spring Boot", "MySQL"],
      },
      {
        imagem: null,
        tituloEtapa: "Organização acadêmica",
        oQueRepresenta:
          "As informações de uma instituição e seus programas reunidas para apoiar a avaliação de uma oportunidade.",
        comoFunciona:
          "A plataforma relaciona instituições a programas de pós-graduação e centraliza os dados relevantes para a consulta.",
        tecnologias: ["Java", "MySQL", "SQL"],
      },
    ],
    status: "Em desenvolvimento",
  },
  {
    id: "estudos-java-ia",
    name: "Plataforma de estudos Java com IA",
    category: "Plataforma de estudos",
    description:
      "Plataforma pessoal de aprendizagem que reúne questões de Java, prática de programação, uma IDE integrada e assistência de inteligência artificial.",
    objective:
      "Apoiar o aprendizado aprofundado de Java em um ambiente único que conecta estudo teórico, resolução de questões e prática de código.",
    technologies: ["Java", "Spring Boot", "MySQL", "SQL", "Ollama", "IntelliJ IDEA"],
    features: [
      "Banco de questões para estudar e revisar Java",
      "Ambiente para praticar programação",
      "IDE integrada para escrever, editar e testar códigos Java",
      "Agente de IA integrado com Ollama para apoiar o estudante",
      "Integração entre teoria, exercícios e prática de código",
    ],
    participation:
      "Desenvolvimento solo da proposta e da plataforma, integrando recursos de estudo, prática de programação e assistência inteligente. O escopo atual é focado exclusivamente em Java.",
    slides: [
      {
        imagem: null,
        tituloEtapa: "Trilha de estudos",
        oQueRepresenta:
          "A organização dos conteúdos e questões para estudar e revisar fundamentos de Java.",
        comoFunciona:
          "A pessoa escolhe um tópico, consulta o material e usa o banco de questões para praticar e reforçar o conteúdo.",
        tecnologias: ["Java", "Spring Boot", "MySQL"],
      },
      {
        imagem: null,
        tituloEtapa: "Prática de programação",
        oQueRepresenta:
          "O espaço de exercício de código Java integrado à experiência de aprendizagem.",
        comoFunciona:
          "O estudante escreve e testa soluções no ambiente de prática, conectando os conceitos estudados à implementação.",
        tecnologias: ["Java", "Spring Boot"],
      },
      {
        imagem: null,
        tituloEtapa: "Assistência de IA",
        oQueRepresenta:
          "O apoio inteligente disponível durante o estudo e a prática de Java.",
        comoFunciona:
          "O agente integrado com Ollama auxilia o estudante com dúvidas enquanto teoria, questões e código permanecem no mesmo fluxo.",
        tecnologias: ["Java", "Ollama", "MySQL"],
      },
    ],
    status: "Em desenvolvimento",
  },
  {
    id: "reservas-java",
    name: "Sistema de Reservas em Java",
    category: "Sistema de reservas",
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
    slides: [
      {
        imagem: null,
        tituloEtapa: "Cadastro de reservas",
        oQueRepresenta: "A criação de reservas e o registro de seus dados principais.",
        comoFunciona:
          "As entidades e seus construtores organizam os dados necessários antes da aplicação das regras de negócio.",
        tecnologias: ["Java", "POO"],
      },
      {
        imagem: null,
        tituloEtapa: "Validação de regras",
        oQueRepresenta: "A verificação das condições necessárias para gerenciar uma reserva.",
        comoFunciona:
          "As regras e validações controlam as operações e usam estados definidos para manter o comportamento consistente.",
        tecnologias: ["Java", "Enums"],
      },
      {
        imagem: null,
        tituloEtapa: "Histórico e estados",
        oQueRepresenta: "A consulta ao histórico e ao estado atual das reservas.",
        comoFunciona:
          "As coleções reúnem os registros e permitem acompanhar a evolução de cada reserva.",
        tecnologias: ["Java", "Coleções", "Enums"],
      },
    ],
    status: "Em desenvolvimento",
  },
  {
    id: "projetos-praticos-java",
    name: "Projetos práticos em Java",
    category: "Projetos de estudo",
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
    slides: [
      {
        imagem: null,
        tituloEtapa: "Cadastro de alunos",
        oQueRepresenta: "O registro e a organização de dados de alunos.",
        comoFunciona:
          "Classes e métodos agrupam os dados e as operações de cadastro, com validações básicas.",
        tecnologias: ["Java", "POO"],
      },
      {
        imagem: null,
        tituloEtapa: "Pedidos e enums",
        oQueRepresenta: "A representação dos pedidos e de seus valores definidos.",
        comoFunciona:
          "Enums restringem as opções válidas e deixam explícitas as alternativas usadas pelo sistema de pedidos.",
        tecnologias: ["Java", "Enums"],
      },
      {
        imagem: null,
        tituloEtapa: "Gerenciamento de salários",
        oQueRepresenta: "A organização de dados e operações relacionadas aos salários.",
        comoFunciona:
          "Construtores, encapsulamento e métodos mantêm os dados organizados e aplicam operações de forma controlada.",
        tecnologias: ["Java", "POO", "Coleções"],
      },
    ],
    status: "Concluído",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Linguagens e fundamentos",
    skills: [
      { name: "Java", description: "POO e desenvolvimento de aplicações em estudo." },
      { name: "C", description: "Conhecimentos acadêmicos, lógica e fundamentos de programação." },
      { name: "Python", description: "Utilizado no projeto de reconhecimento facial." },
      { name: "SQL", description: "Consultas e manipulação de dados." },
    ],
  },
  {
    title: "Back-end e sistemas",
    skills: [
      { name: "Spring Boot", description: "Primeiros estudos em aplicações back-end." },
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
