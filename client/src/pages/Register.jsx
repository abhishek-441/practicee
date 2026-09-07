import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuthStore } from "../context/authStore.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/auth/register", form);
    setAuth(data.user, data.accessToken);
    navigate("/");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 px-6">
      <h1 className="font-display text-2xl text-forest-900 mb-6">Create your account</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="border border-moss-200 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border border-moss-200 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border border-moss-200 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="border border-moss-200 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-800"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <button className="bg-forest-800 text-white w-full py-3 rounded-full hover:bg-forest-700 transition-colors">
          Sign up
        </button>
      </form>
      <p className="text-sm text-forest-700/70 mt-4">
        Already have an account? <Link to="/login" className="text-forest-800 underline">Log in</Link>
      </p>
    </div>
  );
}
