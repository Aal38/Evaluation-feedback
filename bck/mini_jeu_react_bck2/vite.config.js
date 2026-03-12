import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ Autoriser CodeSandbox et ses sous‑domaines (ex: mpk9sn-5173.csb.app)
    allowedHosts: true,          // Autorise tous les hôtes (Vite 5+)
    host: true,                  // Écoute sur toutes les interfaces (nécessaire en VM)
    strictPort: true,            // Garde le port 5173 (utile pour les règles du proxy CSB)
    port: 5173,
    hmr: {
      // En VM CodeSandbox, HMR via 443 évite les blocages
      clientPort: 443
      // (optionnel) host: 'csb.app',
    }
  }
})