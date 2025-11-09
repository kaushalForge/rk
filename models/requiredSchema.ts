const mongoose = require("mongoose");

const requiredSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Required =
  mongoose.models.Cow || mongoose.model("Required", requiredSchema);
export default Required;
