import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" }],
    stripeAccountId: { type: String, default: null }, // for instructor payouts via Stripe Connect
    isBanned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const { _id, name, email, role, avatarUrl, bio, createdAt } = this;
  return { id: _id, name, email, role, avatarUrl, bio, createdAt };
};

export default mongoose.model("User", userSchema);
