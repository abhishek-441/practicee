import Course from "../models/Course.js";

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString(36);

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, level, thumbnailUrl } = req.body;
    const course = await Course.create({
      title,
      slug: slugify(title),
      description,
      price,
      category,
      level,
      thumbnailUrl,
      instructor: req.user.id
    });
    res.status(201).json({ course });
  } catch (err) {
    res.status(500).json({ message: "Failed to create course", error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (String(course.instructor) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your course" });
    }
    Object.assign(course, req.body);
    await course.save();
    res.json({ course });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course", error: err.message });
  }
};

export const addSection = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (String(course.instructor) !== req.user.id) return res.status(403).json({ message: "Not your course" });
  course.sections.push({ title: req.body.title, order: course.sections.length });
  await course.save();
  res.status(201).json({ course });
};

export const addLecture = async (req, res) => {
  const { id, sectionId } = req.params;
  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (String(course.instructor) !== req.user.id) return res.status(403).json({ message: "Not your course" });
  const section = course.sections.id(sectionId);
  if (!section) return res.status(404).json({ message: "Section not found" });
  section.lectures.push(req.body); // { title, videoUrl, duration, isPreview }
  await course.save();
  res.status(201).json({ course });
};

export const publishCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (String(course.instructor) !== req.user.id) return res.status(403).json({ message: "Not your course" });
  course.isPublished = req.body.isPublished ?? true;
  await course.save();
  res.json({ course });
};

export const listCourses = async (req, res) => {
  const { q, category, level, page = 1, limit = 12 } = req.query;
  const filter = { isPublished: true };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (level) filter.level = level;

  const courses = await Course.find(filter)
    .populate("instructor", "name avatarUrl")
    .select("-sections")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Course.countDocuments(filter);
  res.json({ courses, total, page: Number(page), pages: Math.ceil(total / limit) });
};

export const getCourseBySlug = async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug }).populate("instructor", "name avatarUrl bio");
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json({ course });
};

export const getMyCourses = async (req, res) => {
  const courses = await Course.find({ instructor: req.user.id }).sort("-createdAt");
  res.json({ courses });
};
