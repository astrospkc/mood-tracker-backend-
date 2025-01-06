import express, { text } from "express";
import WeekJournal from "../models/WeekJournals.js";
import fetchuser from "../middleware/fetchUser.js";
import Journal from "../models/Journal.js";
import e from "express";
import { run } from "../openAI.js";
import { removedayjournal } from "./journalRoute.js";

const router = express.Router();

const createWeekJournal = async (req, res) => {
  const { main_title, title, body } = req.body;

  try {
    const data = {
      main_title: main_title,
      title: title,
      body: body,
      user: req.user.id,
    };

    let journalDoc = await Journal.findOne({ _id: main_title });
    console.log("journal doc: ", journalDoc, journalDoc.journals.length);

    if (
      journalDoc &&
      // Array.isArray(journalDoc.journals) &&
      journalDoc.journals.length < 7
    ) {
      console.log("length of the journals: ", journalDoc.journals.length);
      const weekJournal = new WeekJournal(data);
      const savedWeekJournal = await weekJournal.save();

      journalDoc.journals.push(weekJournal._id);

      // Save the updated document back to the database
      await journalDoc.save();
      res.json(savedWeekJournal);
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

const fetchweekdata = async (user_id, journal_id) => {
  const data = await Journal.find({
    main_title: journal_id,
    user: user_id,
  });
  console.log("data: ", data);
  // all the week days journal of particular week
  const week_data = await WeekJournal.find({ main_title: journal_id });
  console.log("week_data: ", week_data);
  return week_data;
};

const fetchWeekJournal = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  console.log("journal id: and userid ", id, user_id);

  try {
    const data = await fetchweekdata(user_id, id);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
  }
};

const fetchWeekDayJournalwith_id = async (req, res) => {
  const { day_id } = req.params;
  console.log("day id: ", day_id);
  try {
    const data = await WeekJournal.findById(day_id);
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal error occurred");
  }
};

const summarizeWeekJournal = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const weekdata_to_summarize = await fetchweekdata(user_id, id);

    const summarize = await run(weekdata_to_summarize);
    // const jsonSummary = JSON.parse(summarize);
    await Journal.updateOne({ _id: id }, { $set: { emotions: summarize } });
    console.log("summarize: ", summarize);
    res.status(200).json(summarize);
  } catch (error) {
    console.error(error);
    res.status(400).json("error occurred while summarizing journal");
  }
};

const updateDayJournal = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const newJournal = {};
    if (title) {
      newJournal.title = title;
    }
    if (body) {
      newJournal.body = body;
    }
    const dayJournal = await WeekJournal.findByIdAndUpdate(
      id,
      { $set: newJournal },
      { new: true }
    );
    res.json(dayJournal);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};

const deleteDayJournal = async (req, res) => {
  // console.log(req.body);
  console.log(" day id: ", req.params.id);
  try {
    // find the note to be updated and update it
    let journal = await WeekJournal.findById(req.params.id);
    console.log("journal: ", journal);
    if (!journal) {
      return res.status(404).send("Not Found");
    }

    if (journal.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    journal = await WeekJournal.findByIdAndDelete(req.params.id); // here new:true means if any new content comes it will get updated

    // delete the same journal from the main journals array
    const user = journal.user;
    const journal_id = journal.main_title;
    const data = await removedayjournal(user, journal_id, req.params.id);
    console.log("data after removing day journal: ", data);
    // console.log("Deleted note: " + note);
    res.json({ Success: "Day journal has been deleted.", journal: journal });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};

router.put("/updateDayJournal/:id", fetchuser, updateDayJournal);
router.post("/create", fetchuser, createWeekJournal);
router.get("/fetchJournal/:id", fetchuser, fetchWeekJournal);
router.get("/summarizeJournal/:id", fetchuser, summarizeWeekJournal);
router.get("/fetchJournal/:id/:day_id", fetchuser, fetchWeekDayJournalwith_id);
router.delete("/deleteDayJournal/:id", fetchuser, deleteDayJournal);

export default router;
