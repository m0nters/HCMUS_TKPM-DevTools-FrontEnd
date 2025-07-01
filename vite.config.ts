import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    visualizer({
      open: true, // opens browser after build
      template: "treemap", // or 'sunburst', 'network', 'flamegraph',...
      gzipSize: true, // adds size after gzip
      brotliSize: true, // adds size after brotli compression
    }),
    // obfuscator({
    //   options: {
    //     compact: true,
    //     controlFlowFlattening: false,
    //     deadCodeInjection: false,
    //     debugProtection: false,
    //     debugProtectionInterval: 0,
    //     disableConsoleOutput: true,
    //     identifierNamesGenerator: "hexadecimal",
    //     log: false,
    //     numbersToExpressions: false,
    //     renameGlobals: false,
    //     selfDefending: true,
    //     simplify: true,
    //     splitStrings: false,
    //     stringArray: true,
    //     stringArrayCallsTransform: false,
    //     stringArrayEncoding: [],
    //     stringArrayIndexShift: true,
    //     stringArrayRotate: true,
    //     stringArrayShuffle: true,
    //     stringArrayWrappersCount: 1,
    //     stringArrayWrappersChainedCalls: true,
    //     stringArrayWrappersParametersMaxCount: 2,
    //     stringArrayWrappersType: "variable",
    //     stringArrayThreshold: 0.75,
    //     unicodeEscapeSequence: false,
    //   },
    // }),
  ],
  server: {
    port: 3000,
    proxy: {
      // Proxy all /api requests to the backend server
      "/api": {
        target: "http://localhost:5175",
        changeOrigin: true,
      },
    },
  },
});
