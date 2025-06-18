// Appointment booking service entry point
// This file chooses the right implementation based on the environment

import { appointmentService } from './AppointmentBookingService.browser';
export { appointmentService };
export { AppointmentBookingService } from './AppointmentBookingService.browser';
