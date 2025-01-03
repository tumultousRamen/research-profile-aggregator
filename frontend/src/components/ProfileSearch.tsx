import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search
    navigate(`/profile/1?name=${searchTerm}`)
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Research Profile Aggregator
      </h1>
      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter researcher name..."
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default ProfileSearch