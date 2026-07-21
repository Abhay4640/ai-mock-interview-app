import mongoose, { Schema, models } from "mongoose";

const InterviewSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    questions: [{ type: String }],
    answers: [
      {
        question: String,
        answer: String,
        feedback: String,
        score: Number,
      },
    ],
  },
  { timestamps: true }
);

export default models.InterviewSession || mongoose.model("InterviewSession", InterviewSessionSchema);
