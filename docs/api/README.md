# API Documentation

Documentation for all API endpoints in Get Ahead AI.

## Available Endpoints

### Interviews API

- **POST** `/api/interviews` - Generate new interview
- **GET** `/api/interviews?id={id}` - Get interview by ID
- **GET** `/api/interviews?userId={userId}&type=user` - Get user's interviews
- **GET** `/api/interviews?userId={userId}` - Get latest interviews

### Feedback API

- **POST** `/api/feedback` - Generate feedback for interview
- **GET** `/api/feedback?interviewId={id}&userId={userId}` - Get all feedbacks
- **GET** `/api/feedback?interviewId={id}&userId={userId}&latest=true` - Get latest feedback

## Coming Soon

- Detailed endpoint documentation
- Request/Response schemas
- Authentication requirements
- Rate limiting policies
- Error codes and handling
- Code examples in multiple languages

---

[← Back to Documentation](../README.md)
