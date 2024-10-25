import express from "express";
import WeekJournal from "../models/WeekJournals.js";
import fetchuser from "../middleware/fetchUser.js";
import Journal from "../models/Journal.js";
import e from "express";
import { run } from "../openAI.js";
const router = express.Router();

const createWeekJournal = async (req, res) => {
  const { main_title, title, body } = req.body;
  const { user } = req.user;
  try {
    const data = {
      main_title: main_title,
      title: title,
      body: body,
      user: user,
    };

    let journalDoc = await Journal.find({ _id: main_title });
    console.log("journal doc: ", journalDoc, journalDoc[0].journals.length);

    if (
      journalDoc &&
      // Array.isArray(journalDoc.journals) &&
      journalDoc[0].journals.length < 7
    ) {
      const createJournal = await WeekJournal.create(data);
      console.log("create journal: ", createJournal);
      // Append the new journal ID
      journalDoc[0].journals.push(createJournal._id);

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

const fetchweekdata = async (title) => {
  const data = await Journal.find({
    title: title,
  });
  console.log("data: ", data, data[0]._id);
  // all the week days journal of particular week
  const week_data = await WeekJournal.find({ main_title: data[0]._id });
  console.log("week_data: ,", week_data);
  return week_data;
};

const fetchWeekJournal = async (req, res) => {
  const title = req.query.query;
  console.log("main_title: ", title);
  try {
    const data = await fetchweekdata(title);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
  }
};

const summarizeWeekJournal = async (req, res) => {
  const main_title = req.query.query;
  try {
    const weekdata_to_summarize = await fetchweekdata(main_title);
    const summarize = await run(weekdata_to_summarize);
    console.log("summarize: ", summarize);
    res.status(200).json(summarize);
  } catch (error) {
    console.error(error);
    res.status(400).json("error occurred while summarizing journal");
  }
};

router.post("/create", fetchuser, createWeekJournal);
router.get("/fetchJournal", fetchuser, fetchWeekJournal);
router.get("/summarizeJournal", fetchuser, summarizeWeekJournal);
export default router;
