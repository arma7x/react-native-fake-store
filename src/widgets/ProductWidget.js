/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  Dimensions,
  Image,
  Text,
  useColorScheme,
  View
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import styles from '../styles'

export default ({children, product, index}): Node => {

  const rightPad = (index + 1) % 2 === 0 ? 0 : 12;
  const widthSize = (Dimensions.get('window').width - (14.5 * 2)) / 2;
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.productWidgetContainer}>
      <View style={{...styles.card, marginRight: rightPad, marginTop: (index <= 1 ? 12 : 0)}}>
        <Image
          style={{ resizeMode: 'cover', width: widthSize, height: 100 }}
          source={{uri: product.image}}
        />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 5, width: '100%' }}>
          {children}
          <Text
            style={[
              styles.cardTitle,
              {
                color: isDarkMode ? Colors.white : Colors.dark,
              },
            ]}>
            MYR {product.price.toFixed(2)}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 5, width: '100%', minHeight: 50 }}>
          <Text
            style={[
              styles.cardDescription,
              {
                color: isDarkMode ? Colors.light : Colors.grey,
              },
            ]}>
            {product.title.length > 28 ? product.title.substring(0, 22) + '...' : product.title}
          </Text>
        </View>
      </View>
    </View>
  );
};
