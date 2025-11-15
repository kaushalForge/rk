import mongoose from "mongoose";

const calfSchema = new mongoose.Schema(
  {
    calfId: { type: String, required: true, unique: true },

    name: {
      type: String,
      required: true,
      unique: true,
    },

    image1: { type: String, required: true },

    image2: { type: String, default: "" },

    // keep medicines but OPTIONAL and EMPTY by default
    medicines: {
      type: [
        {
          name: { type: String },
          dateGiven: { type: Date },
          dosage: { type: String },
          hasTaken: { type: Boolean, default: false },
          note: { type: String, default: "" },
        },
      ],
      default: [],
    },

    // keep pregnancy but OPTIONAL
    isPregnant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Calf = mongoose.models.Calf || mongoose.model("Calf", calfSchema);
export default Calf;
