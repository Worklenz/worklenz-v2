import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { ConfigEnv, UserConfig } from 'vite';

// Use async function to properly load the plugins
const config = async ({ command }: ConfigEnv): Promise<UserConfig> => {
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
  const compression = (await import('vite-plugin-compression')).default;

  return {
    // **Plugins**
    plugins: [
      react({
        // Babel optimizations
        babel: {
          plugins: [
            ['@babel/plugin-transform-runtime', { helpers: true }]
          ],
        }
      }),
      tsconfigPaths(),
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // Only compress files larger than 10kb
        deleteOriginFile: false,
      }),
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
      
      // **Performance Optimizations**
      cssCodeSplit: true,
      cssMinify: 'lightningcss',
      minify: 'terser',
      sourcemap: false, // Disable in production for performance
      
      // Chunk optimization
      chunkSizeWarningLimit: 1000, // Set a limit in KB
      
      // **Output**
      outDir: 'build',
      assetsDir: 'assets',
      
      // **Terser Optimizations**
      terserOptions: {
        compress: {
          drop_console: command === 'build',
          drop_debugger: command === 'build',
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2, // Additional compression passes
          unsafe: true,
          unsafe_arrows: true,
          unsafe_methods: true,
        },
        format: {
          comments: false,
        },
        mangle: {
          safari10: false, // More aggressive mangling
        },
      },

      // **Rollup Options**
      rollupOptions: {
        treeshake: 'recommended', // Most aggressive tree-shaking
        output: {
          // **Chunking Strategy**
          manualChunks: (id) => {
            // Core framework chunks
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom') || 
                id.includes('node_modules/scheduler')) {
              return 'react-core';
            }
            
            // React ecosystem packages
            if (id.includes('node_modules/react-router') || 
                id.includes('node_modules/@remix-run') || 
                id.includes('node_modules/history')) {
              return 'react-router';
            }
            
            // UI framework
            if (id.includes('node_modules/antd') || 
                id.includes('node_modules/@ant-design')) {
              return 'antd';
            }
            
            // i18n
            if (id.includes('node_modules/i18next')) {
              return 'i18n';
            }
            
            // Data libraries
            if (id.includes('node_modules/redux') || 
                id.includes('node_modules/@reduxjs') || 
                id.includes('node_modules/react-redux') || 
                id.includes('node_modules/immer') || 
                id.includes('node_modules/reselect')) {
              return 'state-management';
            }
            
            // Charts and visualization
            if (id.includes('node_modules/chart.js') ||
                id.includes('node_modules/react-chartjs')) {
              return 'charts';
            }
            
            // Utils
            if (id.includes('node_modules/date-fns') || 
                id.includes('node_modules/lodash') || 
                id.includes('node_modules/axios')) {
              return 'utils';
            }
            
            // Vendor
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            
            return null;
          },
          
          // **File Naming Strategies**
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name ? assetInfo.name : '';
            // Images
            if (/\.(gif|jpe?g|png|svg|webp)$/.test(info)) {
              return 'assets/images/[name].[hash][extname]';
            }
            // Fonts
            if (/\.(woff2?|eot|ttf|otf)$/.test(info)) {
              return 'assets/fonts/[name].[hash][extname]';
            }
            // CSS
            if (/\.css$/.test(info)) {
              return 'assets/css/[name].[hash][extname]';
            }
            // Default
            return 'assets/[ext]/[name].[hash][extname]';
          },
        },
      },
    },

    // **Development Optimizations**
    server: {
      port: 5173,
      open: true,
      cors: true,
      hmr: {
        overlay: true,
      },
      watch: {
        usePolling: false, // Better performance for most systems
        ignored: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**'],
      },
    },
    
    // Optimize preview server
    preview: {
      port: 8080,
      open: true,
      cors: true,
    },
    
    // Esbuild optimizations
    esbuild: {
      treeShaking: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      legalComments: 'none',
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'antd',
        'axios',
        'chart.js',
        'react-chartjs-2',
        'i18next',
        'react-i18next',
        '@ant-design/icons',
        'socket.io-client',
      ],
      esbuildOptions: {
        target: 'es2020',
        treeShaking: true,
      },
    },
  };
};

export default defineConfig(config);
