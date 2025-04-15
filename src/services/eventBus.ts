/**
 * Simple event bus implementation using the browser's native EventTarget API
 */
class EventBus extends EventTarget {
  // Publish an event
  emit(eventName: string, detail?: any): void {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  // Subscribe to an event
  on(eventName: string, callback: EventListenerOrEventListenerObject): void {
    this.addEventListener(eventName, callback);
  }

  // Unsubscribe from an event
  off(eventName: string, callback: EventListenerOrEventListenerObject): void {
    this.removeEventListener(eventName, callback);
  }
}

// Create a singleton instance
export const eventBus = new EventBus();

// Event names constants
export const EVENTS = {
  SIDEBAR_REFRESH: "sidebar-refresh",
};
