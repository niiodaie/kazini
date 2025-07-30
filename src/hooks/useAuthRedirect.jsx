import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabase'

const useAuthRedirect = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Immediate session check on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/dashboard') // Change this if needed
      }
    })

    // Session change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate('/dashboard') // or '/home' or '/truth'
      }
    })

    return () => subscription.unsubscribe()
  }, [])
}

export default useAuthRedirect
