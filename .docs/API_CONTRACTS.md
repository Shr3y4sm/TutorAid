# API Contracts

## Base URL

Frontend base URL is configured in:

```text
src/config/env.ts
```

Current value:

```text
http://10.184.246.132:3000
```

All frontend API wrappers should use:

```text
src/api/client.ts
```

## Health

### GET `/health`

Response:

```json
{
  "success": true,
  "message": "TutorAid Backend Running",
  "version": "1.0.0"
}
```

## Student

### GET `/student/dashboard`

Returns student dashboard data.

Response shape:

```json
{
  "success": true,
  "data": {
    "student": {},
    "todaysClasses": [],
    "announcements": []
  }
}
```

### GET `/student/profile`

Returns student profile data.

Response shape:

```json
{
  "success": true,
  "data": {
    "id": "student1",
    "name": "Shreyas",
    "studentId": "1RV22AI001",
    "department": "Artificial Intelligence & Machine Learning",
    "semester": 6,
    "avatarInitials": "S",
    "academic": {
      "cgpa": 8.7,
      "attendancePercentage": 91,
      "creditsCompleted": 118,
      "currentSemester": 6
    },
    "contact": {
      "email": "shreyas@student.tutoraid.edu",
      "phone": "+91 98765 43210"
    },
    "guardian": {
      "name": "Ramesh M",
      "phone": "+91 98765 12345"
    },
    "statistics": {
      "assignmentsSubmitted": 14,
      "pendingAssignments": 3,
      "coursesEnrolled": 5,
      "certificates": 2
    }
  }
}
```

Frontend wrapper:

```text
src/api/profile.ts
```

## Courses

### GET `/courses`

Returns all courses.

Course fields:

- `id`
- `title`
- `instructor`
- `progress`
- `students`
- `color`
- `description`

Frontend wrapper:

```text
src/api/courses.ts
```

### GET `/courses/:id`

Returns one course or `404` if not found.

## Assignments

### GET `/assignments`

Returns all assignments.

Assignment fields:

- `id`
- `title`
- `course`
- `description`
- `dueDate`
- `status`
- `maxMarks`
- `obtainedMarks`

Allowed status values:

- `Pending`
- `Submitted`
- `Overdue`

Frontend wrapper:

```text
src/api/assignments.ts
```

## Stream

Stream endpoints exist but the video module is deferred.

### POST `/stream/token`

Body:

```json
{
  "userId": "student1"
}
```

Response:

```json
{
  "success": true,
  "token": "...",
  "userId": "student1"
}
```

### POST `/stream/create-call`

Response:

```json
{
  "success": true,
  "callId": "room-..."
}
```

### GET `/stream/active-call`

Response:

```json
{
  "success": true,
  "callId": "room-..."
}
```

### POST `/stream/end-call`

Response:

```json
{
  "success": true
}
```

