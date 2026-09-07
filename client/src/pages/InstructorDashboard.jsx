import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");

  const load = () => api.get("/courses/mine").then((res) => setCourses(res.data.courses));
  useEffect(() => { load(); }, []);

  const createCourse = async (e) => {
    e.preventDefault();
    await api.post("/courses", {
      title,
      description: "Add a real description in the course editor.",
      price: 0,
      category: "General"
    });
    setTitle("");
    load();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-forest-900 mb-8">Your courses</h1>
      <form onSubmit={createCourse} className="flex gap-3 mb-10">
        <input
          className="border border-moss-200 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-forest-500"
          placeholder="New course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-forest-800 text-white px-6 rounded-full hover:bg-forest-700 transition-colors">
          Create
        </button>
      </form>
      <ul className="space-y-3">
        {courses.map((c) => (
          <li key={c._id} className="bg-white border border-moss-200 p-4 rounded-xl flex justify-between items-center">
            <Link to={`/instructor/courses/${c._id}`} className="text-forest-900 hover:text-forest-600">
              {c.title}
            </Link>
            <span className={`text-xs px-3 py-1 rounded-full ${c.isPublished ? "bg-moss-100 text-forest-700" : "bg-gray-100 text-gray-500"}`}>
              {c.isPublished ? "Published" : "Draft"}
            </span>
          </li>
        ))}
        {courses.length === 0 && (
          <p className="text-forest-700/70 text-center py-8">No courses yet — create your first above.</p>
        )}
      </ul>
    </div>
  );
}
