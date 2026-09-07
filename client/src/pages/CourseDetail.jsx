import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuthStore } from "../context/authStore.js";
import StarRating from "../components/StarRating.jsx";

export default function CourseDetail() {
  const { slug } = useParams();
  const user = useAuthStore((s) => s.user);
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");

  useEffect(() => {
    api.get(`/courses/${slug}`).then((res) => {
      setCourse(res.data.course);
      api.get(`/quizzes/course/${res.data.course._id}`).then((r) => setQuizzes(r.data.quizzes));
      api.get(`/reviews/course/${res.data.course._id}`).then((r) => setReviews(r.data.reviews));
    });
  }, [slug]);

  const enroll = async () => {
    if (course.price === 0) {
      await api.post("/enrollments", { courseId: course._id });
      window.location.reload();
      return;
    }
    const { data } = await api.post("/payments/checkout-session", { courseId: course._id });
    window.location.href = data.url;
  };

  const submitReview = async (e) => {
    e.preventDefault();
    await api.post(`/reviews/course/${course._id}`, { rating: myRating, comment: myComment });
    const r = await api.get(`/reviews/course/${course._id}`);
    setReviews(r.data.reviews);
  };

  if (!course) return <div className="p-14 text-center text-forest-700/70">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <span className="inline-block text-xs bg-moss-100 text-forest-700 px-2 py-1 rounded-full">{course.category}</span>
      <h1 className="font-display text-4xl text-forest-900 mt-4">{course.title}</h1>
      <p className="text-forest-700/80 mt-4 leading-relaxed">{course.description}</p>

      {course.ratingCount > 0 && (
        <div className="flex items-center gap-2 mt-3 text-sm text-forest-700">
          <StarRating value={Math.round(course.ratingAverage)} readOnly />
          <span>{course.ratingAverage} ({course.ratingCount} reviews)</span>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <p className="font-display text-2xl text-forest-900">{course.price === 0 ? "Free" : `$${course.price}`}</p>
        <button onClick={enroll} className="bg-forest-800 text-white px-6 py-3 rounded-full hover:bg-forest-700 transition-colors">
          Enroll now
        </button>
      </div>

      <div className="mt-12 border-t border-moss-200 pt-8">
        <h2 className="font-display text-xl text-forest-900 mb-4">Course content</h2>
        {course.sections?.map((s) => {
          const sectionQuiz = quizzes.find((q) => q.sectionId === s._id);
          return (
            <div key={s._id} className="border border-moss-200 rounded-xl p-4 mb-3 bg-white">
              <h3 className="font-medium text-forest-900">{s.title}</h3>
              <ul className="mt-3 space-y-2">
                {s.lectures.map((l) => (
                  <li key={l._id} className="text-sm text-forest-700/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-500" />
                    {l.title}
                  </li>
                ))}
              </ul>
              {sectionQuiz && (
                <Link
                  to={`/quiz/${sectionQuiz._id}`}
                  className="inline-block mt-3 text-sm text-forest-700 underline"
                >
                  Take section quiz: {sectionQuiz.title}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 border-t border-moss-200 pt-8">
        <h2 className="font-display text-xl text-forest-900 mb-4">Reviews</h2>
        {user?.role === "student" && (
          <form onSubmit={submitReview} className="bg-white border border-moss-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-forest-700 mb-2">Leave a review</p>
            <StarRating value={myRating} onChange={setMyRating} />
            <textarea
              className="border border-moss-200 w-full p-3 rounded-lg mt-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              placeholder="What did you think of this course?"
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
            />
            <button className="mt-2 bg-forest-800 text-white px-5 py-2 rounded-full text-sm hover:bg-forest-700">
              Submit review
            </button>
          </form>
        )}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-moss-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-forest-900 text-sm">{r.student?.name}</span>
                <StarRating value={r.rating} readOnly />
              </div>
              {r.comment && <p className="text-sm text-forest-700/80 mt-1">{r.comment}</p>}
            </div>
          ))}
          {reviews.length === 0 && <p className="text-forest-700/70 text-sm">No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}
