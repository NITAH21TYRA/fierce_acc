import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './adminDashboard.css'; // Ensure you have this CSS file for styles

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    image: ''
  });
  const [error, setError] = useState('');
  const history = useHistory();

  // Fetch orders and products when component mounts
  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleApproveOrder = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders list after approval
      } else {
        const errorData = await response.json();
        console.error('Failed to approve order:', errorData);
        setError('Failed to approve order');
      }
    } catch (error) {
      console.error('Error while approving order:', error);
      setError('Failed to approve order');
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched orders:', data); // Debugging line
        setOrders(data.orders || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch orders:', errorData);
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data); // Debugging line
        setProducts(data.products || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch products:', errorData);
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        fetchProducts(); // Refresh products list after adding
        setNewProduct({
          name: '',
          price: '',
          stock: '',
          image: ''
        });
        setError(''); // Clear any previous errors
      } else {
        const errorData = await response.json();
        console.error('Failed to add product:', errorData);
        setError(errorData.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product');
    }
  };

  const handleAddToHome = async (productId) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/products/${productId}/add-to-home`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchProducts(); // Refresh products list after adding to home
      } else {
        const errorData = await response.json();
        console.error('Failed to add product to home:', errorData);
        setError('Failed to add product to home');
      }
    } catch (error) {
      console.error('Error adding product to home:', error);
      setError('Failed to add product to home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    history.push('/login');
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {error && <div className="error-message">{error}</div>}

      <div className="section padded-box">
        <h3>Orders</h3>
        <ul>
          {orders.length > 0 ? (
            orders.map((order) => (
              <li key={order.id}>
                Order ID: {order.id}, Customer: {order.customer_name}, Total: {order.total}
                <button onClick={() => handleApproveOrder(order.id)} className="btn btn-approve">Approve</button>
              </li>
            ))
          ) : (
            <p>No orders to display</p>
          )}
        </ul>
      </div>

      <div className="section padded-box">
        <h3>Products</h3>
        <ul>
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id}>
                Name: {product.name}, Price: {product.price}, Stock: {product.stock}
                <button onClick={() => handleAddToHome(product.id)} className="btn btn-add-to-home">Add to Home</button>
              </li>
            ))
          ) : (
            <p>No products to display</p>
          )}
        </ul>
      </div>

      <div className="section padded-box">
        <h3>Add Product</h3>
        <form onSubmit={handleAddProduct} className="add-product-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
