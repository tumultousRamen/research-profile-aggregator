import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { profileApi } from '../services/api'

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>()
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => profileApi.getProfile(id!)
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{profile?.name}</h1>
      {/* TODO: Add more profile details */}
    </div>
  )
}

export default ProfileDetail