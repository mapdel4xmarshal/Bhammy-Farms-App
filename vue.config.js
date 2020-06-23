module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    proxy: {
      '/api/v1/*': {
        target: 'http://localhost:8888/',
        logLevel: 'debug',
        prependPath: true
      },
      '/uploads/': {
        target: 'http://localhost:8888/',
        logLevel: 'debug',
        prependPath: true
      }
    }
  }
};
