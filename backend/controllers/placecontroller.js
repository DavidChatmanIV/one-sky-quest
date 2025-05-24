const getPlaces = async (req, res) => {
try {
    const samplePlaces = [
    { name: "Paris", country: "France" },
    { name: "Tokyo", country: "Japan" },
    { name: "Rio", country: "Brazil" },
    ];

    res.json({ success: true, data: samplePlaces });
} catch (err) {
    console.error("Error fetching places:", err);
    res.status(500).json({ success: false, message: "Server error" });
}
};

module.exports = { getPlaces };
