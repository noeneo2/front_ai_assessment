
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Agrega un fallback para el módulo 'crypto'
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify")
      };
      
      // Regla para manejar archivos SVG
      webpackConfig.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
};
