"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, Calendar, User, Stethoscope, 
  Heart, LogOut, ArrowLeft, Search, 
  Clock, AlertCircle, CheckCircle 
} from "lucide-react";

export default function PatientMedicalRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);

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
        if (parsed.role !== "patient") {
          router.push(`/${parsed.role}`);
          return;
        }
        setUser(parsed);
      } catch {
        router.push("/login");
      }
    }

    fetchMedicalRecords(token);
  }, [router]);

  const fetchMedicalRecords = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/medical-records", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; icon: JSX.Element } } = {
      active: { color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
      resolved: { color: "bg-blue-100 text-blue-700", icon: <CheckCircle className="w-4 h-4" /> },
      pending: { color: "bg-amber-100 text-amber-700", icon: <Clock className="w-4 h-4" /> },
    };
    return statusMap[status] || statusMap.pending;
  };

  const filteredRecords = records.filter((r) =>
    r.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
    r.treatment?.toLowerCase().includes(search.toLowerCase()) ||
    r.notes?.toLowerCase().includes(search.toLowerCase())
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
          <p className="text-gray-500 font-medium">Loading medical records...</p>
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
              <Heart className="w-5 h-5 text-white" />
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
          onClick={() => router.push("/patient")}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
            <p className="text-gray-500">View your complete medical history</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Medical Records List */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No Medical Records</h3>
            <p className="text-gray-500 mt-2">You don't have any medical records yet.</p>
            <p className="text-gray-400 text-sm mt-1">Records will appear here after your appointments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((record) => (
              <div
                key={record._id}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-800">
                        {record.diagnosis || "Medical Record"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Stethoscope className="w-4 h-4" />
                        <span>{record.doctorId?.name || "Doctor"}</span>
                      </div>
                    </div>
                    {record.treatment && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Treatment:</span> {record.treatment}
                      </p>
                    )}
                    {record.notes && (
                      <p className="text-gray-500 text-sm">
                        <span className="font-medium">Notes:</span> {record.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge("active").color}`}>
                      {getStatusBadge("active").icon}
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}