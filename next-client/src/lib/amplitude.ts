import * as amplitude from "@amplitude/analytics-browser";

const options = {};

export const initAmplitude = () => {
  const api = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
    ? process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
    : "";
  amplitude.init(api, undefined, options);
};

export const setAmplitudeUserId = (userId: string) => {
  if (!amplitude.getUserId()) {
    amplitude.setUserId(userId);
  }
};

const getAmplitudeUserProperties = () => {
  return amplitude.getUserId();
};

export const trackAmplitudeData = (
  eventType: string | amplitude.Types.BaseEvent,
  eventProperties?: Record<string, unknown>
) => {
  amplitude.track(eventType, eventProperties);
};
