import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProfileSearch from './components/ProfileSearch.tsx'
import ProfileDetail from './components/ProfileDetail.tsx'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProfileSearch />} />
            <Route path="/profile/:id" element={<ProfileDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App