import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuthStore } from "../context/authStore.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/auth/login", form);
    setAuth(data.user, data.accessToken);
    navigate("/");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 px-6">
      <h1 className="font-display text-2xl text-forest-900 mb-6">Welcome back</h1>
      <form onSubmit={submit} className="space-y-4">
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
        <button className="bg-forest-800 text-white w-full py-3 rounded-full hover:bg-forest-700 transition-colors">
          Log in
        </button>
      </form>
      <p className="text-sm text-forest-700/70 mt-4">
        New here? <Link to="/register" className="text-forest-800 underline">Create an account</Link>
      </p>
    </div>
  );
}
