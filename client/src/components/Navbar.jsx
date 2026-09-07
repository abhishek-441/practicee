import { Link } from "react-router-dom";
import { useAuthStore } from "../context/authStore.js";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="border-b border-moss-200 bg-paper/90 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="font-display text-xl font-semibold text-forest-900 tracking-tight">
        EduMarket
      </Link>
      <div className="flex gap-6 items-center text-sm text-forest-800">
        <Link to="/courses" className="hover:text-forest-600 transition-colors">Courses</Link>
        {user?.role === "instructor" && (
          <Link to="/instructor" className="hover:text-forest-600 transition-colors">Dashboard</Link>
        )}
        {user?.role === "student" && (
          <Link to="/my-learning" className="hover:text-forest-600 transition-colors">My learning</Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin" className="hover:text-forest-600 transition-colors">Admin</Link>
        )}
        {user ? (
          <button onClick={logout} className="hover:text-forest-600 transition-colors">
            Log out
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-forest-600 transition-colors">Log in</Link>
            <Link to="/register" className="bg-forest-800 text-white px-4 py-2 rounded-full hover:bg-forest-700 transition-colors">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
