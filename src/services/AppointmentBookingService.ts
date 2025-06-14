import { supabase } from '@/lib/supabase';
import { emailService } from './EmailNotificationService';

interface BookingData {
  userId: string;
  practitionerId: number;
  practitionerName: string;
  date: string;
  time: string;
  sessionType: string;
  userEmail: string;
  userName: string;
  videoMeetingConfig?: {
    platform: 'zoom' | 'google-meet' | 'microsoft-teams' | 'other';
    hostEmail: string;
  };
}

interface MeetingDetails {
  platform: string;
  meetingUrl: string;
  meetingId?: string;
  meetingPassword?: string;
}

// Comprehensive appointment booking service
export class AppointmentBookingService {
  private static instance: AppointmentBookingService;

  private constructor() {}

  public static getInstance(): AppointmentBookingService {
    if (!AppointmentBookingService.instance) {
      AppointmentBookingService.instance = new AppointmentBookingService();
    }
    return AppointmentBookingService.instance;
  }

  // Create a new appointment with video meeting and email notification
  public async createAppointment(bookingData: BookingData): Promise<{ success: boolean; appointmentId?: number; error?: string }> {
    try {
      // Step 1: Create the appointment record
      const appointmentData = {
        user_id: bookingData.userId,
        practitioner_id: bookingData.practitionerId,
        practitioner_name: bookingData.practitionerName,
        date: bookingData.date,
        time: bookingData.time,
        session_type: bookingData.sessionType,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        return { success: false, error: appointmentError.message };
      }

      const appointmentId = appointment.id as number;

      // Step 2: Create video meeting if configured
      let meetingDetails: MeetingDetails | null = null;
      if (bookingData.videoMeetingConfig) {
        try {
          meetingDetails = await this.createVideoMeeting(
            appointmentId,
            bookingData.videoMeetingConfig,
            bookingData.userEmail
          );
        } catch (meetingError) {
          console.error('Error creating video meeting:', meetingError);
          // Don't fail the entire booking if video meeting creation fails
          // The appointment is still valid, just without a meeting link
        }
      }

      // Step 3: Send confirmation email
      try {
        await emailService.sendAppointmentNotification({
          appointmentId,
          recipientEmail: bookingData.userEmail,
          recipientName: bookingData.userName,
          practitionerName: bookingData.practitionerName,
          date: bookingData.date,
          time: bookingData.time,
          sessionType: bookingData.sessionType,
          meetingUrl: meetingDetails?.meetingUrl,
          notificationType: 'confirmation'
        });

        // Schedule reminder email for 24 hours before
        await emailService.scheduleReminderEmail(appointmentId);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the booking if email fails
      }

      // Step 4: Add to practitioner's calendar (if integrated)
      try {
        await this.addToCalendar(appointmentId, bookingData);
      } catch (calendarError) {
        console.error('Error adding to calendar:', calendarError);
        // Don't fail the booking if calendar integration fails
      }

      return { success: true, appointmentId };
    } catch (error) {
      console.error('Error in createAppointment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Create video meeting based on platform
  private async createVideoMeeting(
    appointmentId: number,
    config: { platform: string; hostEmail: string },
    guestEmail: string
  ): Promise<MeetingDetails> {
    const { platform, hostEmail } = config;

    let meetingDetails: MeetingDetails;

    switch (platform) {
      case 'zoom':
        meetingDetails = await this.createZoomMeeting(appointmentId, hostEmail, guestEmail);
        break;
      case 'google-meet':
        meetingDetails = await this.createGoogleMeet(appointmentId, hostEmail, guestEmail);
        break;
      case 'microsoft-teams':
        meetingDetails = await this.createTeamsMeeting(appointmentId, hostEmail, guestEmail);
        break;
      default:
        meetingDetails = await this.createGenericMeeting(appointmentId, platform);
    }

    // Store meeting details in database
    await this.storeMeetingDetails(appointmentId, meetingDetails, hostEmail, guestEmail);

    return meetingDetails;
  }

  // Mock Zoom meeting creation - in production, use Zoom API
  private async createZoomMeeting(appointmentId: number, _hostEmail: string, _guestEmail: string): Promise<MeetingDetails> {
    // TODO: Implement actual Zoom API integration
    // const zoomClient = new ZoomApi({ apiKey, apiSecret });
    // const meeting = await zoomClient.meetings.create({...});

    // Mock implementation for demo
    const meetingId = `zoom-${appointmentId}-${Date.now()}`;
    const meetingPassword = Math.random().toString(36).substring(2, 8);
    
    console.log(`🎥 [MOCK] Creating Zoom meeting for appointment ${appointmentId}`);
    
    return {
      platform: 'zoom',
      meetingUrl: `https://zoom.us/j/${meetingId}?pwd=${meetingPassword}`,
      meetingId,
      meetingPassword
    };
  }

  // Mock Google Meet creation - in production, use Google Calendar API
  private async createGoogleMeet(appointmentId: number, _hostEmail: string, _guestEmail: string): Promise<MeetingDetails> {
    // TODO: Implement actual Google Calendar API integration
    // const calendar = google.calendar({ version: 'v3', auth });
    // const event = await calendar.events.insert({...});

    // Mock implementation for demo
    const meetingId = `meet-${appointmentId}-${Date.now()}`;
    
    console.log(`🎥 [MOCK] Creating Google Meet for appointment ${appointmentId}`);
    
    return {
      platform: 'google-meet',
      meetingUrl: `https://meet.google.com/${meetingId}`,
      meetingId
    };
  }

  // Mock Microsoft Teams meeting creation
  private async createTeamsMeeting(appointmentId: number, _hostEmail: string, _guestEmail: string): Promise<MeetingDetails> {
    // TODO: Implement actual Microsoft Graph API integration
    // const graphClient = Client.init({ authProvider });
    // const meeting = await graphClient.me.onlineMeetings.post({...});

    // Mock implementation for demo
    const meetingId = `teams-${appointmentId}-${Date.now()}`;
    
    console.log(`🎥 [MOCK] Creating Teams meeting for appointment ${appointmentId}`);
    
    return {
      platform: 'microsoft-teams',
      meetingUrl: `https://teams.microsoft.com/l/meetup-join/${meetingId}`,
      meetingId
    };
  }

  // Generic meeting link creation
  private async createGenericMeeting(appointmentId: number, platform: string): Promise<MeetingDetails> {
    const meetingId = `${platform}-${appointmentId}-${Date.now()}`;
    
    return {
      platform,
      meetingUrl: `https://${platform}.example.com/meeting/${meetingId}`,
      meetingId
    };
  }

  // Store meeting details in database
  private async storeMeetingDetails(
    appointmentId: number,
    meetingDetails: MeetingDetails,
    hostEmail: string,
    guestEmail: string
  ): Promise<void> {
    const { error } = await supabase
      .from('appointment_meetings')
      .insert({
        appointment_id: appointmentId,
        platform: meetingDetails.platform,
        meeting_url: meetingDetails.meetingUrl,
        meeting_id: meetingDetails.meetingId,
        meeting_password: meetingDetails.meetingPassword,
        host_email: hostEmail,
        guest_email: guestEmail
      });

    if (error) {
      console.error('Error storing meeting details:', error);
      throw new Error('Failed to store meeting details');
    }
  }

  // Add appointment to practitioner's calendar
  private async addToCalendar(appointmentId: number, bookingData: BookingData): Promise<void> {
    // Check if practitioner has calendar integration
    const { data: integration, error } = await supabase
      .from('calendar_integrations')
      .select('*')
      .eq('practitioner_id', bookingData.practitionerId)
      .eq('is_active', true)
      .single();

    if (error || !integration) {
      console.log(`No active calendar integration found for practitioner ${bookingData.practitionerId}`);
      return;
    }

    // Add to calendar based on type
    switch (integration.calendar_type) {
      case 'google':
        await this.addToGoogleCalendar(appointmentId, bookingData, integration);
        break;
      case 'microsoft':
        await this.addToOutlookCalendar(appointmentId, bookingData, integration);
        break;
      default:
        console.log(`Unsupported calendar type: ${integration.calendar_type}`);
    }
  }

  // Mock Google Calendar integration
  private async addToGoogleCalendar(appointmentId: number, _bookingData: BookingData, _integration: any): Promise<void> {
    // TODO: Implement actual Google Calendar API
    console.log(`📅 [MOCK] Adding appointment ${appointmentId} to Google Calendar`);
    
    // In production, this would:
    // 1. Use the stored access token to authenticate
    // 2. Create a calendar event with meeting details
    // 3. Invite the patient to the event
    // 4. Store the calendar event ID for future updates
  }

  // Mock Outlook Calendar integration
  private async addToOutlookCalendar(appointmentId: number, _bookingData: BookingData, _integration: any): Promise<void> {
    // TODO: Implement actual Microsoft Graph API
    console.log(`📅 [MOCK] Adding appointment ${appointmentId} to Outlook Calendar`);
    
    // In production, this would:
    // 1. Use Microsoft Graph API with stored tokens
    // 2. Create calendar event with Teams meeting if configured
    // 3. Send calendar invitation to patient
    // 4. Store event ID for future reference
  }

  // Reschedule an existing appointment
  public async rescheduleAppointment(
    appointmentId: number,
    newDate: string,
    newTime: string,
    userEmail: string,
    userName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Update appointment
      const { data: appointment, error: updateError } = await supabase
        .from('appointments')
        .update({
          date: newDate,
          time: newTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .select('*, appointment_meetings(*)')
        .single();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Update video meeting if exists
      if (appointment.appointment_meetings?.[0]) {
        // In production, you might need to update the actual meeting time
        // For now, the existing meeting link remains valid
      }

      // Send rescheduling notification
      await emailService.sendAppointmentNotification({
        appointmentId,
        recipientEmail: userEmail,
        recipientName: userName,
        practitionerName: appointment.practitioner_name as string,
        date: newDate,
        time: newTime,
        sessionType: appointment.session_type as string,
        meetingUrl: appointment.appointment_meetings?.[0] ? (appointment.appointment_meetings[0] as any).meeting_url : undefined,
        notificationType: 'rescheduling'
      });

      return { success: true };
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Cancel an appointment
  public async cancelAppointment(
    appointmentId: number,
    userEmail: string,
    userName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Update appointment status
      const { data: appointment, error: updateError } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .select()
        .single();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // TODO: Cancel video meeting if exists
      // TODO: Remove from calendar if integrated

      // Send cancellation notification
      await emailService.sendAppointmentNotification({
        appointmentId,
        recipientEmail: userEmail,
        recipientName: userName,
        practitionerName: appointment.practitioner_name as string,
        date: appointment.date as string,
        time: appointment.time as string,
        sessionType: appointment.session_type as string,
        notificationType: 'cancellation'
      });

      return { success: true };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Get appointment with meeting details
  public async getAppointmentWithMeeting(appointmentId: number) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        appointment_meetings (*)
      `)
      .eq('id', appointmentId)
      .single();

    if (error) {
      console.error('Error fetching appointment:', error);
      return null;
    }

    return data;
  }
}

// Export singleton instance
export const appointmentService = AppointmentBookingService.getInstance();
