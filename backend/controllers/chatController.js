const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const createError = require("../utils/createError");

async function ensureConversationForUser(userId) {
  const adminUser = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });

  if (!adminUser) {
    throw createError(404, "No admin account is available for chat");
  }

  const conversation = await Conversation.findOneAndUpdate(
    {
      customer: userId,
      admin: adminUser._id
    },
    {
      $setOnInsert: {
        customer: userId,
        admin: adminUser._id
      }
    },
    {
      new: true,
      upsert: true
    }
  )
    .populate("customer", "fullName email phone role")
    .populate("admin", "fullName email phone role")
    .populate("lastSender", "fullName role");

  return conversation;
}

function canAccessConversation(conversation, userId, role) {
  if (role === "admin") {
    return conversation.admin && String(conversation.admin._id || conversation.admin) === String(userId);
  }

  return conversation.customer && String(conversation.customer._id || conversation.customer) === String(userId);
}

async function getConversations(req, res, next) {
  try {
    let conversations = [];

    if (req.user.role === "admin") {
      const enabledUsers = await User.find({
        role: "user",
        chatEnabled: true
      }).select("_id");

      if (enabledUsers.length > 0) {
        await Conversation.bulkWrite(
          enabledUsers.map((enabledUser) => ({
            updateOne: {
              filter: {
                customer: enabledUser._id,
                admin: req.user._id
              },
              update: {
                $setOnInsert: {
                  customer: enabledUser._id,
                  admin: req.user._id
                }
              },
              upsert: true
            }
          }))
        );
      }

      conversations = await Conversation.find({ admin: req.user._id })
        .populate("customer", "fullName email phone role")
        .populate("admin", "fullName email phone role")
        .populate("lastSender", "fullName role")
        .sort({ lastMessageAt: -1, updatedAt: -1 });
    } else {
      if (!req.user.chatEnabled) {
        return res.json({
          success: true,
          data: []
        });
      }

      const conversation = await ensureConversationForUser(req.user._id);
      conversations = [conversation];
    }

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    if (req.user.role !== "admin" && !req.user.chatEnabled) {
      throw createError(403, "Chat is disabled for this account");
    }

    const conversation = await Conversation.findById(req.params.id)
      .populate("customer", "fullName email phone role")
      .populate("admin", "fullName email phone role");

    if (!conversation) {
      throw createError(404, "Conversation not found");
    }

    if (!canAccessConversation(conversation, req.user._id, req.user.role)) {
      throw createError(403, "You do not have access to this conversation");
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate("sender", "fullName role")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
}

async function createMessage(req, res, next) {
  try {
    if (req.user.role !== "admin" && !req.user.chatEnabled) {
      throw createError(403, "Chat is disabled for this account");
    }

    const { text } = req.body;

    if (!text || !text.trim()) {
      throw createError(400, "Message text is required");
    }

    const conversation = await Conversation.findById(req.params.id)
      .populate("customer", "fullName email phone role")
      .populate("admin", "fullName email phone role");

    if (!conversation) {
      throw createError(404, "Conversation not found");
    }

    if (!canAccessConversation(conversation, req.user._id, req.user.role)) {
      throw createError(403, "You do not have access to this conversation");
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim()
    });

    conversation.lastMessage = message.text;
    conversation.lastSender = req.user._id;
    conversation.lastMessageAt = message.createdAt;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate("sender", "fullName role");

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConversations,
  getMessages,
  createMessage
};
