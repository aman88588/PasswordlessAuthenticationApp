/**
 * Analytics Service
 * Wrapper for logging events - in production this would integrate with
 * Firebase Analytics, Sentry, Mixpanel, etc.
 * For this demo, events are logged to console and localStorage
 */

interface AnalyticsEvent {
  name: string;
  timestamp: number;
  data: Record<string, unknown>;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private readonly STORAGE_KEY = 'app_analytics_events';

  constructor() {
    this.loadEvents();
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  logEvent(name: string, data: Record<string, unknown> = {}): void {
    const event: AnalyticsEvent = {
      name,
      timestamp: Date.now(),
      data,
    };

    this.events.push(event);
    this.saveEvents();

    // Log to console for debugging
    console.log(`[Analytics] ${name}`, {
      timestamp: new Date(event.timestamp).toISOString(),
      ...data,
    });
  }

  // Specific event methods
  logOtpGenerated(email: string): void {
    this.logEvent('otp_generated', {
      email,
      timestamp: Date.now(),
    });
  }

  logOtpValidationSuccess(email: string, attempts: number): void {
    this.logEvent('otp_validation_success', {
      email,
      attempts,
    });
  }

  logOtpValidationFailure(email: string, reason: string): void {
    this.logEvent('otp_validation_failure', {
      email,
      reason,
    });
  }

  logUserLogout(email: string, sessionDuration: number): void {
    this.logEvent('user_logout', {
      email,
      session_duration: sessionDuration,
    });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();
