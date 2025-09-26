# API Testing Examples

## Interviews API

### Generate Interview Questions

#### Basic Request (with userid in body)

```bash
curl -X POST http://localhost:3000/en/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Frontend Engineer Interview",
    "role": "Frontend Engineer",
    "level": "Senior",
    "techstack": "React,TypeScript,Next.js",
    "type": "technical",
    "amount": 5,
    "userid": "test-user-123"
  }'
```

#### Spanish Locale

```bash
curl -X POST http://localhost:3000/es/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Entrevista Full Stack",
    "role": "Full Stack Developer",
    "level": "Junior",
    "techstack": "JavaScript,React,Node.js",
    "type": "technical",
    "amount": 4,
    "userid": "test-user-es"
  }'
```

#### Invalid Request (should return 400)

```bash
curl -X POST http://localhost:3000/en/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "role": "",
    "level": "Senior",
    "techstack": "React",
    "type": "technical",
    "amount": 100
  }'
```

### Get Interview by ID

```bash
curl -X GET "http://localhost:3000/en/api/interviews?id=INTERVIEW_ID"
```

### Get User's Interviews

```bash
curl -X GET "http://localhost:3000/en/api/interviews?userId=USER_ID&type=user"
```

### Get Latest Interviews (excluding user's own)

```bash
curl -X GET "http://localhost:3000/en/api/interviews?userId=USER_ID&limit=20"
```

## Feedback API

### Generate Feedback

```bash
curl -X POST http://localhost:3000/en/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "interviewId": "INTERVIEW_ID",
    "userid": "USER_ID",
    "transcript": [
      { "role": "assistant", "content": "Tell me about yourself?" },
      { "role": "user", "content": "I am a frontend developer with 3 years of experience..." },
      { "role": "assistant", "content": "What is the virtual DOM?" },
      { "role": "user", "content": "It is a lightweight representation of the DOM..." }
    ]
  }'
```

### Get Feedback by Interview ID

```bash
curl -X GET "http://localhost:3000/en/api/feedback?interviewId=INTERVIEW_ID&userId=USER_ID"
```

### Test Rate Limiting

```bash
# Run this multiple times quickly to trigger rate limiting (429)
for i in {1..10}; do
  curl -X POST http://localhost:3000/en/api/interviews \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Test Interview",
      "role": "Test Role",
      "level": "Senior",
      "techstack": "Test",
      "type": "technical",
      "amount": 1,
      "userid": "rate-test-user"
    }'
  echo "Request $i completed"
done
```

## Postman Import

1. Open Postman
2. Click "Import"
3. Choose "Raw text" tab
4. Copy and paste this collection:

```json
{
  "info": {
    "name": "Interview API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Generate Interview - Basic",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Frontend Engineer Interview\",\n  \"role\": \"Frontend Engineer\",\n  \"level\": \"Senior\",\n  \"techstack\": \"React,TypeScript,Next.js\",\n  \"type\": \"technical\",\n  \"amount\": 5,\n  \"userid\": \"test-user-123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/en/api/interviews",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "interviews"]
        }
      }
    },
    {
      "name": "Generate Interview - Spanish",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Entrevista Full Stack\",\n  \"role\": \"Desarrollador Full Stack\",\n  \"level\": \"Junior\",\n  \"techstack\": \"JavaScript,React,Node.js\",\n  \"type\": \"technical\",\n  \"amount\": 4,\n  \"userid\": \"test-user-es\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/es/api/interviews",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["es", "api", "interviews"]
        }
      }
    },
    {
      "name": "Get Interview by ID",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/en/api/interviews?id=INTERVIEW_ID",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "interviews"],
          "query": [
            {
              "key": "id",
              "value": "INTERVIEW_ID"
            }
          ]
        }
      }
    },
    {
      "name": "Get User Interviews",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/en/api/interviews?userId=USER_ID&type=user",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "interviews"],
          "query": [
            {
              "key": "userId",
              "value": "USER_ID"
            },
            {
              "key": "type",
              "value": "user"
            }
          ]
        }
      }
    },
    {
      "name": "Get Latest Interviews",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/en/api/interviews?userId=USER_ID&limit=20",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "interviews"],
          "query": [
            {
              "key": "userId",
              "value": "USER_ID"
            },
            {
              "key": "limit",
              "value": "20"
            }
          ]
        }
      }
    },
    {
      "name": "Generate Feedback",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"interviewId\": \"INTERVIEW_ID\",\n  \"userid\": \"USER_ID\",\n  \"transcript\": [\n    { \"role\": \"assistant\", \"content\": \"Tell me about yourself?\" },\n    { \"role\": \"user\", \"content\": \"I am a frontend developer with 3 years of experience...\" }\n  ]\n}"
        },
        "url": {
          "raw": "http://localhost:3000/en/api/feedback",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "feedback"]
        }
      }
    },
    {
      "name": "Get Feedback",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/en/api/feedback?interviewId=INTERVIEW_ID&userId=USER_ID",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "feedback"],
          "query": [
            {
              "key": "interviewId",
              "value": "INTERVIEW_ID"
            },
            {
              "key": "userId",
              "value": "USER_ID"
            }
          ]
        }
      }
    }
  ]
}
```

## Expected Responses

### Generate Interview Success (200)

```json
{
  "success": true,
  "questions": [
    "What is React and how does it differ from other frameworks?",
    "Explain the concept of hooks in React.",
    "How would you optimize a React application for performance?"
  ],
  "interview": {
    "title": "Frontend Engineer Interview",
    "role": "Frontend Engineer",
    "type": "technical",
    "level": "Senior",
    "techstack": ["React", "TypeScript", "Next.js"],
    "questions": [...],
    "userId": "test-user-123",
    "finalized": true,
    "coverImage": "path/to/cover.png",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "documentId": "generated-interview-id"
}
```

### Get Interview Success (200)

```json
{
  "success": true,
  "interview": {
    "id": "interview-id",
    "title": "Frontend Engineer Interview",
    "role": "Frontend Engineer",
    "type": "technical",
    "level": "Senior",
    "techstack": ["React", "TypeScript", "Next.js"],
    "questions": [...],
    "userId": "test-user-123",
    "finalized": true,
    "coverImage": "path/to/cover.png",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "locale": "en"
}
```

### Get Interviews List Success (200)

```json
{
  "success": true,
  "interviews": [
    {
      "id": "interview-1",
      "title": "Frontend Engineer Interview",
      "role": "Frontend Engineer",
      "type": "technical",
      "level": "Senior",
      "techstack": ["React", "TypeScript", "Next.js"],
      "questions": [...],
      "userId": "test-user-123",
      "finalized": true,
      "coverImage": "path/to/cover.png",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "locale": "en"
}
```

### Generate Feedback Success (200)

```json
{
  "success": true,
  "feedbackId": "generated-feedback-id"
}
```

### Get Feedback Success (200)

```json
{
  "success": true,
  "feedback": {
    "id": "feedback-id",
    "interviewId": "interview-id",
    "userId": "user-id",
    "totalScore": 85,
    "categoryScores": [
      {
        "name": "communication",
        "score": 90,
        "comment": "Excellent communication skills..."
      }
    ],
    "strengths": ["Strong technical knowledge", "Clear explanations"],
    "areasForImprovement": ["More specific examples", "Better time management"],
    "finalAssessment": "Overall strong performance...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Validation Error (400)

```json
{
  "success": false,
  "error": "Invalid request body",
  "message": "title: title is required; amount: Number must be less than or equal to 5"
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "error": "Interview not found"
}
```

### Rate Limited (429)

```json
{
  "success": false,
  "error": "Too Many Requests"
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Error details..."
}
```

## Testing Notes

1. **Start the dev server**: `npm run dev`
2. **Test basic functionality** with the first curl command
3. **Test validation** with the invalid request
4. **Test rate limiting** by running multiple requests quickly
5. **Test different locales** (en/es) to verify i18n
6. **Test all endpoints** to verify the new architecture

## API Endpoints Summary

### Interviews API (`/[locale]/api/interviews`)

- `POST` - Generate interview questions
- `GET ?id=...` - Get interview by ID
- `GET ?userId=...&type=user` - Get user's interviews
- `GET ?userId=...&limit=...` - Get latest interviews

### Feedback API (`/[locale]/api/feedback`)

- `POST` - Generate feedback from transcript
- `GET ?interviewId=...&userId=...` - Get feedback by interview ID

The API now includes:

- ✅ RESTful architecture with proper HTTP methods
- ✅ Input validation with Zod schemas
- ✅ Rate limiting (5 requests per minute per IP)
- ✅ Proper error handling and status codes
- ✅ Multi-language support (en/es)
- ✅ Clean separation of concerns (UI → API → Service → Repository)
- ✅ Comprehensive documentation
