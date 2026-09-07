import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const load = async () => {
    const [s, u, c] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/courses")
    ]);
    setStats(s.data);
    setUsers(u.data.users);
    setCourses(c.data.courses);
  };
  useEffect(() => { load(); }, []);

  const toggleBan = async (userId, banned) => {
    await api.patch(`/admin/users/${userId}/ban`, { banned: !banned });
    load();
  };

  const togglePublish = async (courseId, isPublished) => {
    await api.patch(`/admin/courses/${courseId}/publish`, { isPublished: !isPublished });
    load();
  };

  if (!stats) return <div className="p-14 text-center text-forest-700/70">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-forest-900 mb-8">Platform overview</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
        {[
          ["Users", stats.userCount],
          ["Instructors", stats.instructorCount],
          ["Courses", stats.courseCount],
          ["Published", stats.publishedCourseCount],
          ["Revenue", `$${stats.totalRevenue}`]
        ].map(([label, value]) => (
          <div key={label} className="bg-moss-100 rounded-xl p-4 text-center">
            <p className="font-display text-xl text-forest-900">{value}</p>
            <p className="text-xs text-forest-700/70">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl text-forest-900 mb-4">Courses</h2>
      <ul className="space-y-2 mb-12">
        {courses.map((c) => (
          <li key={c._id} className="bg-white border border-moss-200 p-3 rounded-lg flex justify-between items-center text-sm">
            <span>{c.title} <span className="text-forest-700/60">by {c.instructor?.name}</span></span>
            <button
              onClick={() => togglePublish(c._id, c.isPublished)}
              className={`px-3 py-1 rounded-full text-xs ${c.isPublished ? "bg-moss-100 text-forest-700" : "bg-gray-100 text-gray-500"}`}
            >
              {c.isPublished ? "Unpublish" : "Publish"}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="font-display text-xl text-forest-900 mb-4">Users</h2>
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u._id} className="bg-white border border-moss-200 p-3 rounded-lg flex justify-between items-center text-sm">
            <span>{u.name} <span className="text-forest-700/60">({u.role})</span></span>
            <button
              onClick={() => toggleBan(u._id, u.isBanned)}
              className={`px-3 py-1 rounded-full text-xs ${u.isBanned ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
            >
              {u.isBanned ? "Unban" : "Ban"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
