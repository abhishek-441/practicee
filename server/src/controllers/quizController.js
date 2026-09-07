import { Quiz, QuizSubmission } from "../models/Quiz.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const createQuiz = async (req, res) => {
  const { courseId, sectionId } = req.params;
  const { title, questions } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (String(course.instructor) !== req.user.id) {
    return res.status(403).json({ message: "Not your course" });
  }
  if (!course.sections.id(sectionId)) {
    return res.status(404).json({ message: "Section not found" });
  }

  const quiz = await Quiz.create({ course: courseId, sectionId, title, questions });
  res.status(201).json({ quiz });
};

// Students get questions WITHOUT the correct answer indices
export const getQuizForStudent = async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  const enrolled = await Enrollment.findOne({ student: req.user.id, course: quiz.course });
  if (!enrolled && req.user.role !== "admin") {
    return res.status(403).json({ message: "Enroll in this course to take the quiz" });
  }

  const safeQuiz = {
    _id: quiz._id,
    title: quiz.title,
    course: quiz.course,
    questions: quiz.questions.map((q) => ({ _id: q._id, question: q.question, options: q.options }))
  };
  res.json({ quiz: safeQuiz });
};

export const getQuizForInstructor = async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  const course = await Course.findById(quiz.course);
  if (String(course.instructor) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not your course" });
  }
  res.json({ quiz });
};

export const submitQuiz = async (req, res) => {
  const { answers } = req.body; // array of option indices, same order as quiz.questions
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  const enrolled = await Enrollment.findOne({ student: req.user.id, course: quiz.course });
  if (!enrolled) return res.status(403).json({ message: "Enroll in this course to submit the quiz" });

  let correct = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctOptionIndex) correct += 1;
  });
  const score = Math.round((correct / quiz.questions.length) * 100);

  const submission = await QuizSubmission.findOneAndUpdate(
    { quiz: quiz._id, student: req.user.id },
    { answers, score },
    { upsert: true, new: true }
  );

  res.json({ submission, correctCount: correct, total: quiz.questions.length });
};

export const listCourseQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId }).select("-questions.correctOptionIndex");
  res.json({ quizzes });
};
