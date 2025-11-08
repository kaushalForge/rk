import mongoose from "mongoose";

const cowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, default: "" },
    breed: { type: String, default: "" },
    age: { type: Number, default: null },
    weight: { type: Number, default: null },
    milkProduction: { type: Number, default: null },
    medicines: [
      {
        name: { type: String, required: true },
        dateGiven: Date,
        dosage: String,
        hasTaken: { type: Boolean, default: false },
        note: { type: String, default: null },
      },
    ],
    medicineToConsume: {
      type: [
        {
          name: { type: String, required: false },
          medicineNote: { type: String, default: null },
        },
      ],
      default: [],
    },
    pregnancies: [
      {
        attempt: { type: Number, required: false },
        startDate: Date,
        dueDate: Date,
        delivered: { type: Boolean, default: false },
        notes: { type: String, default: null },
      },
    ],
    calves: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Calf", default: [] },
    ],
    isPregenant: { type: Boolean, default: false },
    isSick: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Cow = mongoose.models.Cow || mongoose.model("Cow", cowSchema);
export default Cow;
