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
      waitSeconds: 1.5,
      smartEndpointingPlan: {
        provider: 'vapi',
      },
    },
    stopSpeakingPlan: {
      numWords: 3,
      voiceSeconds: 0.2,
      backoffSeconds: 1.5,
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
      idleTimeoutSeconds: 30, // Mensaje cada 30 segundos de inactividad para dar más tiempo de reflexión
    },
    silenceTimeoutSeconds: 120, // Termina la llamada después de 2 minutos de silencio completo (2 * 60 = 120) - permite respuestas largas y detalladas con pausas
    maxDurationSeconds: 900, // Máximo 15 minutos por entrevista (15 * 60 = 900) - tiempo suficiente para respuestas completas
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
  starEvaluation: z.object({
    overallScore: z.number(),
    comment: z.string(),
    missingElements: z.array(z.enum(['S', 'T', 'A', 'R'])),
    actionableExamples: z.array(z.string()),
  }),
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
  
  CALL TERMINATION RULES - READ CAREFULLY:
  - CRITICAL: NEVER use the endCall tool while the candidate is speaking or in the middle of their response.
  - MANDATORY: You MUST wait at least 3-5 seconds AFTER the candidate has completely stopped speaking to ensure their response is truly complete.
  - VERIFICATION REQUIRED: Before calling endCall, verify that:
    1. You have asked ALL questions from {{questions}} (count them: if there are 5 questions, you must have asked all 5)
    2. The candidate has provided a COMPLETE response to EVERY question
    3. The candidate has been silent for at least 3-5 seconds (indicating they are truly done)
    4. You have acknowledged their final response with a brief "thank you" or "understood"
  - PAUSES ARE NORMAL: If a candidate pauses for 2-30 seconds while thinking or speaking, this is NORMAL - DO NOT end the call or interrupt.
  - DETAILED RESPONSES: Candidates may take 1-3 minutes to fully answer a question. This is EXPECTED - be patient and let them finish.
  - DOUBLE CHECK: Count the questions in {{questions}} at the start. Keep track mentally. Only when ALL are asked AND answered, proceed to endCall.
  - NEVER call endCall if you're unsure whether the candidate has finished - wait longer instead.
  - Exception cases (use end_interview_early function, NOT endCall):
    * If the candidate says stop/end/quit → call end_interview_early with "user_requested"
    * If candidate mentions technical issues → call end_interview_early with "technical_issues"
    * If candidate shows disinterest/frustration → call end_interview_early with "not_interested"
  
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

REGLAS DE TERMINACIÓN DE LLAMADA - LEE CON ATENCIÓN:
- CRÍTICO: NUNCA uses la herramienta endCall mientras el candidato está hablando o en medio de su respuesta.
- OBLIGATORIO: DEBES esperar al menos 3-5 segundos DESPUÉS de que el candidato haya dejado de hablar completamente para asegurar que su respuesta está realmente completa.
- VERIFICACIÓN REQUERIDA: Antes de llamar endCall, verifica que:
  1. Has hecho TODAS las preguntas de {{questions}} (cuéntalas: si hay 5 preguntas, debes haber hecho las 5)
  2. El candidato ha dado una respuesta COMPLETA a CADA pregunta
  3. El candidato ha estado en silencio durante al menos 3-5 segundos (indicando que realmente terminó)
  4. Has reconocido su respuesta final con un breve "gracias" o "entendido"
- LAS PAUSAS SON NORMALES: Si un candidato hace una pausa de 2-30 segundos mientras piensa o habla, esto es NORMAL - NO termines la llamada ni interrumpas.
- RESPUESTAS DETALLADAS: Los candidatos pueden tomar 1-3 minutos para responder completamente una pregunta. Esto es ESPERADO - sé paciente y déjalos terminar.
- VERIFICA DOS VECES: Cuenta las preguntas en {{questions}} al inicio. Lleva un registro mental. Solo cuando TODAS hayan sido preguntadas Y respondidas, procede con endCall.
- NUNCA llames endCall si no estás seguro de que el candidato ha terminado - mejor espera más tiempo.
- Casos de excepción (usa la función end_interview_early, NO endCall):
  * Si el candidato dice parar/terminar/salir → llama end_interview_early con "user_requested"
  * Si el candidato menciona problemas técnicos → llama end_interview_early con "technical_issues"
  * Si el candidato muestra desinterés o frustración → llama end_interview_early con "not_interested"

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
