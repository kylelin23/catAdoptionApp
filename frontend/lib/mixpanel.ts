import { Mixpanel } from "mixpanel-react-native";

const MIXPANEL_TOKEN = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;

if (!MIXPANEL_TOKEN) {
  console.warn("Mixpanel Token is missing! Check your .env file.");
}

const trackAutomaticEvents = false;

export const mixpanel = new Mixpanel(
  MIXPANEL_TOKEN || "",
  trackAutomaticEvents,
);

mixpanel.init();
