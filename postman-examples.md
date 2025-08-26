# API Testing Examples

## Generate Interview Questions

### Basic Request (with userid in body)

```bash
curl -X POST http://localhost:3000/en/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Frontend Engineer",
    "level": "Senior",
    "techstack": "React,TypeScript,Next.js",
    "type": "technical",
    "amount": 5,
    "userid": "test-user-123"
  }'
```

### With Firebase Auth Token

```bash
curl -X POST http://localhost:3000/en/api/vapi/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{
    "role": "Backend Engineer",
    "level": "Mid-level",
    "techstack": "Node.js,Express,MongoDB",
    "type": "behavioral",
    "amount": 3
  }'
```

### Spanish Locale

```bash
curl -X POST http://localhost:3000/es/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Full Stack Developer",
    "level": "Junior",
    "techstack": "JavaScript,React,Node.js",
    "type": "technical",
    "amount": 4,
    "userid": "test-user-es"
  }'
```

### Invalid Request (should return 400)

```bash
curl -X POST http://localhost:3000/en/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "role": "",
    "level": "Senior",
    "techstack": "React",
    "type": "technical",
    "amount": 100
  }'
```

### Test Rate Limiting

```bash
# Run this multiple times quickly to trigger rate limiting (429)
for i in {1..10}; do
  curl -X POST http://localhost:3000/en/api/vapi/generate \
    -H "Content-Type: application/json" \
    -d '{
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

## Health Check

```bash
curl -X GET http://localhost:3000/en/api/vapi/generate
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
          "raw": "{\n  \"role\": \"Frontend Engineer\",\n  \"level\": \"Senior\",\n  \"techstack\": \"React,TypeScript,Next.js\",\n  \"type\": \"technical\",\n  \"amount\": 5,\n  \"userid\": \"test-user-123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/en/api/vapi/generate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "vapi", "generate"]
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
          "raw": "{\n  \"role\": \"Desarrollador Full Stack\",\n  \"level\": \"Junior\",\n  \"techstack\": \"JavaScript,React,Node.js\",\n  \"type\": \"technical\",\n  \"amount\": 4,\n  \"userid\": \"test-user-es\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/es/api/vapi/generate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["es", "api", "vapi", "generate"]
        }
      }
    },
    {
      "name": "Generate Interview - Invalid",
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
          "raw": "{\n  \"role\": \"\",\n  \"level\": \"Senior\",\n  \"techstack\": \"React\",\n  \"type\": \"technical\",\n  \"amount\": 100\n}"
        },
        "url": {
          "raw": "http://localhost:3000/en/api/vapi/generate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "vapi", "generate"]
        }
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/en/api/vapi/generate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["en", "api", "vapi", "generate"]
        }
      }
    }
  ]
}
```

## Expected Responses

### Success Response (200)

```json
{
  "success": true,
  "questions": [
    "What is React and how does it differ from other frameworks?",
    "Explain the concept of hooks in React.",
    "How would you optimize a React application for performance?"
  ],
  "interview": {
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
}
```

### Validation Error (400)

```json
{
  "success": false,
  "error": "Invalid request body"
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
  "error": "Failed to generate questions"
}
```

## Testing Notes

1. **Start the dev server**: `npm run dev`
2. **Test basic functionality** with the first curl command
3. **Test validation** with the invalid request
4. **Test rate limiting** by running multiple requests quickly
5. **Test different locales** (en/es) to verify i18n
6. **Optional**: Test with Firebase auth token if you have one

The API now includes:

- ✅ Input validation with Zod
- ✅ Rate limiting (5 requests per minute per IP)
- ✅ Server-side auth derivation (optional)
- ✅ Proper error handling
- ✅ Co-located unit tests
- ✅ JSDoc documentation
