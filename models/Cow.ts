import mongoose from "mongoose";

const cowSchema = new mongoose.Schema(
  {
    cowId: { type: String, required: false, unique: true },
    name: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, default: "N/A" },
    age: { type: Number, default: null },
    weight: { type: Number, default: null },
    breed: { type: String, default: "N/A" },
    milkProduction: { type: Number, default: null },

    // ✅ All date fields now use null as default
    breedingDate: { type: Date, default: null },
    embryonicDeathDate: { type: Date, default: null }, // chances of infertility i.e after 21 days
    expectedCalvingDate: { type: Date, default: null }, // 283 days after breeding
    earlyDewormingDate: { type: Date, default: null }, // 60 days before calving 1st dose - (Juka)
    preCalvingMetabolicSupplimentDate: { type: Date, default: null }, // 30 days before calving
    lateDewormingDate: { type: Date, default: null }, // 15 days after calving 2nd dose - (Juka)
    calvingDate: { type: Date, default: null }, // actual calving date

    calvingCount: { type: Number, default: 0 },

    medicines: [
      {
        name: { type: String, required: true },
        dateGiven: { type: Date, default: null },
        dosage: { type: String, default: null },
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
        startDate: { type: Date, default: null },
        dueDate: { type: Date, default: null },
        delivered: { type: Boolean, default: false },
        notes: { type: String, default: null },
      },
    ],

    linkedCalves: [
      {
        calfId: { type: mongoose.Schema.Types.ObjectId, ref: "Calf" },
      },
    ],

    isFertilityConfirmed: { type: Boolean, default: false },
    isPregnant: { type: Boolean, default: false },
    isSick: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Cow = mongoose.models.Cow || mongoose.model("Cow", cowSchema);
export default Cow;
