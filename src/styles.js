/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default StyleSheet.create({
  productWidgetContainer: {
    paddingBottom: 12,
    width: `50%`,
    elevation: 5
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderColor: 'black',
    marginRight: 12,
    borderWidth: 0.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDescription: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  highlight: {
    fontWeight: '700',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  productDescription: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 5
  }
});
