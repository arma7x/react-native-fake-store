/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type {Node} from 'react';
import {
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { useSelector, useDispatch } from 'react-redux'
import { setLoading, storeProducts } from '../store/database'
import { FakeStore } from '../api'
import styles from '../styles'
import store from '../store'

import ProductWidget from '../widgets/ProductWidget'

export default ({ navigation }): Node => {

  let searchT = -1;
  let sources = [];

  const [list, setList] = useState([]);
  const padHeight = (Dimensions.get('window').height - 58) / 2;
  const loading = useSelector((state) => state.database.loading)
  const products = useSelector((state) => state.database.products)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: searchProducts
      }
    });
  },[]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const renderItem = ({ index, item }) => {
    return (
      <ProductWidget product={item} index={index}>
        <Button
          title="Detail"
          onPress={() => navigation.navigate('Product', { itemId: item.id})}
        />
      </ProductWidget>
    );
  };

  const fetchProducts = () => {
    dispatch(setLoading(true))
    FakeStore.getProducts()
    .then((_products) => {
      dispatch(storeProducts(_products));
      setList(_products);
      sources = [..._products];
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      dispatch(setLoading(false))
    })
  }


  const searchProducts = (evt) => {
    if (searchT > 0) {
      clearTimeout(searchT)
      searchT = -1
    }
    const word = evt.nativeEvent.text.trim().toLowerCase();
    searchT = setTimeout(() => {
      const db = [...sources];
      if (db.length > 0 && word.length > 0) {
        let temp = []
        temp = db.filter((product) => {
          if (product.id.toString().toLowerCase().indexOf(word) > -1) {
            return true
          } else if (product.title.toLowerCase().indexOf(word) > -1) {
            return true
          } else if (product.category.toLowerCase().indexOf(word) > -1) {
            return true
          } else if (product.description.toLowerCase().indexOf(word) > -1) {
            return true
          }
          return false
        });
        setList(temp)
      } else {
        setList(db)
      }
    }, 500);
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {
        loading && <View style={{ marginTop: padHeight, flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <ActivityIndicator />
        </View>
      }
      <FlatList
        style={{ paddingRight: 12, paddingLeft: 12 }}
        numColumns={2}
        data={list}
        renderItem={renderItem}
        keyExtractor={(product) => product.id}
      />
    </SafeAreaView>
  );
};
