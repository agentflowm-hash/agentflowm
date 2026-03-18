// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CapacitorConfig = any;

// ═══════════════════════════════════════════════════════════════
//           📱 APP 2: AgentFlowM Portal (Kunden-Portal)
//           Bundle: de.agentflowm.portal
//           URL:    https://portal-agentflowm.de
//           Store:  App Store + Google Play
// ═══════════════════════════════════════════════════════════════

const config: CapacitorConfig = {
  appId: "de.agentflowm.portal",
  appName: "AgentFlowM Portal",
  webDir: "out",
  server: {
    url: "https://portal-agentflowm.de",
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
      appName: "AgentFlowM Portal",
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
    scheme: "agentflowmportal",
    limitsNavigationsToAppBoundDomains: true,
    allowedNavigationHostnames: ["portal-agentflowm.de", "portal-agentflowm.com"],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#030308",
    flavor: "production",
    buildOptions: {
      keystorePath: "keystores/portal.keystore",
      keystorePassword: "KEYSTORE_PASSWORD",
      keystoreAlias: "agentflowmportal",
      keystoreAliasPassword: "KEYSTORE_PASSWORD",
      releaseType: "AAB",
    },
  },
};

export default config;
