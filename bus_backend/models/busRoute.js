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