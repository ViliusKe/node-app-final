import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, min: 6 },
  password: { type: String, required: true },
  bought_tickets: { type: [String], required: true },
  money_balance: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);
