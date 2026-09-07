import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId }], // lecture _ids
    progressPercent: { type: Number, default: 0 },
    amountPaid: { type: Number, required: true },
    stripePaymentIntentId: { type: String, default: null },
    completedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
