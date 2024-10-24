import express from "express";
import WeekJournal from "../models/WeekJournals.js";
import fetchuser from "../middleware/fetchUser.js";
import Journal from "../models/Journal.js";
import e from "express";
const router = express.Router();

const createWeekJournal = async (req, res) => {
  const { main_title, title, body } = req.body;
  const { user } = req.user;
  try {
    const data = {
      main_title: main_title,
      title: title,
      body: body,
    };

    let journalDoc = await Journal.findOne({ _id: main_title });

    if (
      journalDoc &&
      Array.isArray(journalDoc.journals) &&
      journalDoc.journals.length < 7
    ) {
      const createJournal = await WeekJournal.create(data);
      // Append the new journal ID
      journalDoc.journals.push(createJournal._id);

      // Save the updated document back to the database
      await journalDoc.save(); // Don't forget to save changes

      console.log("Updated journals list: ", journalDoc.journals);
      console.log("savedjournal week: ", createJournal);
      res.json(createJournal);
    } else {
      console.log(
        "No more journals can be inserted; week days are completed; start next week."
      );
      res.status(400).json("week is over");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};

router.post("/create", fetchuser, createWeekJournal);
export default router;
