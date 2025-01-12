import mongoose from "mongoose";
const { Schema } = mongoose;

const JournalSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    journals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "weekJournal",
      },
    ],
    // emotions: {
    //   type: EmotionSchema,
    //   default: () => ({}), // Initializes with the default values defined in EmotionSchema
    // },
    emotions: {
      type: String,
      default:
        '{"anger": "0", "joy": "0", "sadness": "0", "happiness": "0", "chilled": "0", "adventurous": "0", "loneliness": "0", "overall": "positive"}\n',
    },
    img: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Journal = mongoose.model("journal", JournalSchema);
export default Journal;
