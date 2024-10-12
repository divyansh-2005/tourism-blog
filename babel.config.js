module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],  // Ensure this is correct
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],
  };
};
