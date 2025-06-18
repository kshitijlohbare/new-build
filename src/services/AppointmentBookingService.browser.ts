import { supabase } from '@/lib/supabase';
import { emailService } from './EmailNotificationService.browser';

interface BookingData {
  userId: string;
  practitionerId: number;
  practitionerName: string;
  date: string;
  time: string;
  sessionType: string;
  duration?: number;
  userEmail: string;
  userName: string;
  notes?: string;
  videoMeetingConfig?: VideoMeetingConfig;
}

interface VideoMeetingConfig {
  platform: 'zoom' | 'google-meet' | 'microsoft-teams';
  apiKey?: string;
  apiSecret?: string;
  hostEmail?: string;
  duration?: number; // in minutes
}

interface VideoMeetingDetails {
  meetingId: string;
  meetingUrl: string;
  password?: string;
  hostUrl?: string;
  platform: string;
}

interface BookingResponse {
  success: boolean;
  appointmentId?: number;
  meetingDetails?: VideoMeetingDetails;
  error?: string;
}

// Browser-safe version of AppointmentBookingService
export class AppointmentBookingService {
  private static instance: AppointmentBookingService;
  
  private constructor() {
    console.log('[BookingService] Using browser-safe mock appointment service');
  }
  
  // Singleton pattern
  public static getInstance(): AppointmentBookingService {
    if (!AppointmentBookingService.instance) {
      AppointmentBookingService.instance = new AppointmentBookingService();
    }
    return AppointmentBookingService.instance;
  }

  // Create a new appointment booking
  async createBooking(bookingData: BookingData): Promise<BookingResponse> {
    try {
      console.log('[BookingService] Creating appointment booking with data:', bookingData);
      
      // Step 1: Insert into appointments table
      const { data: appointmentData, error } = await supabase
        .from('appointments')
        .insert({
          user_id: bookingData.userId,
          practitioner_id: bookingData.practitionerId,
          date: bookingData.date,
          time: bookingData.time,
          duration: bookingData.duration || 50,
          session_type: bookingData.sessionType,
          notes: bookingData.notes || null,
          status: 'confirmed'
        })
        .select();
      
      if (error) {
        console.error('Error creating appointment:', error);
        return { success: false, error: error.message };
      }
      
      const appointmentId = appointmentData[0].id;
      let meetingDetails = null;
      
      // Step 2: Create a video meeting if requested
      if (bookingData.videoMeetingConfig) {
        try {
          console.log('[BookingService] Video meeting would be created (mock)');
          meetingDetails = {
            meetingId: `mock-${Date.now()}`,
            meetingUrl: 'https://example.com/mock-meeting',
            password: 'mockpass',
            platform: bookingData.videoMeetingConfig.platform
          };
          
          // Store meeting details
          await supabase
            .from('appointment_meetings')
            .insert({
              appointment_id: appointmentId,
              meeting_id: meetingDetails.meetingId,
              meeting_url: meetingDetails.meetingUrl,
              meeting_password: meetingDetails.password,
              platform: bookingData.videoMeetingConfig.platform
            });
        } catch (meetingError) {
          console.error('Error creating video meeting:', meetingError);
          // Don't fail the entire booking if video meeting creation fails
        }
      }

      // Step 3: Send confirmation email
      try {
        await emailService.sendAppointmentConfirmation({
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

        // Schedule reminder emails
        await emailService.scheduleReminders({
          appointmentId,
          recipientEmail: bookingData.userEmail,
          recipientName: bookingData.userName,
          practitionerName: bookingData.practitionerName,
          date: bookingData.date,
          time: bookingData.time,
          sessionType: bookingData.sessionType,
          meetingUrl: meetingDetails?.meetingUrl,
          notificationType: 'reminder'
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
      
      console.log('[BookingService] Appointment created successfully:', appointmentId);
      return {
        success: true,
        appointmentId,
        meetingDetails
      };
      
    } catch (error) {
      console.error('Error in booking process:', error);
      return { success: false, error: 'An unexpected error occurred during booking' };
    }
  }
  
  // Cancel an existing appointment
  async cancelAppointment(appointmentId: number, userId: string): Promise<{ success: boolean, error?: string }> {
    try {
      // Fetch the appointment for email notification
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          users!appointments_user_id_fkey (email, name),
          practitioners!appointments_practitioner_id_fkey (name),
          appointment_meetings(*)
        `)
        .eq('id', appointmentId)
        .eq('user_id', userId)
        .single();
      
      if (fetchError || !appointment) {
        return { success: false, error: 'Appointment not found' };
      }
      
      // Update the appointment status
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', appointmentId);
      
      if (updateError) {
        return { success: false, error: updateError.message };
      }
      
      // Send cancellation notification
      const userEmail = appointment.users.email;
      const userName = appointment.users.name;
      
      console.log('[BookingService] Mock video meeting would be cancelled');
      console.log('[BookingService] Mock calendar event would be removed');
      
      // Send cancellation email
      await emailService.sendAppointmentCancellation({
        appointmentId,
        recipientEmail: userEmail,
        recipientName: userName,
        practitionerName: appointment.practitioners.name,
        date: appointment.date,
        time: appointment.time,
        sessionType: appointment.session_type,
        notificationType: 'cancellation'
      });

      return { success: true };
      
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return { success: false, error: 'An error occurred while cancelling the appointment' };
    }
  }

  // Reschedule an existing appointment
  async rescheduleAppointment(
    appointmentId: number, 
    userId: string, 
    newDate: string,
    newTime: string
  ): Promise<{ success: boolean, error?: string }> {
    try {
      // Fetch the appointment
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          users!appointments_user_id_fkey (email, name),
          practitioners!appointments_practitioner_id_fkey (name),
          appointment_meetings(*)
        `)
        .eq('id', appointmentId)
        .eq('user_id', userId)
        .single();
      
      if (fetchError || !appointment) {
        return { success: false, error: 'Appointment not found' };
      }
      
      // Update the appointment time
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ 
          date: newDate, 
          time: newTime,
          updated_at: new Date().toISOString(),
          status: 'rescheduled'
        })
        .eq('id', appointmentId);
      
      if (updateError) {
        return { success: false, error: updateError.message };
      }
      
      const userEmail = appointment.users.email;
      const userName = appointment.users.name;
      
      console.log('[BookingService] Mock video meeting would be rescheduled');
      console.log('[BookingService] Mock calendar event would be updated');
      
      // Send rescheduling notification
      await emailService.sendAppointmentRescheduling({
        appointmentId,
        recipientEmail: userEmail,
        recipientName: userName,
        practitionerName: appointment.practitioners.name,
        date: newDate,
        time: newTime,
        sessionType: appointment.session_type,
        meetingUrl: appointment.appointment_meetings?.[0] ? appointment.appointment_meetings[0].meeting_url : undefined,
        notificationType: 'rescheduling'
      });

      return { success: true };
      
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return { success: false, error: 'An error occurred while rescheduling the appointment' };
    }
  }
}

// Singleton export
export const appointmentService = AppointmentBookingService.getInstance();
