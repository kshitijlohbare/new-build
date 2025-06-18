# API Implementation Guide for Production Booking Journey

This document provides detailed information on how to implement the backend API endpoints required for the production-ready booking journey.

## Backend API Infrastructure Requirements

### 1. API Server Options

The booking journey requires a secure, reliable API backend. Options include:

1. **Serverless Functions** (Recommended)
   - AWS Lambda with API Gateway
   - Vercel Serverless Functions
   - Netlify Functions
   - Supabase Edge Functions

2. **Traditional API Server**
   - Node.js with Express
   - Python with FastAPI or Flask
   - Ruby on Rails API

### 2. Required Environment Variables

Create a `.env.production` file with these environment variables:

```
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Video Meeting APIs
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
GOOGLE_API_CLIENT_ID=your_google_client_id
GOOGLE_API_CLIENT_SECRET=your_google_client_secret
MICROSOFT_GRAPH_CLIENT_ID=your_microsoft_client_id
MICROSOFT_GRAPH_CLIENT_SECRET=your_microsoft_client_secret

# Email Service
EMAIL_SERVICE=sendgrid # or mailgun, ses
SENDGRID_API_KEY=your_sendgrid_api_key

# Security
JWT_SECRET=your_jwt_secret_for_auth_tokens
```

## API Implementation Details

### 1. Video Meeting APIs

#### 1.1 Zoom Meeting Creation

**Endpoint**: `POST /api/create-zoom-meeting`

**Implementation Guide**:

1. Install the Zoom API SDK:
   ```bash
   npm install @zoom/api
   ```

2. Implementation (Node.js example):
   ```javascript
   // zoom-meeting.js
   const { Zoom } = require('@zoom/api');
   
   export default async function handler(req, res) {
     try {
       const { 
         hostEmail, 
         guestEmail, 
         topic, 
         agenda, 
         startTime, 
         durationMinutes 
       } = req.body;
       
       // Validate required fields
       if (!hostEmail || !topic || !startTime || !durationMinutes) {
         return res.status(400).json({ 
           error: "Missing required fields" 
         });
       }
       
       // Generate JWT token for Zoom API
       const zoom = new Zoom({
         clientId: process.env.ZOOM_API_KEY,
         clientSecret: process.env.ZOOM_API_SECRET,
       });
       
       // Create Zoom meeting
       const meeting = await zoom.meetings.create({
         userId: hostEmail,
         topic,
         agenda,
         start_time: startTime,
         duration: durationMinutes,
         settings: {
           host_video: true,
           participant_video: true,
           join_before_host: false,
           waiting_room: true,
           email_notification: true
         }
       });
       
       return res.status(200).json({
         id: meeting.id,
         join_url: meeting.join_url,
         start_url: meeting.start_url,
         password: meeting.password
       });
     } catch (error) {
       console.error('Zoom API error:', error);
       return res.status(500).json({ 
         error: "Failed to create Zoom meeting"
       });
     }
   }
   ```

#### 1.2 Google Meet Integration

**Endpoint**: `POST /api/create-google-meet`

**Implementation Guide**:

1. Install Google APIs:
   ```bash
   npm install googleapis
   ```

2. Implementation (Node.js example):
   ```javascript
   // google-meet.js
   const { google } = require('googleapis');
   const { OAuth2 } = google.auth;
   
   export default async function handler(req, res) {
     try {
       const { 
         hostEmail, 
         guestEmail, 
         summary, 
         description, 
         startDateTime, 
         duration 
       } = req.body;
       
       // Validate inputs
       if (!hostEmail || !guestEmail || !summary || !startDateTime || !duration) {
         return res.status(400).json({ 
           error: "Missing required fields" 
         });
       }
       
       // Set up OAuth2 client
       const oauth2Client = new OAuth2(
         process.env.GOOGLE_API_CLIENT_ID,
         process.env.GOOGLE_API_CLIENT_SECRET,
         `${process.env.API_BASE_URL}/api/google-auth-callback`
       );
       
       // For production, you'll need to handle OAuth tokens properly
       // Here we assume you've implemented token storage and retrieval
       const tokenInfo = await getHostTokenFromDatabase(hostEmail);
       if (!tokenInfo) {
         return res.status(403).json({ 
           error: "Host account not connected to Google" 
         });
       }
       
       oauth2Client.setCredentials(tokenInfo);
       
       const calendar = google.calendar({
         version: 'v3',
         auth: oauth2Client
       });
       
       // Calculate event end time
       const startDate = new Date(startDateTime);
       const endDate = new Date(startDate.getTime() + duration * 60000);
       
       // Create calendar event with Google Meet conference
       const event = {
         summary,
         description,
         start: {
           dateTime: startDate.toISOString(),
           timeZone: 'UTC'
         },
         end: {
           dateTime: endDate.toISOString(),
           timeZone: 'UTC'
         },
         attendees: [
           { email: hostEmail },
           { email: guestEmail }
         ],
         conferenceData: {
           createRequest: {
             requestId: `meet-${Date.now()}`,
             conferenceSolutionKey: {
               type: 'hangoutsMeet'
             }
           }
         }
       };
       
       const createdEvent = await calendar.events.insert({
         calendarId: 'primary',
         resource: event,
         conferenceDataVersion: 1
       });
       
       const meetLink = createdEvent.data.conferenceData?.entryPoints?.find(
         e => e.entryPointType === 'video'
       )?.uri;
       
       const meetId = meetLink?.split('/').pop();
       
       return res.status(200).json({
         meetingUrl: meetLink,
         meetingId: meetId,
         eventId: createdEvent.data.id
       });
     } catch (error) {
       console.error('Google Calendar API error:', error);
       return res.status(500).json({ 
         error: "Failed to create Google Meet" 
       });
     }
   }
   ```

#### 1.3 Microsoft Teams Integration

**Endpoint**: `POST /api/create-teams-meeting`

**Implementation Guide**:

1. Install Microsoft Graph SDK:
   ```bash
   npm install @microsoft/microsoft-graph-client
   ```

2. Implementation (Node.js example):
   ```javascript
   // microsoft-teams.js
   const graph = require('@microsoft/microsoft-graph-client');
   require('isomorphic-fetch');
   
   export default async function handler(req, res) {
     try {
       const { 
         hostEmail, 
         guestEmail, 
         subject, 
         description, 
         startDateTime, 
         durationMinutes 
       } = req.body;
       
       // Validate inputs
       if (!hostEmail || !subject || !startDateTime || !durationMinutes) {
         return res.status(400).json({ 
           error: "Missing required fields" 
         });
       }
       
       // Get host token from your storage
       const tokenInfo = await getHostTokenFromDatabase(hostEmail);
       if (!tokenInfo) {
         return res.status(403).json({ 
           error: "Host account not connected to Microsoft" 
         });
       }
       
       // Initialize Graph client
       const client = graph.Client.init({
         authProvider: (done) => {
           done(null, tokenInfo.accessToken);
         }
       });
       
       // Calculate end time
       const startDate = new Date(startDateTime);
       const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
       
       // Create teams meeting
       const meeting = {
         subject,
         body: {
           contentType: 'text',
           content: description
         },
         start: {
           dateTime: startDate.toISOString(),
           timeZone: 'UTC'
         },
         end: {
           dateTime: endDate.toISOString(),
           timeZone: 'UTC'
         },
         attendees: [
           {
             emailAddress: {
               address: guestEmail,
               name: ''
             },
             type: 'required'
           }
         ],
         isOnlineMeeting: true,
         onlineMeetingProvider: 'teamsForBusiness'
       };
       
       const createdEvent = await client
         .api('/me/events')
         .post(meeting);
       
       return res.status(200).json({
         id: createdEvent.id,
         joinUrl: createdEvent.onlineMeeting.joinUrl,
         subject: createdEvent.subject
       });
     } catch (error) {
       console.error('Microsoft Graph API error:', error);
       return res.status(500).json({ 
         error: "Failed to create Teams meeting" 
       });
     }
   }
   ```

### 2. Calendar Integration

#### 2.1 Practitioner Availability API

**Endpoint**: `GET /api/practitioners/{practitionerId}/availability`

**Implementation Guide**:

```javascript
// availability.js
const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  const { practitionerId } = req.query;
  const date = req.query.date;
  
  if (!practitionerId || !date) {
    return res.status(400).json({ error: "Missing practitioner ID or date" });
  }
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    // Get practitioner's schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from('practitioner_schedules')
      .select('*')
      .eq('practitioner_id', practitionerId)
      .eq('day_of_week', new Date(date).getDay());
      
    if (scheduleError) throw scheduleError;
    
    // Get existing appointments for that date
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('time')
      .eq('practitioner_id', practitionerId)
      .eq('date', date)
      .eq('status', 'confirmed');
      
    if (appointmentsError) throw appointmentsError;
    
    // Generate all possible time slots based on schedule
    const timeSlots = [];
    
    if (schedule && schedule.length > 0) {
      const { start_time, end_time, slot_duration_minutes } = schedule[0];
      
      // Convert start and end times to minutes since midnight
      const startMinutes = convertTimeToMinutes(start_time);
      const endMinutes = convertTimeToMinutes(end_time);
      
      // Generate slots
      for (let mins = startMinutes; mins < endMinutes; mins += slot_duration_minutes) {
        const time = convertMinutesToTime(mins);
        const slotEndMins = mins + slot_duration_minutes;
        
        // Check if slot is already booked
        const isBooked = appointments.some(appt => {
          const apptMins = convertTimeToMinutes(appt.time);
          return apptMins >= mins && apptMins < slotEndMins;
        });
        
        timeSlots.push({
          time: time,
          available: !isBooked
        });
      }
    }
    
    return res.status(200).json({
      practitionerId,
      date,
      timeSlots
    });
  } catch (error) {
    console.error('Error fetching practitioner availability:', error);
    return res.status(500).json({ error: "Failed to fetch availability" });
  }
}

// Helper functions
function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function convertMinutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
```

#### 2.2 Calendar Event Creation

**Endpoint**: `POST /api/create-calendar-event`

**Implementation Guide**:

```javascript
// calendar-event.js
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const ical = require('ical-generator');
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  const { 
    appointmentId,
    userEmail,
    practitionerEmail,
    title,
    description,
    date,
    time,
    duration
  } = req.body;
  
  if (!userEmail || !title || !date || !time || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  try {
    // Create .ics calendar file
    const startDate = new Date(`${date}T${time}`);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    const calendar = ical({
      domain: 'yourdomain.com',
      prodId: {company: 'Your Company', product: 'Therapy Booking System'},
      name: 'Therapy Appointment'
    });
    
    calendar.createEvent({
      start: startDate,
      end: endDate,
      summary: title,
      description,
      location: 'Online',
      organizer: {
        name: 'Therapy Booking',
        email: 'appointments@yourdomain.com'
      },
      attendees: [
        {
          name: 'Client',
          email: userEmail,
          rsvp: true,
          role: 'REQ-PARTICIPANT'
        },
        {
          name: 'Practitioner',
          email: practitionerEmail,
          role: 'REQ-PARTICIPANT'
        }
      ],
      alarms: [
        {
          type: 'display',
          trigger: 3600 // 1 hour before
        }
      ]
    });
    
    const icsContent = calendar.toString();
    
    // Send email with calendar attachment
    const transporter = nodemailer.createTransport({
      // Configure your email provider
    });
    
    await transporter.sendMail({
      from: 'appointments@yourdomain.com',
      to: userEmail,
      cc: practitionerEmail,
      subject: `Calendar Invitation: ${title}`,
      text: `Your appointment has been scheduled. Please find the calendar invitation attached.`,
      html: `<p>Your appointment has been scheduled. Please add it to your calendar.</p>`,
      icalEvent: {
        content: icsContent,
        method: 'REQUEST'
      }
    });
    
    return res.status(200).json({
      eventId: `cal-${appointmentId}`,
      success: true
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return res.status(500).json({ error: "Failed to create calendar event" });
  }
}
```

### 3. Serverless Functions Deployment Guide

#### 3.1 Vercel Deployment

1. Create a `api` directory in your project root
2. Implement your API functions there (e.g., `api/create-zoom-meeting.js`)
3. Deploy with Vercel:
   ```bash
   vercel --prod
   ```

#### 3.2 AWS Lambda Deployment

1. Install Serverless Framework:
   ```bash
   npm install -g serverless
   ```

2. Create a `serverless.yml` configuration
3. Deploy:
   ```bash
   serverless deploy --stage production
   ```

### 4. Database Schema

Here's the database schema you'll need for your Supabase database:

```sql
-- Practitioners table
CREATE TABLE practitioners (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  specialty TEXT,
  reviews INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  price INTEGER,
  image_url TEXT,
  badge TEXT,
  education TEXT,
  degree TEXT,
  location_type TEXT DEFAULT 'online',
  conditions TEXT[],
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  approach TEXT,
  languages TEXT[] DEFAULT ARRAY['English'],
  certifications TEXT[],
  availability TEXT DEFAULT 'Weekdays 9am - 5pm',
  insurance_accepted TEXT[],
  session_format TEXT[],
  email TEXT,
  preferred_video_platform TEXT DEFAULT 'zoom',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Practitioner schedules table
CREATE TABLE practitioner_schedules (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  practitioner_id BIGINT REFERENCES practitioners(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  practitioner_id BIGINT REFERENCES practitioners(id) ON DELETE SET NULL,
  practitioner_name TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  session_type TEXT,
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meeting details table
CREATE TABLE appointment_meetings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  appointment_id BIGINT REFERENCES appointments(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  meeting_url TEXT NOT NULL,
  meeting_id TEXT,
  password TEXT,
  host_url TEXT,
  dial_in_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Testing Guide

1. **Video Meetings Testing**
   - Use sandbox/test accounts from Zoom, Google, and Microsoft
   - Create test meetings and join them to verify functionality

2. **Calendar Integration Testing**
   - Create test calendar events
   - Verify they appear in connected calendars
   - Test availability checks with conflicts

3. **Email Notifications**
   - Use a test email service like Mailtrap
   - Verify all notification templates
   - Check calendar invitations can be accepted

## Production Checklist

- [ ] All API keys and secrets stored in environment variables
- [ ] Error handling implemented for all APIs
- [ ] Rate limiting configured to prevent abuse
- [ ] Timeouts defined for all API calls
- [ ] Fallback mechanisms for when APIs fail
- [ ] CORS properly configured
- [ ] Security headers set (especially for tokens)
- [ ] Log monitoring configured
- [ ] Database backups set up
- [ ] Performance monitoring in place
