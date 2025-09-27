// GET /dm/mine?userId=:id
// Returns the user's conversations sorted by updatedAt desc,
// with a lastMessage preview and the "other" participant id.
router.get("/mine", async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    // Find convos where user participates
    const convos = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .select("_id participants isGroup title lastMessage updatedAt")
      .lean();

    // Get latest message for each convo in one shot
    const convoIds = convos.map((c) => c._id);
    const latestByConvo = await Message.aggregate([
      { $match: { conversationId: { $in: convoIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          messageId: { $first: "$_id" },
          text: { $first: "$text" },
          sender: { $first: "$sender" },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    const latestMap = new Map(latestByConvo.map((m) => [String(m._id), m]));

    // Shape response: include partnerId for 1:1 convos
    const data = convos.map((c) => {
      const latest = latestMap.get(String(c._id)) || null;
      const partnerId = !c.isGroup
        ? c.participants.find((p) => String(p) !== String(userId))
        : null;

      return {
        ...c,
        partnerId,
        last: latest && {
          _id: latest.messageId,
          text: latest.text,
          sender: latest.sender,
          createdAt: latest.createdAt,
        },
      };
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
});
