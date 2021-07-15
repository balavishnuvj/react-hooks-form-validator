module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: '>0.25%',
        },
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
  ],
};
