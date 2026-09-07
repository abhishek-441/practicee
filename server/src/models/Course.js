import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, default: 0 }, // seconds
    resources: [{ name: String, url: String }],
    isPreview: { type: Boolean, default: false } // free preview lecture
  },
  { _id: true }
);

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    lectures: [lectureSchema]
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sections: [sectionSchema],
    isPublished: { type: Boolean, default: false },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Course", courseSchema);
