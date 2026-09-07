import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-forest-600 text-sm mb-4">For instructors and lifelong students</p>
        <h1 className="font-display text-5xl sm:text-6xl font-semibold text-forest-900 leading-tight max-w-3xl mx-auto">
          Learn from people who actually do the work
        </h1>
        <p className="text-forest-700/80 mt-6 max-w-xl mx-auto text-lg">
          Real instructors, practical courses, and a path you can track from your first
          lecture to your last quiz.
        </p>
        <div className="mt-9 flex gap-4 justify-center">
          <Link
            to="/courses"
            className="bg-forest-800 text-white px-6 py-3 rounded-full hover:bg-forest-700 transition-colors"
          >
            Browse courses
          </Link>
          <Link
            to="/register"
            className="border border-forest-800 text-forest-800 px-6 py-3 rounded-full hover:bg-moss-100 transition-colors"
          >
            Teach on EduMarket
          </Link>
        </div>
      </section>

      <section className="bg-moss-100 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-3xl text-forest-900">Self-paced</p>
            <p className="text-forest-700/80 mt-2 text-sm">Learn on your own schedule, resume anytime.</p>
          </div>
          <div>
            <p className="font-display text-3xl text-forest-900">Track progress</p>
            <p className="text-forest-700/80 mt-2 text-sm">See exactly how far you are through every course.</p>
          </div>
          <div>
            <p className="font-display text-3xl text-forest-900">Real instructors</p>
            <p className="text-forest-700/80 mt-2 text-sm">Courses built and taught by working practitioners.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
