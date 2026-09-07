import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const enrollInCourse = async (req, res) => {
  // Free-course enrollment only. Paid courses are enrolled via the Stripe webhook
  // in paymentController.js once checkout.session.completed fires.
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (course.price > 0) {
    return res.status(400).json({ message: "Paid courses must be enrolled via checkout" });
  }

  const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
  if (existing) return res.status(409).json({ message: "Already enrolled" });

  const enrollment = await Enrollment.create({
    student: req.user.id,
    course: courseId,
    amountPaid: 0
  });

  course.enrollmentCount += 1;
  await course.save();

  res.status(201).json({ enrollment });
};

export const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user.id }).populate("course");
  res.json({ enrollments });
};

export const markLectureComplete = async (req, res) => {
  const { courseId, lectureId } = req.body;
  const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
  if (!enrollment) return res.status(404).json({ message: "Not enrolled in this course" });

  if (!enrollment.completedLectures.includes(lectureId)) {
    enrollment.completedLectures.push(lectureId);
  }

  const course = await Course.findById(courseId);
  const totalLectures = course.sections.reduce((sum, s) => sum + s.lectures.length, 0);
  enrollment.progressPercent = totalLectures
    ? Math.round((enrollment.completedLectures.length / totalLectures) * 100)
    : 0;
  if (enrollment.progressPercent === 100) enrollment.completedAt = new Date();

  await enrollment.save();
  res.json({ enrollment });
};
