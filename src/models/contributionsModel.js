const mongoose = require("mongoose");
const contributionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["GROUP", "LOAN_REPAYMENT"],
    default: "GROUP",
    required: true,
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  group:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Group",
    required:true
  }
});

contributionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const contributionModel = mongoose.model("Contribution", contributionSchema);
module.exports = contributionModel;
