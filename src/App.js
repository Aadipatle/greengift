import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ProductPage from './Pages/AllProducts';
import Addproduct from './components/CartPage';
import ProductDetail from './Pages/ProductDetails';
import Header from './components/Header';
import Pots from './Pages/Pots';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<Login />} path='/login' />
          <Route element={<Register />} path='/register' />
          <Route element={<ProductPage />} path='/products' />
          <Route element={<Pots />} path='/pots' />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route element={
           
              <Addproduct />
           } path='/add' />
          <Route element={
            <ProtectedRoute>
              <Addproduct />
            </ProtectedRoute>} path='/aadd' />
        </Routes>
      </BrowserRouter>
    </> 
  );
}

export default App;
