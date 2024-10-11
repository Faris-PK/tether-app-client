import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all IPs, including local network IP
    port: 5173 // Ensure you're using the correct port number
  },
});
