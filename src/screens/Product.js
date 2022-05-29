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
  SafeAreaView,
  Dimensions,
  ScrollView,
  Image,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { useSelector, useDispatch } from 'react-redux'
import { setLoading, pushProductsRegistry } from '../store/database'
import { FakeStore } from '../api'
import styles from '../styles'

export default Node = ({ route, navigation }) => {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const widthSize = Dimensions.get('window').width;
  const { itemId } = route.params;
  const product = useSelector((state) => state.database.productsRegistry[itemId])
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (product == null) {
      dispatch(setLoading(true))
      FakeStore.getProduct(itemId)
      .then((product) => {
        navigation.setOptions({title: product.title});
        dispatch(pushProductsRegistry(product));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
    } else {
      navigation.setOptions({title: product.title});
    }
  },[]);

  const transform = (txt) => {
    let b = txt.split(' ');
    b.filter((value, i) => b[i] = (value.charAt(0).toUpperCase() + value.slice(1)));
    return b.join(' ');
  }

  return (
    product == null ? (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.highlight}>Fetching product {itemId}</Text>
      </View>
    ) : (
      <SafeAreaView style={backgroundStyle}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Image
            style={{ width: widthSize, height: widthSize, resizeMode: 'cover' }}
            source={{uri: product.image}}
          />
            <View style={{ padding: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <Text>#{ product.id.toString() }</Text>
                <Text>Category: { transform(product.category) }</Text>
              </View>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productDescription}>{ product.description }</Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%' }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.black }}>MYR { product.price.toFixed(2).toString() }</Text>
              </View>
            </View>
        </ScrollView>
      </SafeAreaView>
    )
  );
}
