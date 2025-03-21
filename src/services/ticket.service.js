import Ticket from "../models/tickets.model.js";
import { v4 as uuidv4 } from "uuid";

class TicketService {
  async createTicket(amount, purchaser) {
    try {
      const ticket = new Ticket({
        code: uuidv4(),
        amount,
        purchaser,
      });

      await ticket.save();
      return { success: true, ticket };
    } catch (error) {
      console.error("Error creado ticket:", error);
      return { success: false, error };
    }
  }
}

export default new TicketService();
