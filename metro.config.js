/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const blacklist = require('metro-config/src/defaults/exclusionList');
const bluetoothLib = path.resolve(
  __dirname,
  '../VedicSensor/node_modules/react-native-bluetooth-classic',
);
const {getDefaultConfig} = require('metro-config');

module.exports = async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      extraNodeModules: new Proxy(
        {
          'react-native-bluetooth-classic': bluetoothLib,
        },
        {
          get: (target, name) => {
            if (target.hasOwnProperty(name)) {
              return target[name];
            }
            return path.join(process.cwd(), `node_modules/${name}`);
          },
        },
      ),
      blacklistRE: blacklist([
        new RegExp(`${bluetoothLib}/node_modules/react-native/.*`),
      ]),
    },
    projectRoot: path.resolve(__dirname),
    watchFolders: [bluetoothLib],
  };
};
