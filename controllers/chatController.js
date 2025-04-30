const mongoose = require('mongoose');
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;

    try {
        const message = new Message({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

exports.getMessages = async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    try {
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort('timestamp');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

exports.getAllChats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const threads = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", userId] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$receiver", userId] },
                                        { $eq: ["$read", false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            // Lookup sender details
            {
                $lookup: {
                    from: "users",
                    localField: "lastMessage.sender",
                    foreignField: "_id",
                    as: "senderDetails"
                }
            },
            {
                $unwind: "$senderDetails"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lastMessage.receiver",
                    foreignField: "_id",
                    as: "receiverDetails"
                }
            },
            {
                $unwind: "$receiverDetails"
            },
            {
                $project: {
                    _id: 1,
                    unreadCount: 1,
                    lastMessage: {
                        _id: "$lastMessage._id",
                        content: "$lastMessage.content",
                        timestamp: "$lastMessage.timestamp",
                        sender: "$senderDetails",
                        receiver: "$receiverDetails"
                    }
                }
            }
        ]);

        res.json(threads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch chat threads' });
    }
};
