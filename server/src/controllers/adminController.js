import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const listAllUsers = async (req, res) => {
  const users = await User.find().select("-password").sort("-createdAt");
  res.json({ users });
};

export const setUserBanned = async (req, res) => {
  const { banned } = req.body;
  const user = await User.findByIdAndUpdate(req.params.userId, { isBanned: !!banned }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: user.toSafeObject() });
};

export const listAllCourses = async (req, res) => {
  const courses = await Course.find().populate("instructor", "name email").sort("-createdAt");
  res.json({ courses });
};

export const adminSetPublished = async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.courseId,
    { isPublished: !!req.body.isPublished },
    { new: true }
  );
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json({ course });
};

export const platformStats = async (req, res) => {
  const [userCount, instructorCount, courseCount, publishedCourseCount, enrollments] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "instructor" }),
    Course.countDocuments(),
    Course.countDocuments({ isPublished: true }),
    Enrollment.find().select("amountPaid")
  ]);
  const totalRevenue = enrollments.reduce((sum, e) => sum + (e.amountPaid || 0), 0);

  res.json({
    userCount,
    instructorCount,
    courseCount,
    publishedCourseCount,
    enrollmentCount: enrollments.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100
  });
};
