import Review from "../models/Review.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const recalculateRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: courseId } },
    { $group: { _id: "$course", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Course.findByIdAndUpdate(courseId, {
    ratingAverage: Math.round(avg * 10) / 10,
    ratingCount: count
  });
};

export const upsertReview = async (req, res) => {
  const { courseId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const enrolled = await Enrollment.findOne({ student: req.user.id, course: courseId });
  if (!enrolled) return res.status(403).json({ message: "Enroll in this course before reviewing it" });

  const review = await Review.findOneAndUpdate(
    { course: courseId, student: req.user.id },
    { rating, comment },
    { upsert: true, new: true }
  );

  await recalculateRating(courseId);
  res.status(201).json({ review });
};

export const listCourseReviews = async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId })
    .populate("student", "name avatarUrl")
    .sort("-createdAt");
  res.json({ reviews });
};

export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });
  if (String(review.student) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not your review" });
  }
  const courseId = review.course;
  await review.deleteOne();
  await recalculateRating(courseId);
  res.json({ message: "Review deleted" });
};
