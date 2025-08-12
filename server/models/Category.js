const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// Check if the model already exists before defining it
// This prevents the OverwriteModelError
module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
