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

// Email service class for handling all appointment-related notifications
export class EmailNotificationService {
  private static instance: EmailNotificationService;
  
  // Mock email service - in production, this would integrate with services like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Nodemailer with SMTP
  private emailProvider = 'mock'; // 'sendgrid' | 'mailgun' | 'aws-ses' | 'mock'

  private constructor() {}

  public static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }

  // Generate email templates based on notification type
  private generateEmailTemplate(data: EmailNotificationData): EmailTemplate {
    const { notificationType, recipientName, practitionerName, date, time, sessionType, meetingUrl } = data;
    
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    switch (notificationType) {
      case 'confirmation':
        return {
          subject: `Appointment Confirmed with ${practitionerName}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #148BAF; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Appointment Confirmed</h1>
              </div>
              
              <div style="padding: 30px; background-color: #f9f9f9;">
                <p>Dear ${recipientName},</p>
                
                <p>Your appointment has been successfully confirmed! Here are the details:</p>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #148BAF;">
                  <h3 style="margin-top: 0; color: #148BAF;">Appointment Details</h3>
                  <p><strong>Practitioner:</strong> ${practitionerName}</p>
                  <p><strong>Session Type:</strong> ${sessionType}</p>
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Time:</strong> ${time}</p>
                  ${meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${meetingUrl}" style="color: #148BAF;">${meetingUrl}</a></p>` : ''}
                </div>
                
                <div style="background-color: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="margin-top: 0; color: #148BAF;">What to Expect</h4>
                  <ul style="margin: 10px 0;">
                    <li>Please join the session 5 minutes early</li>
                    <li>Ensure you have a stable internet connection</li>
                    <li>Find a quiet, private space for your session</li>
                    <li>Have any relevant documents or notes ready</li>
                  </ul>
                </div>
                
                <p>If you need to reschedule or cancel this appointment, please log into your account or contact us at least 24 hours in advance.</p>
                
                <p>We look forward to your session!</p>
                
                <p>Best regards,<br>The MindfulCare Team</p>
              </div>
              
              <div style="background-color: #148BAF; color: white; padding: 15px; text-align: center; font-size: 12px;">
                <p style="margin: 0;">© 2025 MindfulCare. All rights reserved.</p>
              </div>
            </div>
          `
        };

      case 'reminder':
        return {
          subject: `Reminder: Appointment with ${practitionerName} Tomorrow`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f39c12; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Appointment Reminder</h1>
              </div>
              
              <div style="padding: 30px; background-color: #f9f9f9;">
                <p>Dear ${recipientName},</p>
                
                <p>This is a friendly reminder about your upcoming appointment:</p>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
                  <h3 style="margin-top: 0; color: #f39c12;">Tomorrow's Appointment</h3>
                  <p><strong>Practitioner:</strong> ${practitionerName}</p>
                  <p><strong>Session Type:</strong> ${sessionType}</p>
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Time:</strong> ${time}</p>
                  ${meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${meetingUrl}" style="color: #f39c12;">${meetingUrl}</a></p>` : ''}
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
                  <h4 style="margin-top: 0; color: #856404;">Pre-Session Checklist</h4>
                  <ul style="margin: 10px 0; color: #856404;">
                    <li>Test your internet connection and camera/microphone</li>
                    <li>Choose a quiet, well-lit space</li>
                    <li>Have water and tissues nearby</li>
                    <li>Review any homework or notes from previous sessions</li>
                  </ul>
                </div>
                
                <p>Looking forward to seeing you tomorrow!</p>
                
                <p>Best regards,<br>The MindfulCare Team</p>
              </div>
            </div>
          `
        };

      case 'cancellation':
        return {
          subject: `Appointment Cancelled - ${practitionerName}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #e74c3c; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Appointment Cancelled</h1>
              </div>
              
              <div style="padding: 30px; background-color: #f9f9f9;">
                <p>Dear ${recipientName},</p>
                
                <p>We're writing to confirm that your appointment has been cancelled as requested:</p>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
                  <h3 style="margin-top: 0; color: #e74c3c;">Cancelled Appointment</h3>
                  <p><strong>Practitioner:</strong> ${practitionerName}</p>
                  <p><strong>Session Type:</strong> ${sessionType}</p>
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Time:</strong> ${time}</p>
                </div>
                
                <p>If you'd like to schedule a new appointment, please log into your account or contact us.</p>
                
                <p>We hope to see you again soon!</p>
                
                <p>Best regards,<br>The MindfulCare Team</p>
              </div>
            </div>
          `
        };

      case 'rescheduling':
        return {
          subject: `Appointment Rescheduled with ${practitionerName}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #3498db; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Appointment Rescheduled</h1>
              </div>
              
              <div style="padding: 30px; background-color: #f9f9f9;">
                <p>Dear ${recipientName},</p>
                
                <p>Your appointment has been successfully rescheduled. Here are your new appointment details:</p>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
                  <h3 style="margin-top: 0; color: #3498db;">New Appointment Details</h3>
                  <p><strong>Practitioner:</strong> ${practitionerName}</p>
                  <p><strong>Session Type:</strong> ${sessionType}</p>
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Time:</strong> ${time}</p>
                  ${meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${meetingUrl}" style="color: #3498db;">${meetingUrl}</a></p>` : ''}
                </div>
                
                <p>Thank you for rescheduling in advance. We look forward to your session!</p>
                
                <p>Best regards,<br>The MindfulCare Team</p>
              </div>
            </div>
          `
        };

      default:
        throw new Error(`Unknown notification type: ${notificationType}`);
    }
  }

  // Mock email sending function - replace with actual email service
  private async sendEmailViaMockService(to: string, subject: string, htmlBody: string): Promise<boolean> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success/failure (90% success rate for demo)
    const success = Math.random() > 0.1;
    
    if (success) {
      console.log(`✅ [MOCK EMAIL] Sent to: ${to}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📝 Body preview: ${htmlBody.substring(0, 100)}...`);
      return true;
    } else {
      console.error(`❌ [MOCK EMAIL] Failed to send to: ${to}`);
      throw new Error('Mock email service failure');
    }
  }

  // TODO: Implement real email service integrations
  private async sendEmailViaServiceProvider(to: string, subject: string, htmlBody: string): Promise<boolean> {
    switch (this.emailProvider) {
      case 'sendgrid':
        // TODO: Integrate with SendGrid
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // const msg = { to, from: 'noreply@mindfulcare.com', subject, html: htmlBody };
        // await sgMail.send(msg);
        throw new Error('SendGrid integration not implemented yet');

      case 'mailgun':
        // TODO: Integrate with Mailgun
        throw new Error('Mailgun integration not implemented yet');

      case 'aws-ses':
        // TODO: Integrate with AWS SES
        throw new Error('AWS SES integration not implemented yet');

      case 'mock':
      default:
        return await this.sendEmailViaMockService(to, subject, htmlBody);
    }
  }

  // Main method to send email notifications
  public async sendAppointmentNotification(data: EmailNotificationData): Promise<boolean> {
    try {
      const template = this.generateEmailTemplate(data);
      
      // Send the email
      const success = await this.sendEmailViaServiceProvider(
        data.recipientEmail,
        template.subject,
        template.body
      );

      // Log the notification in the database
      if (success) {
        await this.logEmailNotification({
          appointmentId: data.appointmentId,
          recipientEmail: data.recipientEmail,
          notificationType: data.notificationType,
          emailSubject: template.subject,
          emailBody: template.body,
          status: 'sent'
        });
      }

      return success;
    } catch (error) {
      console.error('Error sending email notification:', error);
      
      // Log the failed notification
      await this.logEmailNotification({
        appointmentId: data.appointmentId,
        recipientEmail: data.recipientEmail,
        notificationType: data.notificationType,
        emailSubject: '',
        emailBody: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      return false;
    }
  }

  // Log email notification to database
  private async logEmailNotification(data: {
    appointmentId: number;
    recipientEmail: string;
    notificationType: string;
    emailSubject: string;
    emailBody: string;
    status: 'sent' | 'failed' | 'pending';
    errorMessage?: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('email_notifications')
        .insert({
          appointment_id: data.appointmentId,
          recipient_email: data.recipientEmail,
          notification_type: data.notificationType,
          email_subject: data.emailSubject,
          email_body: data.emailBody,
          status: data.status,
          error_message: data.errorMessage || null
        });

      if (error) {
        console.error('Error logging email notification:', error);
      }
    } catch (error) {
      console.error('Exception logging email notification:', error);
    }
  }

  // Schedule reminder emails (would typically be handled by a background job)
  public async scheduleReminderEmail(appointmentId: number): Promise<void> {
    // In a real implementation, this would:
    // 1. Calculate when to send the reminder (24 hours before appointment)
    // 2. Schedule the email using a job queue system like:
    //    - Bull Queue (Redis-based)
    //    - AWS SQS with Lambda
    //    - Celery (Python)
    //    - Sidekiq (Ruby)
    
    console.log(`📅 [MOCK] Reminder email scheduled for appointment ${appointmentId}`);
    
    // For demo purposes, we'll just log that it would be scheduled
    // In production, you'd insert into a job queue or scheduled tasks table
  }

  // Send bulk reminder emails (for background processing)
  public async sendDailyReminders(): Promise<void> {
    try {
      // Get appointments for tomorrow that need reminders
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];

      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          time,
          session_type,
          practitioner_name,
          user_id
        `)
        .eq('date', tomorrowString)
        .eq('status', 'confirmed');

      if (error) {
        console.error('Error fetching appointments for reminders:', error);
        return;
      }

      // Send reminder for each appointment
      for (const appointment of appointments || []) {
        // Get user email from auth.users (would need to join or separate query)
        // For demo purposes, using placeholder email
        const reminderData: EmailNotificationData = {
          appointmentId: appointment.id,
          recipientEmail: 'user@example.com', // Would fetch from user profile
          recipientName: 'User', // Would fetch from user profile
          practitionerName: appointment.practitioner_name,
          date: appointment.date,
          time: appointment.time,
          sessionType: appointment.session_type,
          notificationType: 'reminder'
        };

        await this.sendAppointmentNotification(reminderData);
      }

      console.log(`📧 Sent ${appointments?.length || 0} reminder emails for tomorrow's appointments`);
    } catch (error) {
      console.error('Error sending daily reminders:', error);
    }
  }
}

// Export a singleton instance
export const emailService = EmailNotificationService.getInstance();
