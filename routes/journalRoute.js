import express from "express";
import fetchuser from "../middleware/fetchUser.js";
const router = express.Router();
import Journal from "../models/Journal.js";
// import { body, validationResult } from "express-validator";

//Route 0: Get all data in home page: GET : journals/getalldata, login not required
export const getAllData = async (req, res) => {
  // console.log("get all data ", req.body);
  try {
    const journals = await Journals.find();
    // console.log("notes: ", notes);
    res.json(journals);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};

// Route 1: Fetch user data  GET: journals/fetchdata , Login required
const fetchData = async (req, res) => {
  // console.log("fetch data ", req.body);
  try {
    // console.log("fetching data....");
    const journals = await Journals.find({ user: req.user.id });
    // console.log("notes: ", notes);
    res.json(journals);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};

// Route 1: Add notes POST: journals/addnotes , Login required
const addJournal = async (req, res) => {
  //   console.log("user id: ", req.user.id);
  console.log("Inside add journal:", req.body);
  const { title } = req.body;
  try {
    const journal = new Journal({
      title,

      user: req.user.id,
    });
    const savedJournal = await journal.save();
    console.log("savedJournal", savedJournal);
    res.json(savedJournal);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};
// Route 3: update notes PUT: journals/updatenotes , Login required
const updateJournal = async (req, res) => {
  // console.log("getting the id", req.user.id);
  const { title } = req.body;
  // console.log("update:", req.body);
  try {
    // create new note object
    const newJournal = {};
    if (title) {
      newJournal.title = title;
    }

    // console.log("newNote:", newNote);

    // find the note to be updated and update it
    // console.log(req.params.id);
    let journal = await Journals.findById(req.params.id);
    // console.log("note:", note);
    if (!journal) {
      return res.status(404).send("Not Found");
    }
    // console.log("note user:", note.user);
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Journals.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    ); // here new:true means if any new content comes it will get updated
    // console.log("editted note:", note);
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};
// Route 4: Delete a note: DELETE: journals/deletenote/:id , Login required
const deleteJournal = async (req, res) => {
  // console.log(req.body);
  try {
    // find the note to be updated and update it
    let note = await Journals.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Journals.findByIdAndDelete(req.params.id); // here new:true means if any new content comes it will get updated
    // console.log("Deleted note: " + note);
    res.json({ Success: "Note has been deleted.", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};
// Route: 5 -> Search notes
const searchJournal = async (req, res) => {
  const query = req.query.search
    ? { title: { $regex: req.query.search, $options: "i" } }
    : {};

  console.log("query: ", query);
  try {
    let searchNotes = await Journals.find(query);
    res.json(searchNotes);
  } catch (error) {
    console.error("Error occurred while searching notes:", error);
    // Send an error response
    res.status(500).json({ error: "An error occurred while searching notes." });
  }
};

router.get("/getAllJournal", fetchuser, getAllData);
router.get("/fetchData", fetchuser, fetchData);
router.post("/addJournal", fetchuser, addJournal);
router.put("/edit", fetchuser, updateJournal);
router.delete("/deleteJournal", fetchuser, deleteJournal);
router.get("/searchJournal", fetchuser, searchJournal);

export default router;
