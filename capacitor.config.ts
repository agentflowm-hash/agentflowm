import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.agentflow.app",
  appName: "AgentFlow",
  webDir: "out",
  server: {
    url: "http://192.168.2.86:3000",
    cleartext: true,
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      style: "dark",
      backgroundColor: "#030308",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#030308",
      showSpinner: false,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    backgroundColor: "#030308",
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#030308",
  },
};

export default config;
