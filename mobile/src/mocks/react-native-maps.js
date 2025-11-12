// Mock for react-native-maps on web platform (CommonJS, no JSX)
const React = require('react');
const { View } = require('react-native');

function MockView(props) {
  return React.createElement(View, props);
}

const PROVIDER_GOOGLE = 'google';
const PROVIDER_DEFAULT = 'default';

module.exports = MockView;
module.exports.default = MockView;
module.exports.MapView = MockView;
module.exports.Marker = MockView;
module.exports.Polyline = MockView;
module.exports.Polygon = MockView;
module.exports.Circle = MockView;
module.exports.PROVIDER_GOOGLE = PROVIDER_GOOGLE;
module.exports.PROVIDER_DEFAULT = PROVIDER_DEFAULT;
module.exports.__esModule = true;

