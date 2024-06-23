import App from './Home';
import React from 'react';
import { name as appName } from './app.json';
import { AppRegistry, Text, TextInput } from 'react-native';
import AppContainer from './AppContainer';
import Home from './Home';

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return (
      <AppContainer />
  );
}

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => HeadlessCheck);