import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    // user: { 
    //   type: mongoose.Schema.Types.ObjectId, 
    //   ref: "User", // 🔗 Reference to User collection
    //   required: true 
    // },
    userId: { 
      type: String, 
      required: true 
    },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    basicPay: {
      type: Number,
      required: true,
      min: 0,
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    netPay: {
      type: Number,
      min: 0,
      // ❌ remove required:true → it will be auto-calculated
    },
    month: {
      type: String,
      required: true,
      match: /^(0?[1-9]|1[0-2])-(\d{4})$/, // MM-YYYY
    },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Paid", "Failed"],
      default: "Pending",
    },
    paymentDate: Date,
    processedBy: {
      type: String, // ✅ Changed from ObjectId → String (to accept EMP codes)
    },
    processedAt: Date,
    remarks: {
      type: String,
      maxlength: 300,
    },
    payslip: {
      filename: String,
      path: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

// Auto-calculate netPay before save
salarySchema.pre("save", function (next) {
  if (this.basicPay !== undefined) {
    const allowances = this.allowances || 0;
    const deductions = this.deductions || 0;
    this.netPay = Math.max(0, this.basicPay + allowances - deductions);
  }
  next();
});

// Indexes for faster queries
salarySchema.index({ userId: 1, month: 1 }, { unique: true });
salarySchema.index({ status: 1 });
salarySchema.index({ createdAt: -1 });

export default mongoose.model("Salary", salarySchema);
