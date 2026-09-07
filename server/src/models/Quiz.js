import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    questions: [questionSchema]
  },
  { timestamps: true }
);

const submissionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ type: Number }], // index chosen per question
    score: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
export const QuizSubmission = mongoose.model("QuizSubmission", submissionSchema);
