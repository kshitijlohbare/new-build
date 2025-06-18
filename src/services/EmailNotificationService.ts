// Email notification service entry point
// This file chooses the right implementation based on the environment

import { emailService } from './EmailNotificationService.browser';
export { emailService };
export { EmailNotificationService } from './EmailNotificationService.browser';
