"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";

type Role = "Doctor" | "Patient" | "Admin";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: "Active" | "Inactive";
  joined: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Dr. Ahmed Khan",
    email: "ahmed@clinexa.com",
    phone: "+92 300 1111111",
    role: "Doctor",
    status: "Active",
    joined: "Jul 28, 2026",
  },
  {
    id: 2,
    name: "Ali Raza",
    email: "ali@example.com",
    phone: "+92 301 2222222",
    role: "Patient",
    status: "Active",
    joined: "Jul 27, 2026",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Doctor" as Role,
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const doctors = users.filter((user) => user.role === "Doctor").length;
  const patients = users.filter((user) => user.role === "Patient").length;

  const openAddModal = () => {
    setEditingUser(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      role: "Doctor",
    });

    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: form.name,
                email: form.email,
                phone: form.phone,
                role: form.role,
              }
            : user
        )
      );
    } else {
      const newUser: User = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: "Active",
        joined: "Today",
      };

      setUsers((prev) => [newUser, ...prev]);
    }

    setShowModal(false);
  };

  const deleteUser = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f7f9] text-slate-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Administration
              </p>

              <h1 className="text-lg font-bold tracking-tight">
                User Management
              </h1>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="group flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Plus className="h-4 w-4 transition group-hover:rotate-90" />
            Add User
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="mb-2 text-sm font-medium text-slate-400">
            Clinexa Administration
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Manage your healthcare users
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add doctors, manage patients, control account status and
            keep your healthcare platform organized.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={users.length}
            icon={<Users className="h-5 w-5" />}
          />

          <StatCard
            title="Doctors"
            value={doctors}
            icon={<Stethoscope className="h-5 w-5" />}
          />

          <StatCard
            title="Patients"
            value={patients}
            icon={<UserRound className="h-5 w-5" />}
          />

          <StatCard
            title="Active Accounts"
            value={
              users.filter((user) => user.status === "Active")
                .length
            }
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                All Users
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {filteredUsers.length} users found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 sm:w-64"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(
                      e.target.value as "All" | Role
                    )
                  }
                  className="h-11 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium outline-none transition focus:border-slate-400 focus:bg-white"
                >
                  <option value="All">All Roles</option>
                  <option value="Doctor">Doctors</option>
                  <option value="Patient">Patients</option>
                  <option value="Admin">Admins</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600">
                            {user.name
                              .split(" ")
                              .map((word) => word[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {user.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              ID #{user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {user.email}
                          </p>

                          <p className="flex items-center gap-2 text-xs text-slate-400">
                            <Phone className="h-3.5 w-3.5" />
                            {user.phone}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className="flex items-center gap-2"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                            }`}
                          />

                          <span
                            className={`text-xs font-semibold ${
                              user.status === "Active"
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            {user.status}
                          </span>
                        </button>
                      </td>

                      <td className="px-6 py-5 text-xs text-slate-500">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          {user.joined}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-950 hover:text-white"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => deleteUser(user.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-400 transition hover:bg-red-500 hover:text-white"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600">
                      {user.name
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        {user.name}
                      </p>

                      <div className="mt-1">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {user.phone}
                  </p>

                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {user.joined}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-600">
                No users found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-5 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[520px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {editingUser ? "Edit Account" : "New Account"}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-950">
                    {editingUser ? "Edit User" : "Add New User"}
                  </h3>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <InputField
                  label="Full Name"
                  placeholder="Dr. John Smith"
                  value={form.name}
                  onChange={(value) =>
                    setForm({ ...form, name: value })
                  }
                />

                <InputField
                  label="Email Address"
                  placeholder="doctor@clinexa.com"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    setForm({ ...form, email: value })
                  }
                />

                <InputField
                  label="Phone Number"
                  placeholder="+92 300 0000000"
                  value={form.phone}
                  onChange={(value) =>
                    setForm({ ...form, phone: value })
                  }
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Account Role
                  </label>

                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        role: e.target.value as Role,
                      })
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  >
                    <option value="Doctor">Doctor</option>
                    <option value="Patient">Patient</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {!editingUser && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

                      <p className="text-xs leading-5 text-slate-500">
                        The account will be created as an active
                        account. Backend authentication will be
                        connected next.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
                  {editingUser ? (
                    <>
                      <Pencil className="h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create {form.role}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const styles = {
    Doctor: "bg-slate-100 text-slate-700",
    Patient: "bg-emerald-50 text-emerald-700",
    Admin: "bg-violet-50 text-violet-700",
  };

  const icons = {
    Doctor: <Stethoscope className="h-3.5 w-3.5" />,
    Patient: <UserRound className="h-3.5 w-3.5" />,
    Admin: <ShieldCheck className="h-3.5 w-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${styles[role]}`}
    >
      {icons[role]}
      {role}
    </span>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
      />
    </div>
  );
}