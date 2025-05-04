import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
});

export default mongoose.model("ticket", ticketSchema);
