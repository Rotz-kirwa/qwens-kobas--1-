import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SEO from "@/components/SEO";
import { consumeAuthRedirect, setAuthRedirect } from "@/lib/authRedirect";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.2-1.6H12Z" />
    <path fill="#34A853" d="M2.8 12c0 5.2 4.1 9.3 9.2 9.3 5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6Z" />
    <path fill="#4A90E2" d="M3.9 7.8 7.1 10c.9-2.1 2.8-3.5 4.9-3.5 1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7c-3.5 0-6.6 2-8.1 5.1Z" />
    <path fill="#FBBC05" d="M3.9 7.8A9.6 9.6 0 0 0 2.8 12c0 1.5.4 2.9 1.1 4.2L7.1 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2L3.9 7.8Z" />
  </svg>
);

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [redirectPath] = useState(
    () => (location.state as { from?: string } | null)?.from || consumeAuthRedirect() || '/shop'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{4}$/.test(formData.password)) {
      toast({
        title: "Invalid Password",
        description: "Password must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }

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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      setAuthRedirect(redirectPath);
      await loginWithGoogle();
    } catch (error: any) {
      toast({
        title: "Google Sign-In Unavailable",
        description: error.message || "Google sign-in is not configured yet.",
        variant: "destructive",
      });
      setGoogleLoading(false);
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="1234"
                  required
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Use your 4-digit password</p>
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

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-sm border border-border bg-background px-4 py-3 text-sm font-body font-semibold text-foreground transition-colors hover:border-primary hover:bg-secondary/20 disabled:opacity-50"
          >
            <GoogleIcon />
            {googleLoading ? "Connecting to Google..." : "Sign in with Google"}
          </button>

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
