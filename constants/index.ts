import { CreateAssistantDTO, CreateWorkflowDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

// Auth constants
export const AUTH_COOKIES = {
  SESSION: "session",
} as const;

export const SESSION_DURATION = 60 * 30 * 1; // * 7; //

export const COOKIE_OPTIONS = {
  maxAge: SESSION_DURATION,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
} as const;

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const getInterviewerConfig = (
  language: "en" | "es" = "en"
): CreateAssistantDTO => {
  const isSpanish = language === "es";

  const systemPrompt = isSpanish ? spanishSystemPrompt : englishSystemPrompt;

  return {
    name: isSpanish ? "Entrevistador" : "Interviewer",
    firstMessage: isSpanish ? spanishFirstMessage : englishFirstMessage,
    transcriber: {
      provider: "openai" as const,
      model: "gpt-4o-transcribe",
      language,
    },
    voice: {
      provider: "11labs" as const,
      voiceId: isSpanish ? "maria" : "sarah", // Different voice for Spanish
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 0.9,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai" as const,
      model: "gpt-4" as const,
      messages: [
        {
          role: "system" as const,
          content: systemPrompt,
        },
      ],
    },
  };
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];

// Prepare system prompt content per language to keep code clean and readable
const englishFirstMessage =
  `Hello! Thank you for taking the time to speak with me today.` +
  `I'm excited to learn more about you and your experience.`;
const englishSystemPrompt =
  `You are a professional job interviewer conducting a real-time voice interview with a candidate.` +
  `Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate's questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.

- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`;

const spanishFirstMessage =
  "¡Hola! Gracias por tomar el tiempo de hablar conmigo hoy." +
  "Estoy emocionado de conocer más sobre ti y tu experiencia.";
const spanishSystemPrompt = `Eres un entrevistador profesional de trabajo que realiza una entrevista de voz en tiempo real con un candidato.
Tu objetivo es evaluar sus calificaciones, motivación y ajuste para el puesto.

Pautas de la Entrevista:
Sigue el flujo estructurado de preguntas:
{{questions}}

Participa naturalmente y reacciona apropiadamente:
Escucha activamente las respuestas y reconócelas antes de continuar.
Haz preguntas de seguimiento breves si una respuesta es vaga o requiere más detalle.
Mantén la conversación fluyendo suavemente mientras mantienes el control.
Sé profesional, pero cálido y acogedor:

Usa un lenguaje oficial pero amigable.
Mantén las respuestas concisas y al punto (como en una entrevista de voz real).
Evita frases robóticas—suena natural y conversacional.
Responde las preguntas del candidato profesionalmente:

Si te preguntan sobre el puesto, la empresa o las expectativas, proporciona una respuesta clara y relevante.
Si no estás seguro, redirige al candidato a RRHH para más detalles.

Concluye la entrevista apropiadamente:
Agradece al candidato por su tiempo.
Infórmales que la empresa se pondrá en contacto pronto con retroalimentación.
Termina la conversación de manera educada y positiva.

- Asegúrate de ser profesional y educado.
- Mantén todas tus respuestas cortas y simples. Usa lenguaje oficial, pero sé amable y acogedor.
- Esta es una conversación de voz, así que mantén tus respuestas cortas, como en una conversación real. No te extiendas demasiado.`;

// export const generator: CreateWorkflowDTO = {
//   name: "Generator Interview",
//   nodes: [
//     {
//       name: "start",
//       type: "conversation",
//       isStart: true,
//       metadata: {
//         position: {
//           x: 0,
//           y: 0,
//         },
//       },
//       prompt:
//         "Speak first. Greet the user and help them create a new AI Interviewer",
//       voice: {
//         model: "aura-2",
//         voiceId: "thalia",
//         provider: "deepgram",
//       },
//       variableExtractionPlan: {
//         output: [
//           {
//             title: "level",
//             description: "The job experience level.",
//             type: "string",
//             enum: ["entry", "mid", "senior"],
//           },
//           {
//             title: "amount",
//             description: "How many questions would you like to generate?",
//             type: "number",
//             enum: [],
//           },
//           {
//             title: "techstack",
//             description:
//               "A list of technologies to cover during the job interview. For example, React, Next.js, Express.js, Node and so on...",
//             type: "string",
//             enum: [],
//           },
//           {
//             title: "role",
//             description:
//               "What role should would you like to train for? For example Frontend, Backend, Fullstack, Design, UX?",
//             type: "string",
//             enum: [],
//           },
//           {
//             title: "type",
//             description: "What type of the interview should it be? ",
//             type: "string",
//             enum: ["behavioural", "technical", "mixed"],
//           },
//         ],
//       },
//     },
//     {
//       name: "apiRequest_1747470739045",
//       type: "apiRequest",
//       metadata: {
//         position: {
//           x: -16.075937072883846,
//           y: 703.623428447121,
//         },
//       },
//       method: "POST",
//       url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/generate`,
//       headers: {
//         type: "object",
//         properties: {},
//       },
//       body: {
//         type: "object",
//         properties: {
//           role: {
//             type: "string",
//             description: "",
//             value: "{{ role }}",
//           },
//           level: {
//             type: "string",
//             description: "",
//             value: "{{ level }}",
//           },
//           type: {
//             type: "string",
//             description: "",
//             value: "{{ type }}",
//           },
//           amount: {
//             type: "number",
//             description: "",
//             value: "{{ amount }}",
//           },
//           userid: {
//             type: "string",
//             description: "",
//             value: "{{ userid }}",
//           },
//           techstack: {
//             type: "string",
//             description: "",
//             value: "{{ techstack }}",
//           },
//         },
//       },
//       output: {
//         type: "object",
//         properties: {
//           success: {
//             type: "boolean",
//             description: "Whether the API request was successful",
//           },
//           message: {
//             type: "string",
//             description: "Response message from the API",
//           },
//         },
//       },
//       mode: "blocking",
//       hooks: [],
//     },
//     {
//       name: "conversation_1747721261435",
//       type: "conversation",
//       metadata: {
//         position: {
//           x: -17.547788169718615,
//           y: 1003.3409337989506,
//         },
//       },
//       prompt:
//         "Thank the user for the conversation and inform them that the interview was generated successfully.",
//       voice: {
//         provider: "deepgram",
//         voiceId: "thalia",
//         model: "aura-2",
//       },
//     },
//     {
//       name: "conversation_1747744490967",
//       type: "conversation",
//       metadata: {
//         position: {
//           x: -11.165436030430953,
//           y: 484.94857971060617,
//         },
//       },
//       prompt: "Say that the Interview will be generated shortly.",
//       voice: {
//         provider: "deepgram",
//         voiceId: "thalia",
//         model: "aura-2",
//       },
//     },
//     {
//       name: "hangup_1747744730181",
//       type: "hangup",
//       metadata: {
//         position: {
//           x: 76.01267674000721,
//           y: 1272.0665127156606,
//         },
//       },
//     },
//   ],
//   edges: [
//     {
//       from: "apiRequest_1747470739045",
//       to: "conversation_1747721261435",
//       condition: {
//         type: "ai",
//         prompt: "",
//       },
//     },
//     {
//       from: "start",
//       to: "conversation_1747744490967",
//       condition: {
//         type: "ai",
//         prompt: "If user provided all the required variables",
//       },
//     },
//     {
//       from: "conversation_1747744490967",
//       to: "apiRequest_1747470739045",
//       condition: {
//         type: "ai",
//         prompt: "",
//       },
//     },
//     {
//       from: "conversation_1747721261435",
//       to: "hangup_1747744730181",
//       condition: {
//         type: "ai",
//         prompt: "",
//       },
//     },
//   ],
// };

// export const interviewer: CreateAssistantDTO = {
//   name: "Interviewer",
//   firstMessage:
//     "Hello! Thank you for taking the time to speak with me today." +
//     "I'm excited to learn more about you and your experience.",
//   transcriber: {
//     provider: "openai",
//     model: "gpt-4o-transcribe",
//     language: "en",
//   },
//   voice: {
//     provider: "11labs",
//     voiceId: "sarah",
//     stability: 0.4,
//     similarityBoost: 0.8,
//     speed: 0.9,
//     style: 0.5,
//     useSpeakerBoost: true,
//   },
//   model: {
//     provider: "openai",
//     model: "gpt-4",
//     messages: [
//       {
//         role: "system",
//         content:
//           `You are a professional job interviewer conducting a ` +
//           `real-time voice interview with a candidate. Your goal is` +
//           `to assess their qualifications, motivation, and fit for the role.

// Interview Guidelines:
// Follow the structured question flow:
// {{questions}}

// Engage naturally & react appropriately:
// Listen actively to responses and acknowledge them before moving forward.
// Ask brief follow-up questions if a response is vague or requires more detail.
// Keep the conversation flowing smoothly while maintaining control.
// Be professional, yet warm and welcoming:

// Use official yet friendly language.
// Keep responses concise and to the point (like in a real voice interview).
// Avoid robotic phrasing—sound natural and conversational.
// Answer the candidate’s questions professionally:

// If asked about the role, company, or expectations, provide a clear and relevant answer.
// If unsure, redirect the candidate to HR for more details.

// Conclude the interview properly:
// Thank the candidate for their time.
// Inform them that the company will reach out soon with feedback.
// End the conversation on a polite and positive note.

// - Be sure to be professional and polite.
// - Keep all your responses short and simple. Use official language, but be kind and welcoming.
// - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
//       },
//     ],
//   },
// };
