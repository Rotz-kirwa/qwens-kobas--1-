import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SEO from "@/components/SEO";
import { consumeAuthRedirect } from "@/lib/authRedirect";
import { getGoogleClientId, loadGoogleIdentityScript } from "@/lib/googleAuth";
import {
  getCurrentOrigin,
  hasInitializedGoogleForKey,
  markGoogleInitialized,
  shouldEnableGoogleAuth,
} from "@/lib/browser";

const Signup = () => {
  const { signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("Use your Google account to continue.");
  const [redirectPath] = useState(
    () => (location.state as { from?: string } | null)?.from || consumeAuthRedirect() || '/shop'
  );
  const passwordMeetsRequirements = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  useEffect(() => {
    let cancelled = false;
    let buttonRenderTimer: number | undefined;

    const setUnrenderedGoogleMessage = () => {
      const origin = getCurrentOrigin();
      setGoogleReady(false);
      setGoogleMessage(
        origin
          ? `Google sign-up could not be rendered for ${origin}. Add this origin to Authorized JavaScript origins in Google Cloud Console.`
          : "Google sign-up could not be rendered for this environment.",
      );
    };

    const initializeGoogle = async () => {
      const clientId = getGoogleClientId();
      if (!shouldEnableGoogleAuth(clientId)) {
        setGoogleMessage(
          "Google sign-up is disabled on this origin. Use email/password, or enable local Google auth with an authorized client ID.",
        );
        setGoogleReady(false);
        return;
      }

      try {
        await loadGoogleIdentityScript();

        if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) {
          return;
        }

        const initKey = `customer-auth:${clientId}`;
        if (!hasInitializedGoogleForKey(initKey)) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async ({ credential }) => {
              setGoogleLoading(true);

              try {
                await loginWithGoogle(credential);
                toast({ title: 'Welcome!', description: 'Your Google account is ready to shop.' });
                navigate(redirectPath);
              } catch (error: any) {
                toast({
                  title: "Google Sign-Up Failed",
                  description: error.message || "Unable to continue with Google.",
                  variant: "destructive",
                });
              } finally {
                setGoogleLoading(false);
              }
            },
            context: 'signup',
            ux_mode: 'popup',
          });
          markGoogleInitialized(initKey);
        }

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 368,
        });

        setGoogleReady(true);
        setGoogleMessage("Use your Google account to continue.");
        buttonRenderTimer = window.setTimeout(() => {
          if (cancelled) {
            return;
          }

          const hasRenderedButton = Boolean(
            googleButtonRef.current?.querySelector("iframe[src*='accounts.google.com/gsi/button']"),
          );
          if (!hasRenderedButton) {
            setUnrenderedGoogleMessage();
          }
        }, 1800);
      } catch (error: any) {
        if (!cancelled) {
          setGoogleReady(false);
          setGoogleMessage(
            error.message || "Google sign-in could not be loaded for this environment.",
          );
        }
      }
    };

    void initializeGoogle();

    return () => {
      cancelled = true;
      if (buttonRenderTimer) {
        window.clearTimeout(buttonRenderTimer);
      }
    };
  }, [loginWithGoogle, navigate, redirectPath, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordMeetsRequirements.test(formData.password)) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters and include both letters and numbers.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password, formData.phone);
      toast({ title: 'Account Created!', description: 'Welcome to Queen Koba.' });
      navigate(redirectPath);
    } catch (error: any) {
      toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <SEO
        title="Create Account"
        description="Create your Queen Koba account to manage checkout and orders."
        path="/signup"
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
              Create <span className="italic text-gold-gradient">Account</span>
            </h1>
            <p className="text-sm text-muted-foreground font-body">Join the Queen Koba family</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-body mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="signup-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-body mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-phone" className="block text-sm font-body mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="signup-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="+254 712 345 678"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-body mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="signup-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use at least 8 characters with both letters and numbers.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 bg-gold-gradient text-primary-foreground font-body font-bold text-sm tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-body uppercase tracking-[0.22em] text-muted-foreground">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {googleReady ? (
            <div
              ref={googleButtonRef}
              className="min-h-[44px] flex items-center justify-center rounded-sm border border-border bg-background"
            />
          ) : (
            <div className="min-h-[44px] rounded-sm border border-dashed border-border bg-secondary/10" />
          )}
          <p className="mt-3 text-center text-sm text-muted-foreground font-body">
            {googleLoading ? "Connecting to Google..." : googleMessage}
          </p>

          <p className="text-center text-sm text-muted-foreground font-body mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              state={{ from: redirectPath }}
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
