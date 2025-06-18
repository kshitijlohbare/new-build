# Production Booking Journey API Endpoints

This document outlines the required backend API endpoints needed for the production booking journey.

## Required API Endpoints

### 1. Video Meeting APIs

#### Zoom Integration
```
POST /api/create-zoom-meeting
```
**Request Body:**
```json
{
  "appointmentId": 123,
  "hostEmail": "practitioner@example.com",
  "guestEmail": "user@example.com",
  "topic": "Therapy Session with Dr. Sarah",
  "agenda": "Initial consultation",
  "startTime": "2025-06-20T14:00:00",
  "durationMinutes": 60
}
```

**Response:**
```json
{
  "id": "1234567890",
  "join_url": "https://zoom.us/j/1234567890?pwd=abc123",
  "password": "abc123",
  "host_url": "https://zoom.us/s/1234567890?zak=eyJ0eXA..."
}
```

#### Google Meet Integration
```
POST /api/create-google-meet
```
**Request Body:**
```json
{
  "appointmentId": 123,
  "hostEmail": "practitioner@example.com",
  "guestEmail": "user@example.com",
  "summary": "Therapy Session with Dr. Sarah",
  "description": "Initial consultation",
  "startDateTime": "2025-06-20T14:00:00",
  "duration": 60
}
```

**Response:**
```json
{
  "meetingId": "abc-defg-hij",
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "eventId": "google_calendar_event_id"
}
```

#### Microsoft Teams Integration
```
POST /api/create-teams-meeting
```
**Request Body:**
```json
{
  "appointmentId": 123,
  "hostEmail": "practitioner@example.com",
  "guestEmail": "user@example.com",
  "subject": "Therapy Session with Dr. Sarah",
  "description": "Initial consultation",
  "startDateTime": "2025-06-20T14:00:00",
  "durationMinutes": 60
}
```

**Response:**
```json
{
  "id": "teams_meeting_id",
  "joinUrl": "https://teams.microsoft.com/l/meetup-join/...",
  "subject": "Therapy Session with Dr. Sarah"
}
```

### 2. Calendar Integration

```
POST /api/create-calendar-event
```
**Request Body:**
```json
{
  "appointmentId": 123,
  "userEmail": "user@example.com",
  "practitionerEmail": "practitioner@example.com",
  "title": "Therapy Session with Dr. Sarah",
  "description": "Initial consultation",
  "date": "2025-06-20",
  "time": "14:00:00",
  "duration": 60
}
```

**Response:**
```json
{
  "eventId": "calendar_event_id",
  "success": true
}
```

### 3. Practitioner Availability

```
GET /api/practitioners/{practitionerId}/availability?date=2025-06-20
```

**Response:**
```json
{
  "practitionerId": 123,
  "date": "2025-06-20",
  "timeSlots": [
    {
      "time": "09:00 AM",
      "available": true
    },
    {
      "time": "10:00 AM",
      "available": false
    },
    {
      "time": "11:00 AM",
      "available": true
    },
    {
      "time": "01:00 PM",
      "available": true
    },
    {
      "time": "02:00 PM",
      "available": true
    },
    {
      "time": "03:00 PM",
      "available": false
    },
    {
      "time": "04:00 PM",
      "available": true
    },
    {
      "time": "05:00 PM",
      "available": true
    }
  ]
}
```

### 4. Appointment Management

#### Create Appointment
```
POST /api/appointments
```
**Request Body:**
```json
{
  "userId": "user-uuid",
  "practitionerId": 123,
  "practitionerName": "Dr. Sarah Johnson",
  "date": "2025-06-20",
  "time": "14:00:00",
  "sessionType": "Initial Consultation",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "videoMeetingConfig": {
    "platform": "zoom",
    "hostEmail": "practitioner@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "appointmentId": 456,
  "meetingDetails": {
    "platform": "zoom",
    "meetingUrl": "https://zoom.us/j/1234567890?pwd=abc123",
    "meetingId": "1234567890",
    "meetingPassword": "abc123"
  }
}
```

#### Cancel Appointment
```
PUT /api/appointments/{appointmentId}/cancel
```
**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

#### Reschedule Appointment
```
PUT /api/appointments/{appointmentId}/reschedule
```
**Request Body:**
```json
{
  "newDate": "2025-06-25",
  "newTime": "15:00:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment rescheduled successfully"
}
```

#### Get User Appointments
```
GET /api/users/{userId}/appointments
```

**Response:**
```json
{
  "appointments": [
    {
      "id": 123,
      "practitionerId": 456,
      "practitionerName": "Dr. Sarah Johnson",
      "date": "2025-06-20",
      "time": "14:00:00",
      "sessionType": "Initial Consultation",
      "status": "confirmed",
      "meetingDetails": {
        "platform": "zoom",
        "meetingUrl": "https://zoom.us/j/..."
      }
    },
    {
      "id": 124,
      "practitionerId": 789,
      "practitionerName": "Dr. Michael Lee",
      "date": "2025-06-25",
      "time": "10:00:00",
      "sessionType": "Follow-up",
      "status": "confirmed",
      "meetingDetails": {
        "platform": "google-meet",
        "meetingUrl": "https://meet.google.com/..."
      }
    }
  ]
}
```

## Implementation Notes

1. The APIs must be secured with proper authentication and authorization.
2. All sensitive data (API keys, tokens) should be stored in environment variables.
3. API calls involving third-party services should be made server-side, not directly from the client.
4. Proper error handling and logging should be implemented for all endpoints.
5. Rate limiting should be applied to prevent abuse.

## Environment Variables Required

```
# Zoom API
VITE_ZOOM_API_KEY=your_zoom_api_key
VITE_ZOOM_API_SECRET=your_zoom_api_secret

# Google Calendar
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Microsoft Graph API
VITE_MS_CLIENT_ID=your_ms_client_id
VITE_MS_CLIENT_SECRET=your_ms_client_secret

# Email Service
VITE_EMAIL_SERVICE_API_KEY=your_email_service_api_key
```
