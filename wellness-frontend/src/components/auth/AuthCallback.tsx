import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          // Check if athlete profile exists
          const { data: existingProfile, error: profileError } = await supabase
            .from('athletes')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Profile check error:', profileError);
            throw profileError;
          }

          // If profile doesn't exist, create it
          if (!existingProfile) {
            const { error: createError } = await supabase
              .from('athletes')
              .insert([
                {
                  auth_user_id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
                  role: 'athlete'
                }
              ]);

            if (createError) {
              console.error('Profile creation error:', createError);
              throw createError;
            }
          }

          // Redirect to dashboard
          navigate('/');
        } else {
          console.error('No session after authentication');
          navigate('/signin');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/signin');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
