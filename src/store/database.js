import { createSlice } from '@reduxjs/toolkit'

export const databaseSlice = createSlice({
  name: 'database',
  initialState: {
    loading: false,
    products: [],
    productsRegistry: {}
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    storeProducts: (state, action) => {
      state.products = []
      state.products = [...action.payload]
    },
    pushProductsRegistry: (state, action) => {
      const product = action.payload
      if (state.productsRegistry[product.id] == null) {
        state.productsRegistry[product.id] = product
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLoading, storeProducts, pushProductsRegistry } = databaseSlice.actions

export default databaseSlice.reducer
