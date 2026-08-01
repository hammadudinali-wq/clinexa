"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, Users, FileText, Clock, 
  Heart, LogOut, Stethoscope, UserCircle
} from "lucide-react";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    totalPrescriptions: 0,
    pendingAppointments: 0,
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
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== "doctor") {
          router.push(`/${parsedUser.role}`);
          return;
        }
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }

    fetchDoctorStats(token);
  }, [router]);

  const fetchDoctorStats = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats({
          todayAppointments: data.data.totalAppointments || 0,
          totalPatients: data.data.totalPatients || 0,
          totalPrescriptions: data.data.totalPrescriptions || 0,
          pendingAppointments: data.data.totalAppointments || 0,
        });
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
          <p className="text-gray-500 font-medium">Loading doctor dashboard...</p>
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800">Clinexa</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.push("/doctor/profile")}
              className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition"
            >
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-medium hidden sm:inline">Profile</span>
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
            Welcome, Dr. {user?.fullName || "Doctor"} 👨‍⚕️
          </h1>
          <p className="text-gray-500 mt-1">Here's your practice overview</p>
        </div>

        {/* Doctor Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
            label="Today's Appointments"
            value={stats.todayAppointments}
            color="blue"
          />
          <StatCard
            icon={<Users className="w-5 h-5 text-green-600" />}
            label="Total Patients"
            value={stats.totalPatients}
            color="green"
          />
          <StatCard
            icon={<FileText className="w-5 h-5 text-purple-600" />}
            label="Prescriptions"
            value={stats.totalPrescriptions}
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-amber-600" />}
            label="Pending Appointments"
            value={stats.pendingAppointments}
            color="amber"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => router.push("/doctor/appointments")}
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-2xl text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/60 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">View Appointments</p>
                <p className="text-xs sm:text-sm text-gray-500">Check today's schedule</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/doctor/patients")}
            className="bg-green-50 hover:bg-green-100 p-4 rounded-2xl text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/60 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">My Patients</p>
                <p className="text-xs sm:text-sm text-gray-500">View all your patients</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/doctor/prescription")}
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-2xl text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/60 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Write Prescription</p>
                <p className="text-xs sm:text-sm text-gray-500">Prescribe medications</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Stat Card (Fixed) ----------
function StatCard({ icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100/50",
    green: "bg-green-50 border-green-100/50",
    purple: "bg-purple-50 border-purple-100/50",
    amber: "bg-amber-50 border-amber-100/50",
  };

  return (
    <div className={`${colors[color]} border rounded-2xl p-4 sm:p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="p-2 bg-white/60 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}