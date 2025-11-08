import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  date: Date;

  // === PERIOD-WISE REPORTS ===
  daily: {
    milkStats: { date: string; totalMilk: number; avgMilkPerCow: number }[];
    calfStats: { date: string; avgWeight: number; totalCalves: number }[];
    healthStats: { status: string; count: number }[]; // healthy/sick/recovering
    pregnancyStats: { status: string; count: number }[]; // pregnant/non-pregnant
    medicinesStats: { category: string; count: number }[]; // taken/pending
  };

  weekly: {
    milkStats: { week: string; totalMilk: number; avgMilkPerCow: number }[];
    calfStats: { week: string; avgWeight: number; totalCalves: number }[];
    healthStats: { status: string; count: number }[];
    pregnancyStats: { status: string; count: number }[];
    medicinesStats: { category: string; count: number }[];
  };

  monthly: {
    milkStats: { month: string; totalMilk: number; avgMilkPerCow: number }[];
    calfStats: { month: string; avgWeight: number; totalCalves: number }[];
    healthStats: { status: string; count: number }[];
    pregnancyStats: { status: string; count: number }[];
    medicinesStats: { category: string; count: number }[];
  };

  // === OVERALL SUMMARY ===
  totals: {
    totalCows: number;
    totalCalves: number;
    totalMilk: number;
    totalMedicinesGiven: number;
    avgCalfWeight: number;
  };
}

const reportSchema = new Schema<IReport>(
  {
    date: { type: Date, default: Date.now },

    // === DAILY ===
    daily: {
      milkStats: [
        {
          date: String,
          totalMilk: Number,
          avgMilkPerCow: Number,
        },
      ],
      calfStats: [
        {
          date: String,
          avgWeight: Number,
          totalCalves: Number,
        },
      ],
      healthStats: [
        {
          status: String, // healthy, sick, recovering
          count: Number,
        },
      ],
      pregnancyStats: [
        {
          status: String, // pregnant, non-pregnant
          count: Number,
        },
      ],
      medicinesStats: [
        {
          category: String, // taken, pending
          count: Number,
        },
      ],
    },

    // === WEEKLY ===
    weekly: {
      milkStats: [
        {
          week: String,
          totalMilk: Number,
          avgMilkPerCow: Number,
        },
      ],
      calfStats: [
        {
          week: String,
          avgWeight: Number,
          totalCalves: Number,
        },
      ],
      healthStats: [
        {
          status: String,
          count: Number,
        },
      ],
      pregnancyStats: [
        {
          status: String,
          count: Number,
        },
      ],
      medicinesStats: [
        {
          category: String,
          count: Number,
        },
      ],
    },

    // === MONTHLY ===
    monthly: {
      milkStats: [
        {
          month: String,
          totalMilk: Number,
          avgMilkPerCow: Number,
        },
      ],
      calfStats: [
        {
          month: String,
          avgWeight: Number,
          totalCalves: Number,
        },
      ],
      healthStats: [
        {
          status: String,
          count: Number,
        },
      ],
      pregnancyStats: [
        {
          status: String,
          count: Number,
        },
      ],
      medicinesStats: [
        {
          category: String,
          count: Number,
        },
      ],
    },

    // === TOTAL OVERVIEW ===
    totals: {
      totalCows: { type: Number, default: 0 },
      totalCalves: { type: Number, default: 0 },
      totalMilk: { type: Number, default: 0 },
      totalMedicinesGiven: { type: Number, default: 0 },
      avgCalfWeight: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Report =
  mongoose.models.Report || mongoose.model<IReport>("Report", reportSchema);
export default Report;
