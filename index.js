/**
 * @format
 */

import {AppRegistry} from 'react-native';
import React from 'react';
import type {Node} from 'react';
import {name as appName} from './app.json';
import App from './src/App';
import store from './src/store';
import { Provider } from 'react-redux';

const RNRedux: () => Node = () => {
  return (
    <Provider store = { store }>
      <App />
    </Provider>
  )
}

AppRegistry.registerComponent(appName, () => RNRedux);
