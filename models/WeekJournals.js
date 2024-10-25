import mongoose from "mongoose";
const { Schema } = mongoose;

const WeekJournalSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    main_title: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "journal",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    body: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const WeekJournal = mongoose.model("weekJournal", WeekJournalSchema);
export default WeekJournal;
