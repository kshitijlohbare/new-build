// Email service utility for sending notifications
import { supabase } from './supabase';

// Function to send an email notification
// In a real implementation, this would integrate with an email service provider like SendGrid or AWS SES
export async function sendEmailNotification(
  recipientEmail: string, 
  subject: string, 
  htmlContent: string,
  metadata?: {
    practitionerId?: number;
    appointmentId?: number;
    notificationType?: string;
  }
) {
  try {
    // In a production environment, replace this with actual email sending logic
    // For example, using SendGrid:
    // await sendgrid.send({ to: recipientEmail, from: 'noreply@yourapp.com', subject, html: htmlContent });
    
    // For now, we'll just log the email for demonstration purposes
    console.log('Email notification would be sent:');
    console.log(`To: ${recipientEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${htmlContent}`);
    
    // Store notification record in database if metadata is provided
    if (metadata?.practitionerId && metadata?.appointmentId) {
      try {
        const { error } = await supabase
          .from('practitioner_notifications')
          .insert([{
            practitioner_id: metadata.practitionerId,
            appointment_id: metadata.appointmentId,
            notification_type: metadata.notificationType || 'booking_notification',
            title: subject,
            message: stripHtml(htmlContent),
            email_sent: true,
            email_sent_to: recipientEmail
          }]);
          
        if (error) {
          console.error('Error recording notification in database:', error);
        }
      } catch (dbError) {
        console.error('Failed to record notification in database:', dbError);
        // Continue with the function even if recording fails
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return { success: false, error };
  }
}

// Helper function to strip HTML tags for storing in database
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ')
             .replace(/\\s+/g, ' ')
             .trim();
}

// Function to notify practitioner about a new booking
export async function notifyPractitionerAboutBooking(
  practitionerId: number,
  clientName: string, 
  appointmentDate: string, 
  appointmentTime: string, 
  sessionType: string,
  appointmentId?: number
) {
  try {
    // Fetch practitioner's email from the database
    // This assumes practitioners have an 'email' field or are linked to a user record
    const { data: practitioner, error } = await supabase
      .from('practitioners')
      .select('user_id, email')
      .eq('id', practitionerId)
      .single();
    
    if (error || !practitioner) {
      console.error('Error fetching practitioner data:', error);
      return { success: false, error: error || new Error('Practitioner not found') };
    }
    
    // If practitioner has an email field directly
    if (practitioner.email) {
      return await sendEmailNotification(
        practitioner.email as string,
        'New Appointment Booked',
        generateAppointmentEmailTemplate(clientName, appointmentDate, appointmentTime, sessionType),
        { practitionerId, appointmentId, notificationType: 'booking_created' }
      );
    }
    
    // If practitioners are linked to users, get the email from user profiles
    if (practitioner.user_id) {
      // For security reasons, you typically can't access auth.users directly
      // Instead, we'll use a profiles table that should contain the email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', practitioner.user_id)
        .single();
      
      if (!userError && userData?.email) {
        return await sendEmailNotification(
          userData.email as string,
          'New Appointment Booked',
          generateAppointmentEmailTemplate(clientName, appointmentDate, appointmentTime, sessionType),
          { practitionerId, appointmentId, notificationType: 'booking_created' }
        );
      }
      
      // As a fallback, try to get the user's email from auth session (for development)
      // In production, you would need a secure server-side way to fetch user emails
      console.warn('Unable to get email from profiles, this is a fallback method');
      const { data: authData } = await supabase.auth.getUser(practitioner.user_id as string);
      
      if (authData?.user?.email) {
        return await sendEmailNotification(
          authData.user.email,
          'New Appointment Booked',
          generateAppointmentEmailTemplate(clientName, appointmentDate, appointmentTime, sessionType),
          { practitionerId, appointmentId, notificationType: 'booking_created' }
        );
      }
      
      console.error('Error fetching practitioner user data:', userError);
      return { success: false, error: userError || new Error('User email not found') };
    }
    
    return { success: false, error: new Error('No email found for practitioner') };
  } catch (error) {
    console.error('Error in notification process:', error);
    return { success: false, error };
  }
}

// Helper function to generate HTML email template for appointment bookings
function generateAppointmentEmailTemplate(
  clientName: string, 
  appointmentDate: string, 
  appointmentTime: string, 
  sessionType: string
) {
  const dateObject = new Date(appointmentDate);
  const formattedDate = dateObject.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #148BAF; color: white; padding: 10px 20px; border-radius: 4px; }
        .content { padding: 20px; border: 1px solid #ddd; border-radius: 4px; }
        .appointment-details { background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Appointment Booked</h2>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>A new appointment has been booked with you.</p>
          
          <div class="appointment-details">
            <p><strong>Client:</strong> ${clientName}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Session Type:</strong> ${sessionType}</p>
          </div>
          
          <p>Please log in to your dashboard to view more details and prepare for the session.</p>
          <p>Thank you for using our platform!</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
