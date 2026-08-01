"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, Clock, User, Stethoscope, Heart, 
  LogOut, ArrowLeft, CheckCircle, XCircle, 
  Clock as ClockIcon, Search 
} from "lucide-react";

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAppointments(token);
  }, [router]);

  const fetchAppointments = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { color: "bg-amber-100 text-amber-700", icon: <ClockIcon className="w-4 h-4" /> },
      confirmed: { color: "bg-blue-100 text-blue-700", icon: <CheckCircle className="w-4 h-4" /> },
      completed: { color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
      cancelled: { color: "bg-red-100 text-red-700", icon: <XCircle className="w-4 h-4" /> },
      rescheduled: { color: "bg-purple-100 text-purple-700", icon: <ClockIcon className="w-4 h-4" /> },
    };
    return statusMap[status] || statusMap.pending;
  };

  const filteredAppointments = appointments.filter((a) =>
    a.patientId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    a.reason?.toLowerCase().includes(search.toLowerCase())
  );

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
          <p className="text-gray-500 font-medium">Loading appointments...</p>
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
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Stethoscope className="w-5 h-5 text-white" />
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/doctor")}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
            <p className="text-gray-500">View all your appointments</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No Appointments</h3>
            <p className="text-gray-500 mt-2">You don't have any appointments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const status = getStatusBadge(appointment.status);
              return (
                <div
                  key={appointment._id}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-800">
                          {appointment.patientId?.fullName || "Patient"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.appointmentTime}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{appointment.reason}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon}
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}