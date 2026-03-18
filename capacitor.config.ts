// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorConfig = any;

// ═══════════════════════════════════════════════════════════════
//           📱 APP 1: AgentFlowM (Marketing)
//           Bundle: de.agentflowm.app
//           URL:    https://agentflowm.de
//           Store:  App Store + Google Play
// ═══════════════════════════════════════════════════════════════

const config: CapacitorConfig = {
  appId: "de.agentflowm.app",
  appName: "AgentFlowM",
  webDir: "out",
  server: {
    url: "https://agentflowm.de",
    cleartext: false,
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
    limitsNavigationsToAppBoundDomains: true,
    allowedNavigationHostnames: ["agentflowm.de", "agentflowm.com"],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#030308",
    flavor: "production",
    buildOptions: {
      keystorePath: "keystores/marketing.keystore",
      keystorePassword: "KEYSTORE_PASSWORD",
      keystoreAlias: "agentflowm",
      keystoreAliasPassword: "KEYSTORE_PASSWORD",
      releaseType: "AAB",
    },
  },
};

export default config;
