import { useEffect } from "react";
import { eventBus } from "../services/";

/**
 * Custom hook to subscribe to eventBus events
 * @param eventName Name of the event to subscribe to
 * @param callback Function to call when event is emitted
 */
export function useEventBus(
  eventName: string,
  callback: (event: CustomEvent) => void,
) {
  useEffect(() => {
    const handler = (event: Event) => {
      callback(event as CustomEvent);
    };

    eventBus.on(eventName, handler);

    return () => {
      eventBus.off(eventName, handler);
    };
  }, [eventName, callback]);

  // Clean up event listener when component unmounts
  return {
    emit: (detail?: any) => eventBus.emit(eventName, detail),
  };
}
