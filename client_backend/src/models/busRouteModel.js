const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },
    routeNumber: {
      type: String,
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    routeStops: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)


const BusRoute = mongoose.model('busroute', busRouteSchema);

module.exports = BusRoute;