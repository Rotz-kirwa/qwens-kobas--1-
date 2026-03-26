import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SEO from "@/components/SEO";
import { consumeAuthRedirect } from "@/lib/authRedirect";
import { getGoogleClientId, loadGoogleIdentityScript } from "@/lib/googleAuth";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [redirectPath] = useState(
    () => (location.state as { from?: string } | null)?.from || consumeAuthRedirect() || '/shop'
  );

  useEffect(() => {
    let cancelled = false;

    const initializeGoogle = async () => {
      try {
        await loadGoogleIdentityScript();

        if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: getGoogleClientId(),
          callback: async ({ credential }) => {
            setGoogleLoading(true);

            try {
              await loginWithGoogle(credential);
              toast({ title: 'Welcome!', description: 'Successfully signed in with Google.' });
              navigate(redirectPath);
            } catch (error: any) {
              toast({
                title: "Google Sign-In Failed",
                description: error.message || "Unable to continue with Google.",
                variant: "destructive",
              });
            } finally {
              setGoogleLoading(false);
            }
          },
          context: 'signin',
          ux_mode: 'popup',
        });

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 368,
        });

        setGoogleReady(true);
      } catch (error: any) {
        if (!cancelled) {
          toast({
            title: "Google Sign-In Unavailable",
            description: error.message || "Google sign-in could not be loaded.",
            variant: "destructive",
          });
        }
      }
    };

    void initializeGoogle();

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle, navigate, redirectPath, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
      navigate(redirectPath);
    } catch (error: any) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <SEO
        title="Login"
        description="Sign in to your Queen Koba account."
        path="/login"
        robots="noindex,nofollow"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md px-4"
      >
        <div className="luxury-card">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-light mb-2">
              Welcome <span className="italic text-gold-gradient">Back</span>
            </h1>
            <p className="text-sm text-muted-foreground font-body">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-body mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-body mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use the password you created for your Queen Koba account.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 bg-gold-gradient text-primary-foreground font-body font-bold text-sm tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-body uppercase tracking-[0.22em] text-muted-foreground">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div
            ref={googleButtonRef}
            className={`min-h-[44px] flex items-center justify-center rounded-sm border border-border ${
              googleReady ? 'bg-background' : 'bg-secondary/10'
            }`}
          />
          <p className="mt-3 text-center text-sm text-muted-foreground font-body">
            {googleLoading ? "Connecting to Google..." : "Use your Google account to continue."}
          </p>

          <p className="text-center text-sm text-muted-foreground font-body mt-6">
            Don't have an account?{' '}
            <Link
              to="/signup"
              state={{ from: redirectPath }}
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
