
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  assetsInclude: ["**/*.htm"],

 build: {
    // bump warning threshold so only truly huge chunks warn you
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          // React + related core
          react: [
            "react",
            "react-dom",
            "react-router-dom",
          ],

          // 3D / three.js & math
          three: [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
            "maath",
          ],

          // UI primitives & utilities
          ui: [
            "@radix-ui/react-label",
            "@radix-ui/react-slot",
            "lucide-react",
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "tailwindcss-animate",
          ],

          // Animation engine
          motion: [
            "framer-motion",
          ],

          // Sliders & carousels
          slider: [
            "react-slick",
            "slick-carousel",
          ],

          // Timeline component
          timeline: [
            "react-vertical-timeline-component",
          ],

          // Email libraries
          email: [
            "@emailjs/browser",
            "emailjs-com",
          ],
        },
      },
    },
  },
});