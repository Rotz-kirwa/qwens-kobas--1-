import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SEO from "@/components/SEO";
import { consumeAuthRedirect } from "@/lib/authRedirect";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event("queenkoba-auth-changed"));
        
        toast({ title: 'Welcome!', description: 'Successfully logged in with Google.' });
        navigate(consumeAuthRedirect() || '/shop');
      } catch (error) {
        toast({ title: 'Error', description: 'Authentication failed', variant: 'destructive' });
        navigate('/login');
      }
    } else {
      toast({ title: 'Error', description: 'Authentication failed', variant: 'destructive' });
      navigate('/login');
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SEO
        title="Authentication"
        description="Completing authentication for Queen Koba."
        path="/auth/callback"
        robots="noindex,nofollow"
      />
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
