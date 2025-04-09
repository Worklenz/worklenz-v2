import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { ConfigEnv, UserConfig } from 'vite';

// Use async function to properly load the plugins
const config = async ({ command }: ConfigEnv): Promise<UserConfig> => {
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;

  return {
    // **Plugins**
    plugins: [
      react(),
      tsconfigPaths(),
    ],

    // **Resolve**
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@components', replacement: path.resolve(__dirname, './src/components') },
        { find: '@features', replacement: path.resolve(__dirname, './src/features') },
        { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
        { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
        { find: '@services', replacement: path.resolve(__dirname, './src/services') },
        { find: '@api', replacement: path.resolve(__dirname, './src/api') },
      ],
    },

    // **Build**
    build: {
      // **Target**
      target: 'es2020',
      
      // **Output**
      outDir: 'build',
      assetsDir: 'assets',
      cssCodeSplit: true,

      // **Sourcemaps**
      sourcemap: command === 'serve',

      // **Minification**
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: command === 'build',
          drop_debugger: command === 'build',
        },
        format: {
          comments: false,
        },
      },

      // **Rollup Options**
      rollupOptions: {
        output: {
          // **Chunking Strategy**
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (['react', 'react-dom', 'react-router-dom'].some(pkg => id.includes(pkg))) {
                return 'vendor';
              }
              if (id.includes('antd')) {
                return 'antd';
              }
              if (id.includes('i18next')) {
                return 'i18n';
              }
            }
            return null;
          },
          // **File Naming Strategies**
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name ? assetInfo.name : '';
            if (/\.(gif|jpe?g|png|svg)$/.test(info)) {
              return 'assets/images/[name].[hash][extname]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(info)) {
              return 'assets/fonts/[name].[hash][extname]';
            }
            return 'assets/[ext]/[name].[hash][extname]';
          },
        },
      },
    },

    // **Server**
    server: {
      port: 5173,
      open: true,
      cors: true,
    },
  };
};

export default defineConfig(config);
