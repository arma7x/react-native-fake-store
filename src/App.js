/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSelector, useDispatch } from 'react-redux'
import { setLoading  } from './store/database'
import { FakeStore } from './api'
import styles from './styles'

import ProductWidget from './widgets/ProductWidget'
import { Product, Home } from './screens'

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Fake Store" component={Home} />
        <Stack.Screen name="Product" component={Product}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
