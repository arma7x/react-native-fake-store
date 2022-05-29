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
  ScrollView,
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
  const widthSize = (Dimensions.get('window').width - (14.5 * 2)) / 2;

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
      navigation.setOptions({title: product.title});
      console.log("Cached", itemId);
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
    )
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
  //  options={({ route }) => ({ title: `Product ${route.params.itemId.toString()}` })}
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Fake Store" component={Home} />
        <Stack.Screen name="Product" component={Product}/>
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

export default App;
