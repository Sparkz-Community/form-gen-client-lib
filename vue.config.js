module.exports = {
  chainWebpack: config => {
    config.externals({
      vue: 'vue',
      vuex: 'vuex',
      quasar: 'quasar',
      'feathers-vuex': 'feathers-vuex',
      '@iy4u/common-client-lib': '@iy4u/common-client-lib',
    });
  }
};
