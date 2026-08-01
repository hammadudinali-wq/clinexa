"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Stethoscope, UserCircle, Calendar,
  DollarSign, Activity, Heart, LogOut,
  ArrowRight, FileText, Clock, Settings,
  Bell, UserPlus, TrendingUp
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    totalPrescriptions: 0,
    totalMedicalRecords: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        // ✅ Role check: Agar admin nahi hai toh redirect
        if (parsed.role !== "admin") {
          router.push(`/${parsed.role}`);
          return;
        }
        setUser(parsed);
      } catch {
        router.push("/login");
        return;
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
      if (data.success) {
        setStats(data.data);
      }
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
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Clinexa</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/analytics")}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Analytics</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.fullName || "Admin"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Manage your healthcare platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-600" />}
            label="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            icon={<Stethoscope className="w-5 h-5 text-emerald-600" />}
            label="Doctors"
            value={stats.totalDoctors}
            color="emerald"
          />
          <StatCard
            icon={<UserCircle className="w-5 h-5 text-purple-600" />}
            label="Patients"
            value={stats.totalPatients}
            color="purple"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            label="Revenue"
            value={`$${stats.totalRevenue}`}
            color="green"
          />
        </div>

        {/* More Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Calendar className="w-5 h-5 text-amber-600" />}
            label="Appointments"
            value={stats.totalAppointments}
            color="amber"
          />
          <StatCard
            icon={<FileText className="w-5 h-5 text-pink-600" />}
            label="Prescriptions"
            value={stats.totalPrescriptions}
            color="pink"
          />
          <StatCard
            icon={<Activity className="w-5 h-5 text-indigo-600" />}
            label="Medical Records"
            value={stats.totalMedicalRecords}
            color="indigo"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-teal-600" />}
            label="Payments"
            value={stats.totalPayments}
            color="teal"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/admin/users")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-800">Manage Users</span>
            </div>
            <p className="text-sm text-gray-500">View and manage all users</p>
          </button>

          <button
            onClick={() => router.push("/admin/doctors")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-semibold text-gray-800">Manage Doctors</span>
            </div>
            <p className="text-sm text-gray-500">View and manage all doctors</p>
          </button>

          <button
            onClick={() => router.push("/admin/patients")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-xl">
                <UserCircle className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-800">Manage Patients</span>
            </div>
            <p className="text-sm text-gray-500">View and manage all patients</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Stat Card ----------
function StatCard({ icon, label, value, color }: any) {
  const colors = {
    blue: "bg-blue-50 border-blue-100/50",
    emerald: "bg-emerald-50 border-emerald-100/50",
    purple: "bg-purple-50 border-purple-100/50",
    green: "bg-green-50 border-green-100/50",
    amber: "bg-amber-50 border-amber-100/50",
    pink: "bg-pink-50 border-pink-100/50",
    indigo: "bg-indigo-50 border-indigo-100/50",
    teal: "bg-teal-50 border-teal-100/50",
  };

  return (
    <div className={`${colors[color]} border rounded-2xl p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="p-2 bg-white/60 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}