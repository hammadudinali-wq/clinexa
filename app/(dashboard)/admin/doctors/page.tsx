"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope, User, Mail, Phone, Calendar,
  Heart, LogOut, ArrowLeft, Search, Plus,
  Eye, Edit, Trash2, CheckCircle, XCircle,
  UserCircle, Clock
} from "lucide-react";

export default function AdminDoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    department: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDoctors(token);
  }, [router]);

  const fetchDoctors = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/doctors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDoctors(doctors.filter((d) => d._id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingDoctor
        ? `http://localhost:5000/api/doctors/${editingDoctor._id}`
        : "http://localhost:5000/api/doctors";
      const method = editingDoctor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience) || 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // ✅ Fix: Check token before calling fetchDoctors
        const newToken = localStorage.getItem("token");
        if (newToken) {
          fetchDoctors(newToken);
        }
        setShowModal(false);
        setEditingDoctor(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          specialization: "",
          qualification: "",
          experience: "",
          department: "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
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
          <p className="text-gray-500 font-medium">Loading doctors...</p>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
            <p className="text-gray-500">View and manage all doctors</p>
          </div>
          <button
            onClick={() => {
              setEditingDoctor(null);
              setFormData({
                name: "",
                email: "",
                phone: "",
                specialization: "",
                qualification: "",
                experience: "",
                department: "",
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Doctor
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Doctors List */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No Doctors Found</h3>
            <p className="text-gray-500 mt-2">No doctors registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                    {doctor.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{doctor.name || "Unknown"}</h3>
                    <p className="text-sm text-gray-500">{doctor.specialization || "General"}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{doctor.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{doctor.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.experience || 0} years experience</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => router.push(`/admin/doctors/${doctor._id}`)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setEditingDoctor(doctor);
                      setFormData({
                        name: doctor.name || "",
                        email: doctor.email || "",
                        phone: doctor.phone || "",
                        specialization: doctor.specialization || "",
                        qualification: doctor.qualification || "",
                        experience: doctor.experience?.toString() || "",
                        department: doctor.department || "",
                      });
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doctor._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingDoctor ? "Edit Doctor" : "Add Doctor"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingDoctor(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition"
              >
                {editingDoctor ? "Update Doctor" : "Add Doctor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}