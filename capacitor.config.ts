import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.agentflow.app",
  appName: "AgentFlowM",
  webDir: "out",
  // Production URL - wird nach Deployment aktualisiert
  server: {
    // Dev: http://192.168.0.232:3000
    // Prod: https://agentflowm.vercel.app (nach Deployment)
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      style: "dark",
      backgroundColor: "#030308",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#030308",
      showSpinner: true,
      spinnerColor: "#FC682C",
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon",
      iconColor: "#FC682C",
    },
    App: {
      appName: "AgentFlowM",
    },
    Browser: {
      windowName: "_self",
    },
    Haptics: {},
    Share: {},
    Clipboard: {},
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    backgroundColor: "#030308",
    scheme: "agentflowm",
    // App Store Info
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#030308",
    // Google Play Info
    flavor: "production",
    buildOptions: {
      keystorePath: "release.keystore",
      keystoreAlias: "agentflowm",
    },
  },
};

export default config;
