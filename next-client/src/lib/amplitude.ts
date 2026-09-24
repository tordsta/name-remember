import * as amplitude from "@amplitude/analytics-browser";

const options = {};

export const initAmplitude = () => {
  const api = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
    ? process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
    : "";
  amplitude.init(api, undefined, options);
};

export const stopAmplitude = () => {
  amplitude.setOptOut(true);
  const arrSplit = document.cookie.split(";");
  for (let i = 0; i < arrSplit.length; i++) {
    const cookie = arrSplit[i].trim();
    const cookieName = cookie.split("=")[0];
    // If the prefix of the cookie's name matches the one specified, remove it
    if (cookieName.indexOf("amp_") === 0 || cookieName.indexOf("AMP_") === 0) {
      document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
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
