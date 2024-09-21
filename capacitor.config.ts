import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'appServicio',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: true  // Esto permitirá conexiones HTTP no seguras
  }
};

export default config;
