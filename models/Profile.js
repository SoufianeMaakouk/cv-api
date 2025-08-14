import mongoose from "mongoose";

const Link = new mongoose.Schema({
  label: String,
  href: String
}, { _id: false });

const Language = new mongoose.Schema({
  name: String,
  level: String
}, { _id: false });

const Experience = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  start: String,
  end: String,
  highlights: [String]
}, { _id: false });

const Education = new mongoose.Schema({
  title: String,
  institution: String,
  year: String
}, { _id: false });

const Project = new mongoose.Schema({
  name: String,
  description: String,
  url: String
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  headline: String,
  avatar: String,
  email: String,
  phone: String,
  location: String,
  links: [Link],
  core_competencies: [String],
  technical_skills: [String],
  languages: [Language],
  experience: [Experience],
  education: [Education],
  projects: [Project]
}, { timestamps: true });

export default mongoose.model("Profile", ProfileSchema);
