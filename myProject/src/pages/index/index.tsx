import Taro from '@tarojs/taro'
import { View, Text,  Input, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './index.scss'
import { getProducts,createOrders } from '../../utils/request'
import { Product} from '../../types/product'
import { OrderResponse } from '../../types/response'



const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [orderConfirmation, setOrderConfirmation] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts()
        setProducts(res)
      } catch (error) {
        Taro.showToast({ title: 'Failed to load products', icon: 'none' })
      }
    }
    fetchProducts()
  }, [])

  const handleOrder = async () => {
    if (!selectedProduct) return
    setLoading(true)
    try {
      const res = await createOrders(selectedProduct.id,quantity);
      if(res.success==false){
        setLoading(false)
      }else{setOrderConfirmation({
        orderId: res.orderId,
        totalPrice: res.totalPrice
      })
    }
    } catch (error) {
      Taro.showToast({ title: 'Failed to place order', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (e) => {
    const input = e.detail.value;
    if (input === '') {
      setQuantity(0);
      return;
    }
    
  const value = parseInt(input);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  }



  if (orderConfirmation) {
    return (
      <View className='confirmation'>
        <Text>Order Confirmed!</Text>
        <Text>Order ID: {orderConfirmation.orderId}</Text>
        <Text>Total Price: ${orderConfirmation.totalPrice.toFixed(2)}</Text>
        <Button onClick={() => Taro.navigateTo({ url: '/pages/index/index' })}>
          Back to Products
        </Button>
      </View>
    )
  }

  return (
    <View className='container'>
      {selectedProduct ? (
        <View className='order-form'>
          <Text>{selectedProduct.name}</Text>
          <Text>Price: ${selectedProduct.price.toFixed(2)}</Text>
          <Input
            type='number'
            value={quantity.toString()}
            onInput={handleQuantityChange}
            placeholder='Enter quantity'
          />
          <View className='buttons'>
            <Button 
              className='cancel-btn'
              onClick={() => setSelectedProduct(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button 
              className={`place-order-btn ${loading ? 'loading' : ''}`}
              onClick={handleOrder}
              disabled={!selectedProduct || loading}
            >
              Place Order
            </Button>
          </View>
        </View>
      ) : (
        <View className='product-list'>
          {products.map(product => (
            <View 
              key={product.id} 
              className='product-item'
              onClick={() => setSelectedProduct(product)}
            >
              <Text>{product.name}</Text>
              <Text>inventory:{product.inventory}</Text>
              <Text>${product.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default ProductList