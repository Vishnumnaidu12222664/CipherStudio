const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cipherstudio";
mongoose.connect(MONGO, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=>console.log("Mongo connected"))
  .catch(err=>console.error("Mongo error:",err));

const projectSchema = new mongoose.Schema({
  projectId: { type: String, unique: true },
  files: { type: Object },
  updatedAt: { type: Date, default: Date.now }
});
const Project = mongoose.model("Project", projectSchema);

app.post("/save", async (req, res) => {
  const { projectId, files } = req.body;
  if(!projectId) return res.status(400).json({ error: "projectId required" });
  const p = await Project.findOneAndUpdate({ projectId }, { files, updatedAt: new Date() }, { upsert: true, new: true });
  res.json({ ok:true, projectId: p.projectId });
});

app.get("/load/:projectId", async (req, res) => {
  const p = await Project.findOne({ projectId: req.params.projectId });
  if(!p) return res.status(404).json({ error: "not found" });
  res.json({ projectId: p.projectId, files: p.files });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log("Server listening", PORT));
