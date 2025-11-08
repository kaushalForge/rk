import mongoose from "mongoose";

const calfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, default: "" },
    breed: { type: String, default: "", required: false },
    age: { type: Number, default: null },
    weight: { type: Number, default: null },

    // ✅ Keep medicineToConsume separate from medicines
    medicineToConsume: {
      type: [
        {
          name: { type: String, required: true },
          medicineNote: { type: String, default: "" },
        },
      ],
      default: [],
    },

    // ✅ Medicines list (given medicines)
    medicines: {
      type: [
        {
          name: { type: String, required: true },
          dateGiven: { type: Date },
          dosage: { type: String },
          hasTaken: { type: Boolean, default: false },
          note: { type: String, default: "" },
        },
      ],
      default: [],
    },

    isPregenant: { type: Boolean, default: false },
    isSick: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite on hot reload
const Calf = mongoose.models.Calf || mongoose.model("Calf", calfSchema);
export default Calf;
