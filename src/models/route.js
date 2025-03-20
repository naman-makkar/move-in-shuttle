// src/models/Route.js
import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const RouteSchema = new Schema({
  routeId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  routeName: {
    type: String,
    required: true
  },
  stops: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default models.Route || model("Route", RouteSchema);
