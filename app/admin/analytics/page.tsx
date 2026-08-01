"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Stethoscope, UserCircle, Calendar,
  DollarSign, Activity, Heart, LogOut,
  ArrowLeft, TrendingUp, TrendingDown,
  FileText, Clock, CheckCircle, XCircle
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>({
    overview: {
      totalUsers: 0,
      totalDoctors: 0,
      totalPatients: 0,
      totalAppointments: 0,
      totalPayments: 0,
      totalRevenue: 0,
      totalPrescriptions: 0,
      totalMedicalRecords: 0,
    },
    monthlyRevenue: [],
    topDoctors: [],
    topPatients: [],
    appointmentStatus: [],
    recentActivities: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAnalytics(token);
  }, [router]);

  const fetchAnalytics = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
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
          <p className="text-gray-500 font-medium">Loading analytics...</p>
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
        {/* Back Button */}
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500">Complete overview of your healthcare platform</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-600" />}
            label="Total Users"
            value={analytics.overview.totalUsers}
            color="blue"
          />
          <StatCard
            icon={<Stethoscope className="w-5 h-5 text-emerald-600" />}
            label="Doctors"
            value={analytics.overview.totalDoctors}
            color="emerald"
          />
          <StatCard
            icon={<UserCircle className="w-5 h-5 text-purple-600" />}
            label="Patients"
            value={analytics.overview.totalPatients}
            color="purple"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            label="Revenue"
            value={`$${analytics.overview.totalRevenue}`}
            color="green"
          />
        </div>

        {/* More Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Calendar className="w-5 h-5 text-amber-600" />}
            label="Appointments"
            value={analytics.overview.totalAppointments}
            color="amber"
          />
          <StatCard
            icon={<FileText className="w-5 h-5 text-pink-600" />}
            label="Prescriptions"
            value={analytics.overview.totalPrescriptions}
            color="pink"
          />
          <StatCard
            icon={<Activity className="w-5 h-5 text-indigo-600" />}
            label="Medical Records"
            value={analytics.overview.totalMedicalRecords}
            color="indigo"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-teal-600" />}
            label="Payments"
            value={analytics.overview.totalPayments}
            color="teal"
          />
        </div>

        {/* Top Doctors & Patients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">🏆 Top Doctors</h3>
            {analytics.topDoctors.length === 0 ? (
              <p className="text-gray-500 text-sm">No data available</p>
            ) : (
              <div className="space-y-3">
                {analytics.topDoctors.map((doctor: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                      <span className="font-medium text-gray-700">{doctor.name}</span>
                      <span className="text-xs text-gray-400">{doctor.specialization}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{doctor.appointmentCount} appointments</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">🏆 Top Patients</h3>
            {analytics.topPatients.length === 0 ? (
              <p className="text-gray-500 text-sm">No data available</p>
            ) : (
              <div className="space-y-3">
                {analytics.topPatients.map((patient: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      <span className="font-medium text-gray-700">{patient.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{patient.appointmentCount} appointments</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Appointment Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">📊 Appointment Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analytics.appointmentStatus.map((status: any, index: number) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-800">{status.count}</p>
                <p className="text-xs text-gray-500 capitalize">{status._id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Stat Card (Fixed) ----------
function StatCard({ icon, label, value, color }: any) {
  const colors: Record<string, string> = {
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