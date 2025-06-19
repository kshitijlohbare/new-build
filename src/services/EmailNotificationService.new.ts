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
  private emailProvider: 'sendgrid' | 'mailgun' | 'aws-ses' | 'mock';
  
  private constructor() {
    // Determine which email provider to use based on environment
    this.emailProvider = (process.env.EMAIL_PROVIDER as any) || 'mock';
    
    // In production, verify that we have valid credentials
    if (process.env.NODE_ENV === 'production' && this.emailProvider === 'mock') {
      console.warn('WARNING: Using mock email provider in production environment');
    }
  }

  public static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }
  
  // Production email service integrations
  private async sendEmailViaServiceProvider(to: string, subject: string, htmlBody: string): Promise<boolean> {
    try {
      switch (this.emailProvider) {
        case 'sendgrid':
          // SendGrid integration
          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = { 
            to, 
            from: process.env.EMAIL_FROM || 'noreply@mindfulcare.com', 
            subject, 
            html: htmlBody 
          };
          await sgMail.send(msg);
          await this.logEmailSent(to, subject, 'sendgrid');
          return true;

        case 'mailgun':
          // Mailgun integration
          const formData = require('form-data');
          const Mailgun = require('mailgun.js');
          const mailgun = new Mailgun(formData);
          const mg = mailgun.client({
            username: 'api',
            key: process.env.MAILGUN_API_KEY
          });
          await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.EMAIL_FROM || 'noreply@mindfulcare.com',
            to: [to],
            subject,
            html: htmlBody
          });
          await this.logEmailSent(to, subject, 'mailgun');
          return true;

        case 'aws-ses':
          // AWS SES integration
          const AWS = require('aws-sdk');
          const ses = new AWS.SES({
            region: process.env.AWS_REGION || 'us-east-1',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
          });
          
          const params = {
            Destination: { ToAddresses: [to] },
            Message: {
              Body: { Html: { Data: htmlBody } },
              Subject: { Data: subject }
            },
            Source: process.env.EMAIL_FROM || 'noreply@mindfulcare.com'
          };
          
          await ses.sendEmail(params).promise();
          await this.logEmailSent(to, subject, 'aws-ses');
          return true;

        case 'mock':
        default:
          if (process.env.NODE_ENV === 'production') {
            throw new Error('No email provider configured for production');
          }
          return await this.sendEmailViaMockService(to, subject, htmlBody);
      }
    } catch (error) {
      await this.logEmailError(to, subject, this.emailProvider, error);
      throw error;
    }
  }
  
  // Log email sending to the database for tracking
  private async logEmailSent(to: string, subject: string, provider: string): Promise<void> {
    await supabase.from('email_logs').insert({
      recipient: to,
      subject: subject,
      provider: provider,
      status: 'sent',
      timestamp: new Date().toISOString()
    });
  }
  
  // Log email errors to the database
  private async logEmailError(to: string, subject: string, provider: string, error: any): Promise<void> {
    await supabase.from('email_logs').insert({
      recipient: to,
      subject: subject,
      provider: provider,
      status: 'error',
      error_message: error.message || String(error),
      timestamp: new Date().toISOString()
    });
  }

  // Mock email service (used for development/testing)
  private async sendEmailViaMockService(to: string, subject: string, htmlBody: string): Promise<boolean> {
    // Only log a preview of the email in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      // Replace console.log with structured logging in a real application
      const logger = console;
      logger.info(`✅ Email sent to: ${to}`);
      logger.info(`📧 Subject: ${subject}`);
      logger.info(`📝 Body preview: ${htmlBody.substring(0, 100)}...`);
    }
    
    // Store in email logs for tracking
    await this.logEmailSent(to, subject, 'mock');
    
    return true;
  }

  // Generate the appropriate email template based on data
  private generateEmailTemplate(data: EmailNotificationData): EmailTemplate {
    const {
      recipientName,
      practitionerName,
      date,
      time,
      sessionType,
      meetingUrl,
      notificationType
    } = data;

    let subject = '';
    let body = '';

    switch (notificationType) {
      case 'confirmation':
        subject = `Appointment Confirmed: Your session with ${practitionerName} on ${date}`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h2 style="color: #4a5568; text-align: center;">Your Appointment is Confirmed</h2>
            <p>Hello ${recipientName},</p>
            <p>Your appointment has been successfully scheduled with ${practitionerName}.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 5px 0;"><strong>Session Type:</strong> ${sessionType}</p>
              ${meetingUrl ? `<p style="margin: 15px 0;"><strong>Meeting Link:</strong> <a href="${meetingUrl}" target="_blank" style="color: #3182ce;">${meetingUrl}</a></p>` : ''}
            </div>
            <p>Please make sure to join the session 5 minutes before the scheduled time. If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Manage Appointment</a>
            </div>
            <p style="margin-top: 30px; color: #718096; font-size: 14px;">If you have any questions, please reply to this email or contact our support team.</p>
          </div>
        `;
        break;

      case 'reminder':
        subject = `Reminder: Your appointment with ${practitionerName} tomorrow at ${time}`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h2 style="color: #4a5568; text-align: center;">Appointment Reminder</h2>
            <p>Hello ${recipientName},</p>
            <p>This is a friendly reminder about your upcoming appointment with ${practitionerName}.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Date:</strong> ${date} (tomorrow)</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 5px 0;"><strong>Session Type:</strong> ${sessionType}</p>
              ${meetingUrl ? `<p style="margin: 15px 0;"><strong>Meeting Link:</strong> <a href="${meetingUrl}" target="_blank" style="color: #3182ce;">${meetingUrl}</a></p>` : ''}
            </div>
            <p>Please make sure to join the session 5 minutes before the scheduled time.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${meetingUrl || process.env.NEXT_PUBLIC_APP_URL + '/appointments'}" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Session</a>
            </div>
            <p style="margin-top: 30px; color: #718096; font-size: 14px;">If you need to reschedule, please contact us as soon as possible.</p>
          </div>
        `;
        break;

      case 'cancellation':
        subject = `Your appointment with ${practitionerName} has been cancelled`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h2 style="color: #4a5568; text-align: center;">Appointment Cancelled</h2>
            <p>Hello ${recipientName},</p>
            <p>Your appointment with ${practitionerName} scheduled for ${date} at ${time} has been cancelled.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Cancelled Session:</strong> ${sessionType} on ${date} at ${time}</p>
            </div>
            <p>If you did not request this cancellation or if you have any questions, please contact our support team.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments/new" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Book a New Appointment</a>
            </div>
          </div>
        `;
        break;

      case 'rescheduling':
        subject = `Your appointment with ${practitionerName} has been rescheduled`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h2 style="color: #4a5568; text-align: center;">Appointment Rescheduled</h2>
            <p>Hello ${recipientName},</p>
            <p>Your appointment with ${practitionerName} has been rescheduled.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>New Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>New Time:</strong> ${time}</p>
              <p style="margin: 5px 0;"><strong>Session Type:</strong> ${sessionType}</p>
              ${meetingUrl ? `<p style="margin: 15px 0;"><strong>Meeting Link:</strong> <a href="${meetingUrl}" target="_blank" style="color: #3182ce;">${meetingUrl}</a></p>` : ''}
            </div>
            <p>Please make a note of the new date and time. If you need to make any further changes, please contact us as soon as possible.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Updated Appointment</a>
            </div>
          </div>
        `;
        break;
    }

    return { subject, body };
  }

  public async sendAppointmentNotification(data: EmailNotificationData): Promise<boolean> {
    try {
      const template = this.generateEmailTemplate(data);
      
      // Send the email
      const success = await this.sendEmailViaServiceProvider(
        data.recipientEmail,
        template.subject,
        template.body
      );

      // Log the notification to the database
      if (success) {
        await this.logEmailNotification({
          appointmentId: data.appointmentId,
          recipientEmail: data.recipientEmail,
          notificationType: data.notificationType,
          emailSubject: template.subject,
          status: 'sent'
        });
      }

      return success;
    } catch (error) {
      // Log error to the database
      await this.logEmailNotification({
        appointmentId: data.appointmentId,
        recipientEmail: data.recipientEmail,
        notificationType: data.notificationType,
        emailSubject: `Failed ${data.notificationType} email`,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      
      // Re-throw for caller handling
      throw error;
    }
  }

  private async logEmailNotification(data: {
    appointmentId: number;
    recipientEmail: string;
    notificationType: string;
    emailSubject: string;
    status: 'sent' | 'error';
    errorMessage?: string;
  }): Promise<void> {
    try {
      await supabase.from('notification_logs').insert({
        appointment_id: data.appointmentId,
        recipient_email: data.recipientEmail,
        notification_type: data.notificationType,
        subject: data.emailSubject,
        status: data.status,
        error_message: data.errorMessage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Use a proper logging service in production
      console.error('Exception logging email notification:', error);
    }
  }

  // Schedule reminder emails (implemented with a real job scheduler in production)
  public async scheduleReminderEmail(appointmentId: number): Promise<void> {
    // Get appointment details
    const { data: appointment } = await supabase
      .from('appointments')
      .select('*, practitioners(*)')
      .eq('id', appointmentId)
      .single();
      
    if (!appointment) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }
    
    // In production, we would use a real job scheduler
    // For example with Bull Queue (Redis-based)
    if (process.env.NODE_ENV === 'production') {
      // Example Bull Queue integration
      if (process.env.REDIS_URL) {
        // This would be properly implemented in a separate service
        /*
        const Queue = require('bull');
        const reminderQueue = new Queue('email-reminders', process.env.REDIS_URL);
        
        // Calculate reminder time (24 hours before appointment)
        const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
        const reminderTime = new Date(appointmentDate);
        reminderTime.setDate(reminderTime.getDate() - 1);
        
        // Schedule the job
        await reminderQueue.add(
          {
            appointmentId,
            notificationType: 'reminder',
            recipientEmail: appointment.user_email,
            recipientName: appointment.user_name,
            practitionerName: appointment.practitioners.name
          },
          {
            delay: reminderTime.getTime() - Date.now()
          }
        );
        */
        
        // Log scheduling to database
        await supabase.from('scheduled_notifications').insert({
          appointment_id: appointmentId,
          notification_type: 'reminder',
          scheduled_time: new Date(new Date(appointment.date).getTime() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled'
        });
      } else {
        // Fallback to a mock implementation
        await supabase.from('scheduled_notifications').insert({
          appointment_id: appointmentId,
          notification_type: 'reminder',
          scheduled_time: new Date(new Date(appointment.date).getTime() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled'
        });
      }
    } else {
      // Development mode - just log it
      // Replace with structured logging
      const logger = console;
      logger.info(`📅 Reminder email scheduled for appointment ${appointmentId}`);
    }
  }

  // Send bulk reminder emails (for background processing)
  public async sendDailyReminders(): Promise<void> {
    try {
      // Get tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      // Find all appointments scheduled for tomorrow
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          user_email,
          user_name,
          date,
          time,
          session_type,
          practitioners (
            id,
            name
          ),
          appointment_meetings (
            meeting_url
          )
        `)
        .eq('date', tomorrowString)
        .eq('status', 'confirmed');
        
      if (error) {
        throw new Error(`Error fetching appointments: ${error.message}`);
      }
      
      if (!appointments || appointments.length === 0) {
        // No appointments tomorrow
        return;
      }
      
      // Send reminder email for each appointment
      for (const appointment of appointments) {
        await this.sendAppointmentNotification({
          appointmentId: appointment.id,
          recipientEmail: appointment.user_email,
          recipientName: appointment.user_name,
          practitionerName: appointment.practitioners?.[0]?.name || 'Your Practitioner',
          date: appointment.date,
          time: appointment.time,
          sessionType: appointment.session_type,
          meetingUrl: appointment.appointment_meetings?.[0]?.meeting_url,
          notificationType: 'reminder'
        });
      }
      
      // Replace with structured logging
      const logger = console;
      logger.info(`📧 Sent ${appointments?.length || 0} reminder emails for tomorrow's appointments`);
    } catch (error) {
      // Log error and re-throw
      console.error('Error sending daily reminders:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const emailService = EmailNotificationService.getInstance();
