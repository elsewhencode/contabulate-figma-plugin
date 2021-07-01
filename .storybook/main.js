function webpackFinal(config) {
  const index = config.module.rules.findIndex(function (rule) {
    return rule.test.toString() === '/\\.css$/';
  });
  if (index === -1) {
    throw new Error('Module rule for `.css` files not found in Storybook webpack config');
  }

  config.module.rules[index] = {
    sideEffects: true,
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 0,
          modules: true,
        },
      },
    ],
  };

  return config;
}

module.exports = {
  webpackFinal,
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
