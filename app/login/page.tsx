"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, ChevronRight, List, Car, Settings, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState("admin@carbazaar.com");
  const [password, setPassword] = useState("123456Pp");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full bg-white font-sans selection:bg-gold-100 selection:text-gold-900">
      {/* Left Panel: Cinematic Image & Brand Story */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-bg.png"
            alt="Luxury Car Bond"
            fill
            className="object-cover opacity-60 transition-transform duration-10000 ease-linear"
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-600 shadow-lg shadow-gold-500/30" style={{ backgroundColor: '#D4AF37' }}>
            <Car className="text-white" size={24} />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-white uppercase">Car Baazar</span>
        </div>

        {/* Content */}
        <div className="relative z-10 mt-auto max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-500/10 px-3 py-1 text-sm font-medium text-gold-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500"></span>
            </span>
            V4.2.0 Fleet Management
          </div>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] text-white xl:text-5xl">
            Driving the future of <span className="bg-gradient-to-r from-gold-400 to-yellow-300 bg-clip-text text-transparent" style={{ color: '#D4AF37' }}>car trading</span>
          </h2>
          <p className="mt-6 text-lg text-slate-300/90 leading-relaxed">
            Everything you need to manage your car bond, inventory, and analytics in one premium dashboard. Specifically built for high-end car dealerships.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 transition-colors hover:bg-white/10">
              <div className="p-2 bg-gold-500/20 rounded-lg text-gold-400">
                <Settings size={20} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Inventory Tools</div>
                <div className="text-xs text-slate-400">Stock Management</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 transition-colors hover:bg-white/10">
              <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
                <List size={20} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Full Control</div>
                <div className="text-xs text-slate-400">Showroom Builder</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 mt-12 text-sm text-slate-500/80">
          &copy; 2026 Car Bazaar Ltd. All rights reserved. Built with precision.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div 
        className="flex flex-1 flex-col justify-center px-8 py-12 md:px-16 lg:px-24 xl:px-32"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="mx-auto w-full max-w-[420px]">
          {/* Mobile Logo Only */}
          <div className="mb-10 flex lg:hidden items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-600" style={{ backgroundColor: '#D4AF37' }}>
              <Car className="text-white" size={24} />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-slate-900 uppercase">Car Baazar</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-[32px] font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="text-lg text-slate-500">Sign in to your administrator account</p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="mt-12 group">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Work Email</label>
                  <div className="relative group/field">
                    <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within/field:text-gold-600 transition-colors">
                      <Mail size={19} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@carbazaar.com"
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-[16px] font-medium outline-none transition-all placeholder:text-slate-400 hover:border-slate-200 focus:border-gold-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-sm font-semibold text-slate-700">Password</label>
                    <button type="button" className="text-sm font-bold text-gold-600 hover:text-gold-700 transition-colors" style={{ color: '#D4AF37' }}>
                      Forgot?
                    </button>
                  </div>
                  <div className="relative group/field">
                    <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within/field:text-gold-600 transition-colors">
                      <Lock size={19} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-12 text-[16px] font-medium outline-none transition-all placeholder:text-slate-400 hover:border-slate-200 focus:border-gold-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)]"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <input 
                  type="checkbox" 
                  id="remember"
                  className="h-5 w-5 rounded-lg border-2 border-slate-200 text-gold-600 focus:ring-gold-500 transition-all cursor-pointer" 
                />
                <label htmlFor="remember" className="text-[15px] font-medium text-slate-600 cursor-pointer">
                  Stay signed in for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[#ff6a00] px-6 py-4 text-[16px] font-bold text-white transition-all hover:bg-[#e65f00] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Enter Dashboard <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundImage: 'linear-gradient(to right, #ff6a00, #ff9100)' }} />
              </button>
            </form>
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-[15px] text-slate-600">
              Trouble logging in?{" "}
              <Link href="/" className="font-bold text-gold-600 hover:text-gold-700 transition-colors underline-offset-4 hover:underline" style={{ color: '#D4AF37' }}>
                Contact your IT department
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
