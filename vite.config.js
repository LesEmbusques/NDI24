import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/NDI24.github.io/', // Utiliser des chemins relatifs pour la production
  assetsInclude: ['**/*.png'],
  build: {
    outDir: 'dist', // Dossier de sortie pour la production
    target: 'esnext', // Assurer la compatibilité avec les navigateurs modernes
    assetsInlineLimit: 0, // Désactiver l'inlining des assets trop grands
    rollupOptions: {
      input:{
        main: 'index.html',
        cerveau: resolve(__dirname,'minigames/cerveau/index.html'),
        coeur: resolve(__dirname,'minigames/coeur/index.html'),
        poumons: resolve(__dirname,'minigames/poumon/index.html'),
        foie: resolve(__dirname,'minigames/foie/index.html'),
        estomac: resolve(__dirname,'minigames/estomac/index.html'),
        rein: resolve(__dirname,'minigames/rein/index.html'),
      },
        output: {
          cerveau: {
            assets: 'minigames/cerveau/assets/wall.png',
          },
        },
    }
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
