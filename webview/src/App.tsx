import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import QuizIntro from './pages/QuizIntro';
import QuizQuestion from './pages/QuizQuestion';
import QuizResult from './pages/QuizResult';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { QuizProvider } from './context/QuizContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <QuizProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/quiz-intro" element={<QuizIntro />} />
              <Route path="/quiz-question" element={<QuizQuestion />} />
              <Route path="/quiz-result" element={<QuizResult />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </ToastProvider>
      </CartProvider>
    </QuizProvider>
  );
}
