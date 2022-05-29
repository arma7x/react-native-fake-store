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
  SafeAreaView,
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSelector, useDispatch } from 'react-redux'
import { setLoading, storeProducts, pushProductsRegistry } from './store/database'
import { FakeStore } from './api'

const Stack = createNativeStackNavigator();

const ProductWidget = ({children, product, index}): Node => {

  const pad = (index + 1) % 2 === 0 ? 0 : 12;
  const widthSize = (Dimensions.get('window').width - (12 * 2)) / 2;

  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.productWidgetContainer}>
      <View style={{...styles.card, marginRight: pad, marginTop: (index <= 1 ? 12 : 0)}}>
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

// TODO Product
const Product: () => Node = ({ route, navigation }) => {

  const { itemId } = route.params;
  const product = useSelector((state) => state.database.productsRegistry[itemId])
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (product == null) {
      dispatch(setLoading(true))
      FakeStore.getProduct(itemId)
      .then((product) => {
        dispatch(pushProductsRegistry(product))
        console.log("Fetch", itemId);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
    } else {
      console.log("Cached", itemId);
    }
  },[]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.highlight}>Product {itemId}</Text>
    </View>
  );
}

// TODO Product Listing
const Home: () => Node = ({ navigation }) => {

  const products = useSelector((state) => state.database.products)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  },[]);

  const fetchProducts = () => {
    dispatch(setLoading(true))
    FakeStore.getProducts()
    .then((_products) => {
      console.log('Fetch Product', _products.length);
      dispatch(storeProducts(_products))
    })
    .catch((err) => {
      console.log(_products);
      console.error(err);
    })
    .finally(() => {
      dispatch(setLoading(false))
    })
  }

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const renderItem = ({ index, item }) => {
    return (
      <ProductWidget product={item} index={index}>
        <Button
          title="Detail"
          onPress={() => navigation.navigate('Product', {
            itemId: item.id,
          })}
        />
      </ProductWidget>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlatList
        style={{ paddingRight: 12, paddingLeft: 12 }}
        numColumns={2}
        data={products}
        renderItem={renderItem}
        keyExtractor={(product) => product.id}
      />
    </SafeAreaView>
  );
};

const App: () => Node = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Fake Store" component={Home} />
        <Stack.Screen name="Product" component={Product} options={({ route }) => ({ title: `Product ${route.params.itemId.toString()}` })}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  productWidgetContainer: {
    paddingBottom: 12,
    width: `50%`,
    elevation: 5
  },
  card: {
    marginRight: 12,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderColor: 'black',
    borderWidth: 0.5,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowRadius: 5,
    shadowOpacity: 1,
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
});

export default App;
