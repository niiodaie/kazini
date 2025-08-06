import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

export default function MagicLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMagicLink = async () => {
      const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (error) {
        console.error('Magic link verification failed:', error.message);
        return navigate('/signin?error=magiclink');
      }

      if (data?.session) {
        // Optional: Pull user profile or check plan type
        navigate('/truth-test'); // Redirect to post-login route
      }
    };

    handleMagicLink();
  }, [navigate]);

  return <p className="text-center mt-10 text-xl">Verifying your login…</p>;
}
