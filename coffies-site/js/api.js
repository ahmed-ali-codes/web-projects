/**
 * api.js - Professional Backend API Mock
 * Simulates server-side processing for Orders and Payments
 */

const API = {
  /**
   * Simulates saving an order to a database
   */
  async processOrder(orderData) {
    console.log('Sending order to server...', orderData);
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/error logic
    const isSuccess = Math.random() > 0.05; // 95% success rate

    if (!isSuccess) {
      throw new Error('Payment server timed out. Please try again.');
    }

    // Save to local "Database" (LocalStorage Orders History)
    const orders = JSON.parse(localStorage.getItem('coffies_orders') || '[]');
    const newOrder = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      status: 'Processing',
      ...orderData
    };
    orders.push(newOrder);
    localStorage.setItem('coffies_orders', JSON.stringify(orders));

    return newOrder;
  },

  /**
   * Simulates user authentication check
   */
  async checkAuth() {
    return { loggedIn: false, user: null }; // Default to guest for now
  }
};

window.CoffiesAPI = API;
