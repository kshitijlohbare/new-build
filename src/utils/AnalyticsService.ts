/**
 * Analytics utility for tracking user interactions
 * Can be connected to various analytics providers like Google Analytics, Mixpanel, etc.
 */

type EventProperties = Record<string, any>;

/**
 * Analytics service for tracking user behavior
 * This implementation is a placeholder that logs to console in development
 * In production, this would be connected to an actual analytics provider
 */
class AnalyticsService {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  /**
   * Track a page view
   * @param pageName The name of the page
   * @param properties Additional properties to track
   */
  trackPageView(pageName: string, properties?: EventProperties): void {
    if (this.isDevelopment) {
      console.log(`[Analytics] Page View: ${pageName}`, properties || {});
    } else {
      // In production, this would send data to an actual analytics provider
      // Example: mixpanel.track('page_view', { page: pageName, ...properties });
    }
  }

  /**
   * Track a user interaction event
   * @param eventName The name of the event
   * @param properties Additional properties to track
   */
  trackEvent(eventName: string, properties?: EventProperties): void {
    if (this.isDevelopment) {
      console.log(`[Analytics] Event: ${eventName}`, properties || {});
    } else {
      // In production, this would send data to an actual analytics provider
      // Example: mixpanel.track(eventName, properties || {});
    }
  }

  /**
   * Track a completed action
   * @param actionName The name of the action
   * @param properties Additional properties to track
   */
  trackAction(actionName: string, properties?: EventProperties): void {
    if (this.isDevelopment) {
      console.log(`[Analytics] Action: ${actionName}`, properties || {});
    } else {
      // In production, this would send data to an actual analytics provider
      // Example: analytics.track(actionName, properties || {});
    }
  }

  /**
   * Track an error that occurred
   * @param errorType The type of error
   * @param properties Additional properties to track
   */
  trackError(errorType: string, properties?: EventProperties): void {
    if (this.isDevelopment) {
      console.error(`[Analytics] Error: ${errorType}`, properties || {});
    } else {
      // In production, this would send data to an actual analytics provider
      // Example: sentry.captureException(new Error(errorType), { extra: properties });
    }
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;
