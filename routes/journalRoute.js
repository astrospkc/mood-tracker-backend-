import express from "express";
import fetchuser from "../middleware/fetchUser.js";
const router = express.Router();
import Journal from "../models/Journal.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
// import { body, validationResult } from "express-validator";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Route 1: Fetch user data  GET: journals/fetchdata , Login required

const fetchData = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id });

    res.json(journals);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};

// fetch journal with id
const fetchJournalwith_id = async (req, res) => {
  const { id } = req.params;
  try {
    const journal = await Journal.findById(id);
    res.json(journal);
  } catch (error) {
    res.status(500).send("Internal error occurred");
  }
};

// Route 1: Add notes POST: journals/addnotes , Login required
const addJournal = async (req, res) => {
  console.log("Inside add journal:", req.body);
  const { title } = req.body;
  try {
    const file = req.files.img;
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const journal = new Journal({
          title,
          img: result.secure_url,
          user: req.user.id,
        });
        const savedJournal = await journal.save();

        res.json(savedJournal);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};
// Route 3: update notes PUT: journals/updatenotes , Login required
const updateJournal = async (req, res) => {
  const { title } = req.body;

  try {
    // create new note object
    const newJournal = {};
    if (title) {
      newJournal.title = title;
    }

    // find the note to be updated and update it

    let journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).send("Not Found");
    }

    if (journal.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Journal.findByIdAndUpdate(
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
    let journal = await Journal.findById(req.params.id);
    if (!journal) {
      return res.status(404).send("Not Found");
    }

    if (journal.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    journal = await Journal.findByIdAndDelete(req.params.id); // here new:true means if any new content comes it will get updated
    // console.log("Deleted note: " + note);
    res.json({ Success: "Journal has been deleted.", journal: journal });
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

// Route 7: edit the journal card

const editJournal = async (req, res) => {
  const { title } = req.body;
  const image = req.files.img;
  const { id } = req.params;
};

export const removedayjournal = async (user_id, journal_id, dayJournal_id) => {
  console.log("user id: ", user_id, " --- ", journal_id, " ", dayJournal_id);
  const user_exist = await User.findById(user_id);
  if (user_exist) {
    const journal_exist = await Journal.findById(journal_id);

    if (journal_exist) {
      const journals = journal_exist.journals;
      for (let i = 0; i < journals.length; i++) {
        if (journals[i].toString() === dayJournal_id) {
          journals.splice(i, 1);
          break;
        }
      }
      console.log("journals: ", journals);
      journal_exist.journals = journals;
      return journal_exist.save();
    } else {
      console.log("journal not found");
    }
  } else {
    console.log("user not found");
  }
};

// const removeDayJournalFromJournal = async (req, res) => {
//   try {
//     const removedData = await removedayjournal(req.user.id, req.params.id);
//     res.status(200).json(removedData);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal error occurred");
//   }
// };

router.get("/fetchData", fetchuser, fetchData);
router.get("/fetchData/:id", fetchuser, fetchJournalwith_id);
router.post("/addJournal", fetchuser, addJournal);
router.put("/edit", fetchuser, updateJournal);
router.delete("/deleteJournal/:id", fetchuser, deleteJournal);
router.get("/searchJournal", fetchuser, searchJournal);

export default router;
