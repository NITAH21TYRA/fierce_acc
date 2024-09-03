import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Products from './Component/Pages/Products';
import CreateAccount from './Component/Pages/CreateAccount';
import Order from './Component/Pages/Order';
import Cart from './Component/Pages/Cart';
import AdminDashboard from './Component/Pages/adminDashboard'; // Ensure correct component import
import AdminLogin from './Component/Pages/adminLogin'; // Ensure correct component import
import Login from './Component/Pages/Login'; // Correct casing
import Footer from './Component/Footer';
import { CartProvider } from './Component/CartContext'; // Ensure correct path
import { AuthProvider } from './Component/auth'; // Ensure correct path
// import SearchBar from './Component/SearchBar'; // Uncomment if needed
import './App.css';
import logo from './fierce__-removebg-preview.png';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Adjust URL if needed
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []); // Ensure products is always an array
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleSearch = () => {
    // Implement search functionality if needed
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <header className="App-header">
            <div className="left-section">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
            <div className="search-bar">
              <input className="active" type="text" placeholder="Search..." />
              <button onClick={handleSearch}>Search</button>
            </div>
            {/* <SearchBar products={products} /> */} {/* Uncomment if needed */}
          </header>

          <Router>
            <div>
              <Navbar />
              <Switch>
                <Route path="/products" exact>
                  <Products />
                </Route>
                <Route path="/cart" exact>
                  <Cart />
                </Route>
                <Route path="/create-account" exact>
                  <CreateAccount />
                </Route>
                <Route path="/order" exact>
                  <Order />
                </Route>
                <Route path="/login" exact>
                  <Login />
                </Route>
                <Route path="/admin/login" exact>
                  <AdminLogin /> {/* Corrected component usage */}
                </Route>
                {isAdmin ? (
                  <Route path="/admin-dashboard" exact>
                    <AdminDashboard /> {/* Corrected component usage */}
                  </Route>
                ) : (
                  <Redirect from="/admin-dashboard" to="/home" />
                )}
                <Redirect from="/" to={isAdmin ? "/admin-dashboard" : "/home"} />
                <Route path="*">
                  <Redirect to={isAdmin ? "/admin-dashboard" : "/home"} />
                </Route>
              </Switch>
              <Footer />
            </div>
          </Router>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
