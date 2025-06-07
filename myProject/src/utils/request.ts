import Taro from '@tarojs/taro';
const baseUrl = 'http://192.168.1.48:8080';


export const getProducts = async () => {
  try {
    const res = await Taro.request({
      url: `${baseUrl}/api/products`,
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      fail: (err) => {
        console.error('request failed:', err);
      }
    });
    return res.data;
  } catch (error) {
    console.error('API request failed:', error);
    Taro.showToast({ title: 'load failed', icon: 'none' });
    throw error;
  }
};

export const createOrders = async (productId, quantity) => {
  try {
    const res = await Taro.request({
      url: `${baseUrl}/api/orders`,
      method: 'POST',
      data: {  
          productId: productId,
          quantity: quantity },
    });
    if (res.statusCode != 200 ) {
      Taro.showToast({
        title: res.data?.message||'unkown error',
        icon: 'none',
        duration: 3000
      });
      return { success: false, code: 'INSUFFICIENT_STOCK' };
    }
    return res.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

