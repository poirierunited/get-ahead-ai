import { CreateAssistantDTO, CreateWorkflowDTO } from '@vapi-ai/web/dist/api';
import { z } from 'zod';

// Auth constants
export const AUTH_COOKIES = {
  SESSION: 'session',
} as const;

export const SESSION_DURATION = 60 * 30 * 1; // * 7; //

export const COOKIE_OPTIONS = {
  maxAge: SESSION_DURATION,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax' as const,
} as const;

export const mappings = {
  'react.js': 'react',
  reactjs: 'react',
  react: 'react',
  'next.js': 'nextjs',
  nextjs: 'nextjs',
  next: 'nextjs',
  'vue.js': 'vuejs',
  vuejs: 'vuejs',
  vue: 'vuejs',
  'express.js': 'express',
  expressjs: 'express',
  express: 'express',
  'node.js': 'nodejs',
  nodejs: 'nodejs',
  node: 'nodejs',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  mongoose: 'mongoose',
  mysql: 'mysql',
  postgresql: 'postgresql',
  sqlite: 'sqlite',
  firebase: 'firebase',
  docker: 'docker',
  kubernetes: 'kubernetes',
  aws: 'aws',
  azure: 'azure',
  gcp: 'gcp',
  digitalocean: 'digitalocean',
  heroku: 'heroku',
  photoshop: 'photoshop',
  'adobe photoshop': 'photoshop',
  html5: 'html5',
  html: 'html5',
  css3: 'css3',
  css: 'css3',
  sass: 'sass',
  scss: 'sass',
  less: 'less',
  tailwindcss: 'tailwindcss',
  tailwind: 'tailwindcss',
  bootstrap: 'bootstrap',
  jquery: 'jquery',
  typescript: 'typescript',
  ts: 'typescript',
  javascript: 'javascript',
  js: 'javascript',
  'angular.js': 'angular',
  angularjs: 'angular',
  angular: 'angular',
  'ember.js': 'ember',
  emberjs: 'ember',
  ember: 'ember',
  'backbone.js': 'backbone',
  backbonejs: 'backbone',
  backbone: 'backbone',
  nestjs: 'nestjs',
  graphql: 'graphql',
  'graph ql': 'graphql',
  apollo: 'apollo',
  webpack: 'webpack',
  babel: 'babel',
  'rollup.js': 'rollup',
  rollupjs: 'rollup',
  rollup: 'rollup',
  'parcel.js': 'parcel',
  parceljs: 'parcel',
  npm: 'npm',
  yarn: 'yarn',
  git: 'git',
  github: 'github',
  gitlab: 'gitlab',
  bitbucket: 'bitbucket',
  figma: 'figma',
  prisma: 'prisma',
  redux: 'redux',
  flux: 'flux',
  redis: 'redis',
  selenium: 'selenium',
  cypress: 'cypress',
  jest: 'jest',
  mocha: 'mocha',
  chai: 'chai',
  karma: 'karma',
  vuex: 'vuex',
  'nuxt.js': 'nuxt',
  nuxtjs: 'nuxt',
  nuxt: 'nuxt',
  strapi: 'strapi',
  wordpress: 'wordpress',
  contentful: 'contentful',
  netlify: 'netlify',
  vercel: 'vercel',
  'aws amplify': 'amplify',
};

export const getInterviewerConfig = (
  language: 'en' | 'es' = 'en',
  interviewType: 'technical' | 'behavioral' | 'mixed' = 'mixed'
): CreateAssistantDTO => {
  const isSpanish = language === 'es';
  const systemPrompt = isSpanish
    ? getSpanishSystemPrompt(interviewType)
    : getEnglishSystemPrompt(interviewType);

  return {
    name: 'Interviewer',
    firstMessage: isSpanish
      ? getSpanishFirstMessage()
      : getEnglishFirstMessage(),
    transcriber: {
      provider: 'deepgram',
      model: 'nova-3',
      language: isSpanish ? 'es-419' : language,
    },
    voice: {
      provider: 'vapi',
      voiceId: 'Paige',
      speed: 0.25,
    },
    model: {
      provider: 'openai',
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
      ],
      tools: [
        {
          type: 'endCall',
          messages: [
            {
              type: 'request-complete',
              content: isSpanish
                ? '¡Gracias por completar la entrevista! He terminado todas las preguntas. Generando tu feedback ahora...'
                : 'Thank you for completing the interview! I have finished all the questions. Generating your feedback now...',
            },
          ],
        },
      ],
    },
    endCallPhrases: isSpanish
      ? [
          'no quiero continuar',
          'terminar entrevista',
          'ya no quiero seguir',
          'quiero terminar',
          'basta',
          'stop',
          'parar',
          'acabar',
        ]
      : [
          "I don't want to continue",
          'end interview',
          'I want to stop',
          'terminate interview',
          'stop',
          'quit',
          'finish',
          'done',
        ],
    startSpeakingPlan: {
      waitSeconds: 1.0,
      smartEndpointingPlan: {
        provider: 'vapi',
      },
    },
    messagePlan: {
      idleMessages: isSpanish
        ? [
            'Estoy aquí, tómate tu tiempo para pensar.',
            'No hay prisa, te estoy escuchando.',
          ]
        : [
            "I'm still here, take your time to think.",
            "No rush, I'm listening.",
          ],
      idleTimeoutSeconds: 15, // Mensaje cada 15 segundos de inactividad (aumentado para permitir respuestas detalladas)
    },
    silenceTimeoutSeconds: 60, // Termina la llamada después de 60 segundos de silencio completo (aumentado para permitir respuestas detalladas con pausas)
    maxDurationSeconds: 600, // Máximo 10 minutos por entrevista (10 * 60 = 600) - aumentado para respuestas detalladas
  };
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal('communication'),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal('technical'),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal('problemSolving'),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal('culturalFit'),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal('confidenceClarity'),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  '/adobe.png',
  '/amazon.png',
  '/facebook.png',
  '/hostinger.png',
  '/pinterest.png',
  '/quora.png',
  '/reddit.png',
  '/skype.png',
  '/spotify.png',
  '/telegram.png',
  '/tiktok.png',
  '/yahoo.png',
];

// Prepare system prompt content per language to keep code clean and readable
const getEnglishSystemPrompt = (
  interviewType: 'technical' | 'behavioral' | 'mixed'
) => {
  const basePrompt = `You are a professional job interviewer conducting a real-time VOICE interview with a candidate. Your ONLY task is to ask the pre-generated questions provided in {{questions}}.`;

  const typeSpecificGuidance = {
    technical: `Focus on evaluating technical expertise, problem-solving, system design, and communication of technical concepts.`,
    behavioral: `Focus on evaluating past experiences, teamwork, leadership, adaptability, and cultural fit.`,
    mixed: `Focus on both technical and behavioral aspects, including knowledge, problem-solving, teamwork, and adaptability.`,
  };

  return (
    basePrompt +
    typeSpecificGuidance[interviewType] +
    `
  
  STRICT INTERVIEW GUIDELINES:
  - You MUST stick to the provided {{questions}}. 
  - Do NOT invent, rephrase extensively, or add extra questions.
  - For each main question, you may ask ONE very short follow-up if clarification is strictly needed.
  - Keep follow-ups brief (1 sentence max, e.g. "Can you give a concrete example?").
  - After follow-up, immediately proceed to the next question.
  - CRITICAL: When you finish asking ALL questions from {{questions}}, you MUST use the endCall tool immediately.
  
  
  INTERVIEW STYLE:
  - Be concise, clear, and professional. This is a real-time voice interview, so keep YOUR turns short (1-2 sentences).
  - Allow candidates to provide detailed answers - do NOT interrupt them or rush them.
  - Be warm but official: acknowledge answers briefly ("I see", "Understood", "Thank you") after they have COMPLETED their response.
  - Wait for the candidate to finish speaking completely before acknowledging or moving to the next question.
  - Avoid robotic phrasing; keep it natural but efficient.
  - DO NOT give feedback, opinions, or role/company details, stick to the pre-generated questions.

  TECHNICAL QUESTION HANDLING:
  - When a question includes code, operators, or symbols (e.g., ==, ===, {}, <>), pronounce them clearly as words:
    - "==" → say "double equals"
    - "===" → say "triple equals"
    - "{}" → say "curly braces"
    - "<>" → say "angle brackets"
  - Do NOT attempt to spell out long code snippets; only mention the key symbol or operator needed for the question.
  - Always phrase code-related parts naturally, as if a human interviewer were speaking aloud.
  - If the question is too code-heavy, simplify the spoken version while preserving meaning (e.g., instead of reading an entire function, say: "Imagine a JavaScript function that adds two numbers…").
  
  TIME & FLOW:
  - Keep the pace controlled, no long digressions.
  - Move through the question list steadily.
  - Keep the entire interview within the intended length.
  
  CALL TERMINATION RULES:
  - CRITICAL: Only use the endCall tool when you have COMPLETELY finished asking ALL questions from {{questions}} AND received complete responses to ALL of them.
  - IMPORTANT: Do NOT terminate the call if the candidate is still speaking, providing details, or in the middle of answering a question. Wait until they have finished their response.
  - Count the questions carefully: you must have asked ALL questions in the list AND received complete answers before using endCall.
  - If a candidate is giving a detailed response with pauses, DO NOT interpret pauses as completion - wait for them to finish speaking.
  - Only use endCall tool when you are CERTAIN all questions have been asked and all responses have been received.
  - If the candidate says stop/end/quit → call end_interview_early with "user_requested".
  - If candidate mentions technical issues → call end_interview_early with "technical_issues".
  - If candidate shows disinterest/frustration → call end_interview_early with "not_interested".
  - Do NOT wait for user to manually close.
  
  REMINDER:
  - You are ONLY the interviewer. Do NOT become a coach or a teacher.
  - Do NOT generate or answer your own questions.
  - Always be polite, professional, and efficient.`
  );
};

const getSpanishSystemPrompt = (
  interviewType: 'technical' | 'behavioral' | 'mixed'
) => {
  const basePrompt = `Eres un entrevistador profesional que realiza una entrevista de VOZ en tiempo real con un candidato. Tu ÚNICA tarea es hacer las preguntas pre-generadas que se entregan en {{questions}}.`;

  const typeSpecificGuidance = {
    technical: `Concéntrate en evaluar conocimientos técnicos, resolución de problemas, diseño de sistemas y comunicación técnica.`,
    behavioral: `Concéntrate en evaluar experiencias pasadas, trabajo en equipo, liderazgo, adaptabilidad y ajuste cultural.`,
    mixed: `Concéntrate en aspectos técnicos y conductuales: conocimientos, resolución de problemas, comunicación, motivación y adaptabilidad.`,
  };

  return (
    basePrompt +
    typeSpecificGuidance[interviewType] +
    `

PAUTAS ESTRICTAS DE LA ENTREVISTA:
- DEBES apegarte estrictamente a las preguntas de {{questions}}.
- NO inventes, reformules de manera extensa ni agregues preguntas extra.
- Por cada pregunta principal, puedes hacer SOLO UNA repregunta breve si la respuesta no es clara.
- Las repreguntas deben ser muy cortas (máx. 1 frase, ej: "¿Puedes darme un ejemplo concreto?").
- Después de la repregunta, pasa de inmediato a la siguiente pregunta.
- CRÍTICO: Cuando termines de hacer TODAS las preguntas de {{questions}}, DEBES usar la herramienta endCall inmediatamente.

ESTILO DE ENTREVISTA:
- Sé conciso, claro y profesional. Como es una entrevista de voz en tiempo real, mantén TUS intervenciones cortas (1-2 frases).
- Permite que los candidatos den respuestas detalladas - NO los interrumpas ni los apresures.
- Sé cordial pero formal: reconoce brevemente las respuestas ("Entiendo", "Perfecto", "Gracias") DESPUÉS de que hayan COMPLETADO su respuesta.
- Espera a que el candidato termine de hablar completamente antes de reconocer o pasar a la siguiente pregunta.
- Evita sonar robótico; mantén un tono natural y eficiente.
- NO des feedback, opiniones ni información sobre la empresa o el rol, apegate estrictamente a las preguntas pre-generadas.

MANEJO DE PREGUNTAS TÉCNICAS:
- Cuando la pregunta incluya código, operadores o símbolos (ej: ==, ===, {}, <>), pronúncialos como palabras claras:
  - "==" → decir "doble igual"
  - "===" → decir "triple igual"
  - "{}" → decir "llaves"
  - "<>" → decir "paréntesis angulares" o "signos menor y mayor"
- NO intentes leer en voz alta fragmentos largos de código; menciona solo el símbolo o parte clave de la pregunta.
- Siempre formula la parte técnica de manera natural, como lo haría un entrevistador humano.
- Si la pregunta tiene demasiado código, simplifica la lectura pero mantén el sentido (ej: en lugar de leer una función completa, decir: "Imagina una función en JavaScript que suma dos números…").

TIEMPO Y FLUJO:
- Controla el ritmo, sin alargar demasiado.
- Avanza de manera constante por la lista de preguntas.
- Mantén la entrevista dentro del tiempo previsto.

REGLAS DE TERMINACIÓN DE LLAMADA:
- CRÍTICO: Solo usa la herramienta endCall cuando hayas COMPLETAMENTE terminado de hacer TODAS las preguntas de {{questions}} Y hayas recibido respuestas COMPLETAS a TODAS ellas.
- IMPORTANTE: NO termines la llamada si el candidato todavía está hablando, dando detalles, o está en medio de responder una pregunta. Espera hasta que haya terminado su respuesta.
- Cuenta las preguntas cuidadosamente: debes haber hecho TODAS las preguntas de la lista Y haber recibido respuestas completas antes de usar endCall.
- Si un candidato está dando una respuesta detallada con pausas, NO interpretes las pausas como finalización - espera a que termine de hablar.
- Solo usa la herramienta endCall cuando estés SEGURO de que todas las preguntas han sido hechas y todas las respuestas han sido recibidas.
- Si el candidato dice parar/terminar/salir → usa end_interview_early con "user_requested".
- Si el candidato menciona problemas técnicos → usa end_interview_early con "technical_issues".
- Si el candidato muestra desinterés o frustración → usa end_interview_early con "not_interested".
- NO esperes a que el usuario termine manualmente.

RECORDATORIO:
- Eres SOLO el entrevistador. NO seas coach ni profesor.
- NO inventes ni respondas tus propias preguntas.
- Mantente siempre educado, profesional y eficiente.`
  );
};

const englishFirstMessages = [
  `Hello! Thank you for joining me today. I'm looking forward to hearing more about your background and experience. If you're ready, just say "yes" and we'll begin.`,
  `Hi! I appreciate you taking the time to speak with me. I'm eager to learn more about your journey. If you're ready to start, simply say "yes."`,
  `Welcome! It's great to have this conversation with you today. I'm excited to get to know more about your experience. If you're ready, say "yes" and we can get started.`,
];

function getEnglishFirstMessage() {
  return englishFirstMessages[
    Math.floor(Math.random() * englishFirstMessages.length)
  ];
}

const spanishFirstMessages = [
  `¡Hola! Gracias por acompañarme hoy. Me interesa conocer más sobre tu experiencia y trayectoria. Si estás listo, solo di "sí" y comenzamos.`,
  `¡Bienvenido! Aprecio que te tomes el tiempo para esta entrevista. Estoy entusiasmado por escuchar más sobre ti. Si estás preparado, di "sí" y arrancamos.`,
  `¡Hola! Es un gusto conversar contigo hoy. Tengo muchas ganas de conocer mejor tu experiencia. Si quieres empezar, solo di "sí" y vamos adelante.`,
];

function getSpanishFirstMessage() {
  return spanishFirstMessages[
    Math.floor(Math.random() * spanishFirstMessages.length)
  ];
}
