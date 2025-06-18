import { supabase } from '@/lib/supabase';

interface EmailNotificationData {
  appointmentId: number;
  recipientEmail: string;
  recipientName: string;
  practitionerName: string;
  date: string;
  time: string;
  sessionType: string;
  meetingUrl?: string;
  notificationType: 'confirmation' | 'reminder' | 'cancellation' | 'rescheduling';
}

interface EmailTemplate {
  subject: string;
  body: string;
}

// Browser-safe email service class for handling appointment-related notifications
export class EmailNotificationService {
  private static instance: EmailNotificationService;
  private emailProvider: 'mock';
  
  private constructor() {
    // In browser, always use mock provider
    this.emailProvider = 'mock';
    console.log('[EmailService] Using browser-safe mock email provider');
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }

  // Send an email with the given parameters
  async sendEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
    try {
      // In browser, we use mock provider and just log
      console.log('========================================');
      console.log(`Mock Email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('Body preview:');
      console.log(htmlBody.substring(0, 200) + '...');
      console.log('========================================');
      
      // Store in database for UI access in dev environment
      try {
        await this.storeEmailInDatabase(to, subject, htmlBody);
      } catch (dbError) {
        console.error('Error storing email in database:', dbError);
      }
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Store emails in database for development environment
  private async storeEmailInDatabase(to: string, subject: string, body: string): Promise<void> {
    try {
      await supabase.from('dev_emails').insert({
        recipient: to,
        subject,
        body,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error storing email in database:', error);
    }
  }

  // Send appointment confirmation email
  async sendAppointmentConfirmation(data: EmailNotificationData): Promise<boolean> {
    return await this.sendEmail(
      data.recipientEmail,
      `Appointment Confirmation with ${data.practitionerName}`,
      this.getAppointmentConfirmationHTML(data)
    );
  }

  // Send appointment reminder email
  async sendAppointmentReminder(data: EmailNotificationData): Promise<boolean> {
    return await this.sendEmail(
      data.recipientEmail,
      `Reminder: Your Appointment with ${data.practitionerName}`,
      this.getAppointmentReminderHTML(data)
    );
  }

  // Send appointment cancellation email
  async sendAppointmentCancellation(data: EmailNotificationData): Promise<boolean> {
    return await this.sendEmail(
      data.recipientEmail,
      `Appointment Cancellation - ${data.date}`,
      this.getAppointmentCancellationHTML(data)
    );
  }

  // Send appointment rescheduling email
  async sendAppointmentRescheduling(data: EmailNotificationData): Promise<boolean> {
    return await this.sendEmail(
      data.recipientEmail,
      `Appointment Rescheduled with ${data.practitionerName}`,
      this.getAppointmentReschedulingHTML(data)
    );
  }

  // Schedule appointment reminders 
  async scheduleReminders(
    data: EmailNotificationData, 
    reminderTimes: {days: number, hours?: number}[] = [
      {days: 1}, // 1 day before
      {days: 0, hours: 1} // 1 hour before
    ]
  ): Promise<void> {
    try {
      const appointmentDate = new Date(`${data.date} ${data.time}`);
      
      // In browser, just store reminders in database for scheduler to pick up
      await Promise.all(reminderTimes.map(async (time) => {
        const reminderDate = new Date(appointmentDate.getTime());
        
        // Adjust the reminder date based on the specified time
        if (time.days) {
          reminderDate.setDate(reminderDate.getDate() - time.days);
        }
        
        if (time.hours) {
          reminderDate.setHours(reminderDate.getHours() - (time.hours || 0));
        }
        
        // Don't schedule reminders in the past
        if (reminderDate > new Date()) {
          await supabase.from('appointment_reminders').insert({
            appointment_id: data.appointmentId,
            recipient_email: data.recipientEmail,
            recipient_name: data.recipientName,
            practitioner_name: data.practitionerName,
            appointment_date: appointmentDate.toISOString(),
            reminder_date: reminderDate.toISOString(),
            session_type: data.sessionType,
            meeting_url: data.meetingUrl || null,
            sent: false,
          });
        }
      }));
      
      console.log(`[EmailService] Scheduled reminders for appointment ${data.appointmentId}`);
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  }
  
  // Private helper methods for email templates
  private getAppointmentConfirmationHTML(data: EmailNotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
        <div style="text-align: center; padding: 10px 0; background-color: #f7fafc; margin-bottom: 20px;">
          <h1 style="color: #4a5568; margin: 0;">Your Appointment is Confirmed!</h1>
        </div>
        
        <div style="padding: 0 20px;">
          <p style="font-size: 16px;">Hello ${data.recipientName},</p>
          
          <p style="font-size: 16px;">Your appointment with ${data.practitionerName} has been confirmed.</p>
          
          <div style="background-color: #f7fafc; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4a5568;">Appointment Details:</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${data.time}</p>
            <p style="margin: 5px 0;"><strong>Session Type:</strong> ${data.sessionType}</p>
            ${data.meetingUrl ? `<p style="margin: 5px 0;"><strong>Meeting Link:</strong> <a href="${data.meetingUrl}" style="color: #4299e1;">Click here to join</a></p>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  private getAppointmentReminderHTML(data: EmailNotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
        <div style="text-align: center; padding: 10px 0; background-color: #f7fafc; margin-bottom: 20px;">
          <h1 style="color: #4a5568; margin: 0;">Appointment Reminder</h1>
        </div>
        
        <div style="padding: 0 20px;">
          <p style="font-size: 16px;">Hello ${data.recipientName},</p>
          
          <p style="font-size: 16px;">This is a friendly reminder about your upcoming appointment with ${data.practitionerName}.</p>
          
          <div style="background-color: #f7fafc; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4a5568;">Appointment Details:</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${data.time}</p>
            <p style="margin: 5px 0;"><strong>Session Type:</strong> ${data.sessionType}</p>
            ${data.meetingUrl ? `<p style="margin: 5px 0;"><strong>Meeting Link:</strong> <a href="${data.meetingUrl}" style="color: #4299e1;">Click here to join</a></p>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  private getAppointmentCancellationHTML(data: EmailNotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
        <div style="text-align: center; padding: 10px 0; background-color: #f7fafc; margin-bottom: 20px;">
          <h1 style="color: #4a5568; margin: 0;">Appointment Cancelled</h1>
        </div>
        
        <div style="padding: 0 20px;">
          <p style="font-size: 16px;">Hello ${data.recipientName},</p>
          
          <p style="font-size: 16px;">Your appointment with ${data.practitionerName} on ${data.date} at ${data.time} has been cancelled.</p>
        </div>
      </div>
    `;
  }
  
  private getAppointmentReschedulingHTML(data: EmailNotificationData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
        <div style="text-align: center; padding: 10px 0; background-color: #f7fafc; margin-bottom: 20px;">
          <h1 style="color: #4a5568; margin: 0;">Appointment Rescheduled</h1>
        </div>
        
        <div style="padding: 0 20px;">
          <p style="font-size: 16px;">Hello ${data.recipientName},</p>
          
          <p style="font-size: 16px;">Your appointment with ${data.practitionerName} has been rescheduled.</p>
          
          <div style="background-color: #f7fafc; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4a5568;">New Appointment Details:</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${data.time}</p>
            <p style="margin: 5px 0;"><strong>Session Type:</strong> ${data.sessionType}</p>
            ${data.meetingUrl ? `<p style="margin: 5px 0;"><strong>Meeting Link:</strong> <a href="${data.meetingUrl}" style="color: #4299e1;">Click here to join</a></p>` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

// Singleton export
export const emailService = EmailNotificationService.getInstance();
