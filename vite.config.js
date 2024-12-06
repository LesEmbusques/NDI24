import { defineConfig } from 'vite';

export default defineConfig({
  base: '/NDI24.github.io/', // Utiliser des chemins relatifs pour la production
  build: {
    outDir: 'dist', // Dossier de sortie pour la production
    target: 'esnext', // Assurer la compatibilité avec les navigateurs modernes
    assetsInlineLimit: 0, // Désactiver l'inlining des assets trop grands
  },
  resolve: {
    alias: {
      three: 'three', // Alias pour résoudre correctement le module Three.js
    },
  },
  server: {
    open: true, // Ouvre le navigateur automatiquement en mode dev
    port: 3000, // Port local du serveur de dev
  },
});
