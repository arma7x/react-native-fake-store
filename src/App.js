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
  ScrollView,
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

// TODO ProductWidget
const ProductWidget = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
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

  return (
    <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
                <Header />
                <View
                    style={{
                    backgroundColor: isDarkMode ? Colors.black : Colors.white,
                }}>
                    <Section title="Product 1">
                        <Button
                            title="Go to Product 1"
                                onPress={() => navigation.navigate('Product', {
                                itemId: 1,
                            })}
                        />
                    </Section>
                    <Section title="Product 2">
                        <Button
                            title="Go to Product 2"
                                onPress={() => navigation.navigate('Product', {
                                itemId: 2,
                            })}
                        />
                    </Section>
                    <Section title="Product 3">
                        <Button
                            title="Go to Product 3"
                                onPress={() => navigation.navigate('Product', {
                                itemId: 3,
                            })}
                        />
                    </Section>
                </View>
        </ScrollView>
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
