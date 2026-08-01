"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Stethoscope, UserCircle, Calendar, 
  Heart, LogOut, Bell, ArrowRight, 
  DollarSign, FileText 
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        // ✅ Sirf admin ko dashboard allow karo
        if (parsedUser.role !== "admin") {
          router.push(`/${parsedUser.role}`); // patient → /patient, doctor → /doctor
          return;
        }
        
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }

    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800">Clinexa</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Good morning, {user?.fullName || "Admin"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your practice overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
            label="Total Patients"
            value={stats.totalPatients}
            change="+12%"
            color="blue"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />}
            label="Appointments"
            value={stats.totalAppointments}
            change="+8%"
            color="amber"
          />
          <StatCard
            icon={<Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />}
            label="Doctors"
            value={stats.totalDoctors}
            change="+2%"
            color="emerald"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />}
            label="Revenue"
            value={`$${stats.totalRevenue}`}
            change="+15%"
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
          <QuickAction
            title="New Appointment"
            description="Schedule a new appointment"
            icon={<Calendar className="w-5 h-5" />}
            color="purple"
          />
          <QuickAction
            title="Add Patient"
            description="Register a new patient"
            icon={<UserCircle className="w-5 h-5" />}
            color="blue"
          />
          <QuickAction
            title="View Reports"
            description="See full analytics report"
            icon={<FileText className="w-5 h-5" />}
            color="emerald"
          />
        </div>
      </div>
    </div>
  );
}

// ---------- Stat Card ----------
function StatCard({ icon, label, value, change, color }: any) {
  const colors = {
    blue: "bg-blue-50 border-blue-100/50",
    amber: "bg-amber-50 border-amber-100/50",
    emerald: "bg-emerald-50 border-emerald-100/50",
    green: "bg-green-50 border-green-100/50",
  };

  return (
    <div className={`${colors[color]} border rounded-2xl p-4 sm:p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{value}</p>
          <p className="text-xs text-green-600 mt-1">{change} from last month</p>
        </div>
        <div className="p-2 bg-white/60 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}

// ---------- Quick Action ----------
function QuickAction({ title, description, icon, color }: any) {
  const colors = {
    purple: "bg-purple-50 hover:bg-purple-100",
    blue: "bg-blue-50 hover:bg-blue-100",
    emerald: "bg-emerald-50 hover:bg-emerald-100",
  };

  return (
    <button
      className={`${colors[color]} p-4 rounded-2xl text-left transition-all group flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/60 rounded-xl">{icon}</div>
        <div>
          <p className="font-semibold text-gray-800 text-sm sm:text-base">{title}</p>
          <p className="text-xs sm:text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
    </button>
  );
}