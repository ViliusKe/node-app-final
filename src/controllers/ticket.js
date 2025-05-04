import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import ticketModel from "../models/ticket.js";
import userModel from "../models/user.js";

const ADD_TICKET = async (req, res) => {
  try {
    const ticket = new ticketModel({
      id: uuidv4(),
      name: req.body.name,
      price: req.body.price,
    });

    const response = await ticket.save();

    return res.status(200).json({
      message: "Ticket added successfully",
      response: response,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

const BUY_TICKET = async (req, res) => {
  try {
    const user = await userModel.findOne({ id: req.body.user_id });
    const ticket = await ticketModel.findOne({ id: req.body.ticket_id });

    if (!user || !ticket) {
      return res.status(404).json({ message: "User or ticket not found" });
    }
    if (user.money_balance < ticket.price) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    user.money_balance -= ticket.price;
    user.bought_tickets.push(ticket.id);
    await user.save();

    return res.status(200).json({
      message: `Ticket "${ticket.name}" bought successfully`,
      new_balance: user.money_balance,
      bought_tickets: user.bought_tickets,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

export { ADD_TICKET, BUY_TICKET };
