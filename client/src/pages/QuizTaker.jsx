import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function QuizTaker() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/quizzes/${quizId}`)
      .then((res) => {
        setQuiz(res.data.quiz);
        setAnswers(new Array(res.data.quiz.questions.length).fill(null));
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load quiz"));
  }, [quizId]);

  const selectAnswer = (qIndex, optIndex) => {
    setAnswers((prev) => prev.map((a, i) => (i === qIndex ? optIndex : a)));
  };

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers });
    setResult(data);
  };

  if (error) return <div className="max-w-2xl mx-auto px-6 py-14 text-center text-forest-700/80">{error}</div>;
  if (!quiz) return <div className="p-14 text-center text-forest-700/70">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-forest-900 mb-8">{quiz.title}</h1>

      {result ? (
        <div className="bg-moss-100 border border-moss-200 rounded-xl p-6 text-center">
          <p className="font-display text-2xl text-forest-900">
            {result.correctCount} / {result.total} correct
          </p>
          <p className="text-forest-700/80 mt-2">Score: {result.submission.score}%</p>
          <Link to="/my-learning" className="inline-block mt-4 text-sm text-forest-800 underline">
            Back to my learning
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          {quiz.questions.map((q, i) => (
            <div key={q._id} className="bg-white border border-moss-200 rounded-xl p-4">
              <p className="font-medium text-forest-900 mb-3">{i + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIndex) => (
                  <label key={optIndex} className="flex items-center gap-2 text-sm text-forest-800">
                    <input
                      type="radio"
                      name={`q-${i}`}
                      checked={answers[i] === optIndex}
                      onChange={() => selectAnswer(i, optIndex)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            disabled={answers.includes(null)}
            className="bg-forest-800 text-white px-6 py-3 rounded-full hover:bg-forest-700 disabled:opacity-50"
          >
            Submit answers
          </button>
        </form>
      )}
    </div>
  );
}
