import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.agentflow.admin",
  appName: "AgentFlow Admin",
  webDir: "out",
  server: {
    // Lokales Testen - Ihre IP-Adresse
    url: "http://192.168.2.86:3001",
    cleartext: true,
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
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    backgroundColor: "#09090b",
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#09090b",
  },
};

export default config;
