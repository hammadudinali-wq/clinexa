"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, Stethoscope, Users, Calendar, 
  DollarSign, Activity, ArrowRight, 
  Shield, Clock, Star, Phone, Mail,
  Menu, X, Sparkles, CheckCircle, 
  Award, TrendingUp, UserPlus, 
  Pill, FileText, MessageCircle, 
  Globe, Lock, Zap, Headphones
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      const role = user?.role || "patient";
      router.push(`/${role}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Clinexa</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition">Features</a>
              <a href="#about" className="text-gray-600 hover:text-purple-600 transition">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-purple-600 transition">Contact</a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <Link
                  href={`/${user?.role || "patient"}`}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition">
                    Login
                  </Link>
                  <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-3">
            <a href="#features" className="block text-gray-600 hover:text-purple-600 transition">Features</a>
            <a href="#about" className="block text-gray-600 hover:text-purple-600 transition">About</a>
            <a href="#testimonials" className="block text-gray-600 hover:text-purple-600 transition">Testimonials</a>
            <a href="#contact" className="block text-gray-600 hover:text-purple-600 transition">Contact</a>
            {isLoggedIn ? (
              <Link href={`/${user?.role || "patient"}`} className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-center">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-purple-600 border border-purple-200 rounded-xl text-center">Login</Link>
                <Link href="/register" className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-center">Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Next-Gen Healthcare Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Healthcare,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simplified.
              </span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto lg:mx-0">
              Clinexa brings patients, doctors, appointments and hospital operations together in one elegant and intelligent healthcare management platform.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
              <button
                onClick={handleGetStarted}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition flex items-center gap-2"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#features" className="px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-purple-300 transition flex items-center gap-2">
                Learn More
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Clinexa</h3>
                    <p className="text-sm text-gray-500">Healthcare Platform</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">248 Total Patients</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">+12% Appointments</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">18 View all</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Everything You Need</h2>
            <p className="text-gray-500 mt-2">Complete healthcare management solution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Patient Management"
              description="Manage patient records, history and appointments effortlessly"
              color="blue"
            />
            <FeatureCard
              icon={<Stethoscope className="w-6 h-6" />}
              title="Doctor Management"
              description="Track doctor schedules, availability and specializations"
              color="emerald"
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Appointment Booking"
              description="Easy online appointment scheduling and management"
              color="purple"
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Payment Processing"
              description="Secure and transparent payment management system"
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose Clinexa?</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Intelligent Platform</h4>
                  <p className="text-gray-500 text-sm">AI-powered insights and analytics for better decision making</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Secure & Compliant</h4>
                  <p className="text-gray-500 text-sm">Enterprise-grade security with full data protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">24/7 Support</h4>
                  <p className="text-gray-500 text-sm">Round-the-clock assistance whenever you need it</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
              <p className="text-sm text-gray-500">Uptime</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600">10K+</div>
              <p className="text-sm text-gray-500">Happy Users</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <p className="text-sm text-gray-500">Support</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600">5★</div>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">What Our Users Say</h2>
            <p className="text-gray-500 mt-2">Trusted by healthcare professionals worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Dr. Sarah Ahmed"
              role="Cardiologist"
              text="Clinexa has transformed how I manage my practice. The appointment system is seamless and intuitive."
              rating={5}
            />
            <TestimonialCard
              name="Ali Khan"
              role="Patient"
              text="Booking appointments has never been easier. I love how I can track my medical history in one place."
              rating={5}
            />
            <TestimonialCard
              name="Dr. Usman Malik"
              role="General Physician"
              text="The platform is incredibly efficient. I can easily manage my patients and prescriptions."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">Join thousands of healthcare professionals using Clinexa</p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl transition"
          >
            {isLoggedIn ? "Go to Dashboard" : "Start Free Trial"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Clinexa</span>
            </div>
            <p className="text-sm">Healthcare management platform for modern practices.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition">Updates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 Clinexa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ---------- Feature Card ----------
function FeatureCard({ icon, title, description, color }: any) {
  const colors = {
    blue: "bg-blue-50 hover:bg-blue-100",
    emerald: "bg-emerald-50 hover:bg-emerald-100",
    purple: "bg-purple-50 hover:bg-purple-100",
    pink: "bg-pink-50 hover:bg-pink-100",
  };

  return (
    <div className={`${colors[color]} p-6 rounded-2xl transition-all group`}>
      <div className="w-12 h-12 bg-white/60 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}

// ---------- Testimonial Card ----------
function TestimonialCard({ name, role, text, rating }: any) {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl">
      <div className="flex gap-1 text-yellow-400 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <p className="text-gray-600 text-sm">"{text}"</p>
      <div className="mt-4">
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}