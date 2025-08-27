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
  language: 'en' | 'es' = 'en'
): CreateAssistantDTO => {
  const isSpanish = language === 'es';

  const systemPrompt = isSpanish ? spanishSystemPrompt : englishSystemPrompt;

  return {
    name: 'Interviewer',
    firstMessage: isSpanish ? spanishFirstMessage : englishFirstMessage,
    transcriber: {
      provider: 'openai',
      model: 'gpt-4o-transcribe',
      language,
    },
    voice: {
      provider: 'vapi',
      voiceId: 'Paige',
      // stability: 0.4,
      // similarityBoost: 0.8,
      speed: 0.25,
      // style: 0.5,
      // useSpeakerBoost: true,
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
    },
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

export const dummyInterviews: Interview[] = [
  {
    id: '1',
    userId: 'user1',
    role: 'Frontend Developer',
    type: 'Technical',
    techstack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    level: 'Junior',
    questions: ['What is React?'],
    finalized: false,
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    role: 'Full Stack Developer',
    type: 'Mixed',
    techstack: ['Node.js', 'Express', 'MongoDB', 'React'],
    level: 'Senior',
    questions: ['What is Node.js?'],
    finalized: false,
    createdAt: '2024-03-14T15:30:00Z',
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
  '¡Hola! Gracias por tomar el tiempo de hablar conmigo hoy.' +
  'Estoy emocionado de conocer más sobre ti y tu experiencia.';
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

export const getTechInterviewWorkflow = (
  locale: 'en' | 'es'
): CreateWorkflowDTO => {
  const isSpanish = locale === 'es';

  const globalPrompt = isSpanish
    ? 'Eres un coach de entrevistas amable y profesional cuyo objetivo es ayudar a los usuarios a prepararse para entrevistas reales de forma segura, amistosa y realista.\n\nTu función principal es simular entrevistas haciendo preguntas relevantes, reflexivas y desafiantes adaptadas al puesto objetivo del usuario, su nivel de experiencia, el tipo de entrevista (técnica, conductual o mixta) y su stack tecnológico.\n\nSiempre mantén un tono: amistoso y alentador, respetuoso y profesional, y de apoyo incluso al hacer preguntas difíciles.\n\nPreséntate brevemente y explica tu rol como coach de entrevistas con IA. Recopila la información necesaria (puesto, tipo de entrevista, nivel de experiencia, tecnologías, número de preguntas) de forma clara y conversacional.\n\nDurante la entrevista: haz una pregunta a la vez, permite tiempo para responder, reconoce sin juzgar y ofrece comentarios o preguntas de seguimiento breves cuando corresponda. Al final, agradece el tiempo del usuario y anímale a seguir practicando para mejorar sus posibilidades de éxito en entrevistas reales.'
    : "You are a kind and professional interview coach whose goal is to help users prepare for real-life job interviews in a safe, friendly, and realistic environment.\n\nYour main role is to simulate interviews by asking relevant, thoughtful, and challenging questions tailored to the user's target role, level of experience, interview type (technical, behavioral, or mixed), and tech stack.\n\nAlways maintain a tone that is:\n\nFriendly and encouraging\n\nRespectful and professional\n\nSupportive, even when asking difficult questions\n\nBegin by briefly introducing yourself and explain your role as an AI-powered interview coach. Collect all the necessary information (role, interview type, experience level, technologies, number of questions) in a clear and conversational manner.\n\nOnce the interview begins:\n\nAsk one question at a time.\n\nAllow the user time to respond.\n\nAcknowledge their answers without judging.\n\nOptionally offer brief constructive feedback or follow-up questions.\n\nAt the end of the session, thank the user for their time and encourage them to continue practicing to improve their chances of succeeding in real interviews.";

  const introPrompt = isSpanish
    ? 'Saluda amablemente al usuario. Menciona su nombre si está disponible: ' +
      '{{username}}. Luego explica que harás algunas preguntas para generar una entrevista personalizada.'
    : 'Greet the user kindly! ' +
      'Mention their name if available: {{username}}. ' +
      "Then explain that you'll ask some questions to generate a personalized interview.";

  const introFirstMessage = isSpanish
    ? '¡Hola {{username}}! Vamos a preparar tu entrevista. ' +
      'Te haré algunas preguntas y generaré una entrevista perfecta para ti. ' +
      '¿Estás listo/a?'
    : "Hey there {{username}}! Let's prepare your interview. " +
      "I'll ask you a few questions and generate a perfect interview just for you. " +
      'Are you ready?';

  const promptQ1 = isSpanish
    ? 'Haz la siguiente pregunta sin prisa:\n1. ¿Para qué puesto te estás preparando?'
    : 'Ask the user the following questions without rushing:\n1. What role are you preparing for?';
  const promptQ2 = isSpanish
    ? 'Haz la siguiente pregunta sin prisa:\n2. ¿Quieres una entrevista técnica, conductual o mixta?'
    : 'Ask the user the following questions without rushing:\n\n2. Do you want a technical, behavioral, or mixed interview?';
  const promptQ3 = isSpanish
    ? 'Haz la siguiente pregunta sin prisa:\n3. ¿Cuál es tu nivel de experiencia (por ejemplo, junior, mid, senior)?'
    : "Ask the user the following questions without rushing:\n3. What's your experience level (e.g., junior, mid, senior)?";
  const promptQ4 = isSpanish
    ? 'Haz la siguiente pregunta sin prisa:\n4. ¿En qué tecnologías o herramientas debo enfocarme?'
    : 'Ask the user the following questions without rushing:\n4. What technologies or tools should I focus on?';
  const promptQ5 = isSpanish
    ? 'Haz la siguiente pregunta sin prisa:\n5. ¿Cuántas preguntas debo generar para ti?'
    : 'Ask the user the following questions without rushing:\n5. How many questions should I generate for you?';

  const apiRequestStartMessage = isSpanish
    ? 'Por favor espera un momento mientras genero tu entrevista. ' +
      'Gracias por la llamada!'
    : 'Please hold on while I generate your interview. ' +
      'Thank you for the call!';

  const apiRequestCompleteMessage = isSpanish
    ? 'La solicitud se ha enviado y tu entrevista ha sido generada. ' +
      'Gracias por la llamada!\n¡Adiós!'
    : 'The request has been sent and your interview had been generated. Thank you for the call!\nBye!';

  const apiRequestFailedMessage = isSpanish
    ? 'Oops! Parece que algo salió mal al enviar los datos a la app. ' +
      'Por favor intenta nuevamente.'
    : 'Oops! Looks like something went wrong when sending the data to the app! ' +
      'Please try again.';

  const hangupMessage = isSpanish
    ? 'Todo ha sido generado. ' +
      'Te redirigiré a la página de inicio ahora, gracias por la llamada!'
    : 'Everything has been generated. ' +
      "I'll redirect you to dashboard now, thanks for the call!";

  const edgeConditionYes = isSpanish
    ? 'si el usuario dijo sí'
    : 'if the user said yes';

  const interviewTypes = isSpanish
    ? ['técnica', 'conductual', 'mixta']
    : ['technical', 'behavioral', 'mixed'];

  return {
    name: 'tech-interview',
    globalPrompt,
    nodes: [
      {
        name: 'introduction',
        type: 'conversation',
        isStart: true,
        prompt: introPrompt,
        transcriber: {
          provider: 'openai',
          model: 'gpt-4o-transcribe',
          language: locale,
        },
        variableExtractionPlan: {
          output: [],
        },
        messagePlan: {
          firstMessage: introFirstMessage,
        },
        toolIds: [],
      },
      {
        name: 'getRole',
        type: 'conversation',
        prompt: promptQ1,
        transcriber: {
          provider: 'openai',
          model: 'gpt-4o-transcribe',
          language: locale,
        },
        variableExtractionPlan: {
          output: [
            {
              enum: [],
              type: 'string',
              title: 'role',
              description: 'The job role the user wants to prepare for.',
            },
          ],
        },
        messagePlan: { firstMessage: '' },
        toolIds: [],
      },
      {
        name: 'getType',
        type: 'conversation',
        prompt: promptQ2,
        transcriber: {
          provider: 'openai',
          model: 'gpt-4o-transcribe',
          language: locale,
        },
        variableExtractionPlan: {
          output: [
            {
              enum: interviewTypes,
              type: 'string',
              title: 'type',
              description: 'The type of interview desired.',
            },
          ],
        },
        messagePlan: { firstMessage: '' },
        toolIds: [],
      },
      {
        name: 'getExperience',
        type: 'conversation',
        prompt: promptQ3,
        transcriber: {
          provider: 'openai',
          model: 'gpt-4o-transcribe',
          language: locale,
        },
        variableExtractionPlan: {
          output: [
            {
              enum: [],
              type: 'string',
              title: 'level',
              description: "The user's experience level.",
            },
          ],
        },
        messagePlan: { firstMessage: '' },
        toolIds: [],
      },
      {
        name: 'getTech',
        type: 'conversation',
        prompt: promptQ4,
        transcriber: {
          provider: 'openai',
          model: 'gpt-4o-transcribe',
          language: locale,
        },
        variableExtractionPlan: {
          output: [
            {
              enum: [],
              type: 'string',
              title: 'techstack',
              description: 'Technologies or tools to be covered.',
            },
          ],
        },
        messagePlan: { firstMessage: '' },
        toolIds: [],
      },
      {
        name: 'getNumQuestions',
        type: 'conversation',
        prompt: promptQ5,
        transcriber: {
          provider: 'openai',
          model: 'gpt-4o-transcribe',
          language: locale,
        },
        variableExtractionPlan: {
          output: [
            {
              enum: [],
              type: 'number',
              title: 'amount',
              description: 'Number of questions to generate.',
            },
          ],
        },
        messagePlan: { firstMessage: '' },
        toolIds: [],
      },
      {
        name: 'apiRequest',
        type: 'tool',
        tool: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/api/interviews`,
          body: {
            type: 'object',
            required: [
              'type',
              'role',
              'level',
              'techstack',
              'amount',
              'userid',
            ],
            properties: {
              role: { type: 'string', default: '{{role}}', description: '' },
              type: {
                enum: ['technical', 'behavioral', 'mixed'],
                type: 'string',
                default: '{{type}}',
                description: '',
              },
              level: { type: 'string', default: '{{level}}', description: '' },
              amount: {
                type: 'number',
                default: '{{amount}}',
                description: '',
              },
              userid: {
                type: 'string',
                default: '{{userid}}',
                description: '',
              },
              techstack: {
                type: 'string',
                default: '{{techstack}}',
                description: '',
              },
            },
          },
          name: 'generateUserQuestions',
          type: 'apiRequest',
          method: 'POST',
          function: {
            name: 'api_request_tool',
            parameters: { type: 'object', required: [], properties: {} },
            description: 'API request tool',
          },
          messages: [
            {
              type: 'request-start',
              content: apiRequestStartMessage,
              blocking: true,
            },
            {
              role: 'assistant',
              type: 'request-complete',
              content: apiRequestCompleteMessage,
              endCallAfterSpokenEnabled: true,
            },
            {
              type: 'request-failed',
              content: apiRequestFailedMessage,
              endCallAfterSpokenEnabled: true,
            },
          ],
          variableExtractionPlan: {
            schema: { type: 'object', required: [], properties: {} },
            aliases: [],
          },
        },
      },
      {
        name: 'hangUp',
        type: 'tool',
        metadata: {
          position: { x: -487.18438795281793, y: -557.433987787144 },
        },
        tool: {
          type: 'endCall',
          function: {
            name: 'untitled_tool',
            parameters: { type: 'object', required: [], properties: {} },
          },
          messages: [
            {
              type: 'request-start',
              content: hangupMessage,
              blocking: true,
            },
          ],
        },
      },
    ],
    edges: [
      {
        from: 'introduction',
        to: 'getRole',
        condition: { type: 'ai', prompt: edgeConditionYes },
      },
      {
        from: 'getRole',
        to: 'getType',
        condition: { type: 'ai', prompt: '' },
      },
      {
        from: 'getType',
        to: 'getExperience',
        condition: { type: 'ai', prompt: '' },
      },
      {
        from: 'getExperience',
        to: 'getTech',
        condition: { type: 'ai', prompt: '' },
      },
      {
        from: 'getTech',
        to: 'getNumQuestions',
        condition: { type: 'ai', prompt: '' },
      },
      {
        from: 'getNumQuestions',
        to: 'apiRequest',
        condition: { type: 'ai', prompt: '' },
      },
      {
        from: 'apiRequest',
        to: 'hangUp',
        condition: { type: 'ai', prompt: '' },
      },
    ],
  } as unknown as CreateWorkflowDTO;
};
