import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.agentflow.portal",
  appName: "AgentFlow Kundenportal",
  webDir: "out",
  server: {
    // Lokales Testen - Ihre IP-Adresse
    url: "http://192.168.2.86:3002",
    cleartext: true,
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#09090b",
      showSpinner: false,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#09090b",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
