import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    api.get("/enrollments").then((res) => setEnrollments(res.data.enrollments));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-forest-900 mb-8">My learning</h1>
      <ul className="space-y-4">
        {enrollments.map((en) => (
          <li key={en._id} className="bg-white border border-moss-200 p-5 rounded-xl">
            <Link to={`/courses/${en.course.slug}`} className="font-medium text-forest-900 hover:text-forest-600">
              {en.course.title}
            </Link>
            <div className="w-full bg-moss-100 h-2 rounded-full mt-3">
              <div
                className="bg-forest-600 h-2 rounded-full transition-all"
                style={{ width: `${en.progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-forest-700/70">{en.progressPercent}% complete</span>
          </li>
        ))}
        {enrollments.length === 0 && (
          <p className="text-forest-700/70 text-center py-8">
            You haven't enrolled in any courses yet.
          </p>
        )}
      </ul>
    </div>
  );
}
