import mongoose from "mongoose";
const { Schema } = mongoose;

const JournalSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    title: { type: String, required: true },

    body: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Journal = mongoose.model("journal", JournalSchema);
export default Journal;
