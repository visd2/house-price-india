import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Predict from './pages/Predict'
import Market from './pages/Market'
import Compare from './pages/Compare'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home />}    />
        <Route path="/predict" element={<Predict />} />
        <Route path="/market"  element={<Market />}  />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </div>
  )
}
