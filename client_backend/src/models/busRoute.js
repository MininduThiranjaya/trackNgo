const mongoose = require('mongoose');

// const routeSchema = new mongoose.Schema({
//     source: String,
//     destination: String,
//     stops:[String],
//     busName:[String],
//     lastUpdated: { type: Date, default: Date.now },
// });

const routeSchema = new mongoose.Schema({
    source: String,
    destination: String,
    stops: [String],
    busName: [
        {
            name: String,
            action: { type: String, default: 'non' }
        }
    ],
    lastUpdated: { type: Date, default: Date.now },
});

const Route = mongoose.model('route', routeSchema);

module.exports = Route;



// [
//     {
//         "$match": {
//             "source": "polonnaruwa",
//             "destination": "kurunegala"
//         }
//     },
//     {
//         "$unwind": "$busName"                  // Unwind busName array to access each bus's details
//     },
//     {
//         "$lookup": {
//             "from": "buses",
//             "localField": "busName.name",       // Match busName name to busNameId in buses collection
//             "foreignField": "busNameId",
//             "as": "details"
//         }
//     },
//     {
//         "$unwind": "$details"                  // Unwind details array to pair with each bus
//     },
//     {
//         "$group": {
//             "_id": {
//                 "_id": "$_id",
//                 "source": "$source",
//                 "stops": "$stops",
//                 "destination": "$destination"
//             },
//             "busInfo": {
//                 "$push": {                     // Aggregate each bus's info including name, action, and isActive
//                     "busNameId": "$details.busNameId",
//                     "isActive": "$details.isActive",
//                     "action": "$busName.action"
//                 }
//             }
//         }
//     },
//     {
//         "$project": {
//             "_id": "$_id._id",
//             "source": "$_id.source",
//             "stops": "$_id.stops",
//             "destination": "$_id.destination",
//             "busInfo": 1                       // Include the aggregated busInfo array with name, action, and isActive
//         }
//     }
// ]
