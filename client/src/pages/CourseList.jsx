import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data.courses));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h2 className="font-display text-3xl text-forest-900 mb-8">All courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <Link
            key={c._id}
            to={`/courses/${c.slug}`}
            className="bg-white border border-moss-200 rounded-2xl p-5 hover:border-forest-500 hover:shadow-sm transition-all"
          >
            <span className="inline-block text-xs bg-moss-100 text-forest-700 px-2 py-1 rounded-full">
              {c.category}
            </span>
            <h3 className="font-display text-lg text-forest-900 mt-3">{c.title}</h3>
            <p className="mt-3 font-semibold text-forest-800">${c.price}</p>
          </Link>
        ))}
        {courses.length === 0 && (
          <p className="text-forest-700/70 col-span-full text-center py-10">
            No courses published yet.
          </p>
        )}
      </div>
    </div>
  );
}
