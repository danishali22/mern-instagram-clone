import { Message } from "../models/message.js";
import { Conversation } from "../models/conversation.js";
import { User } from "../models/user.js";
import { ErrorHandler, success, TryCatch } from "../utils/features.js";

export const sendMessage = TryCatch(async (req, res, next) => {
  const senderId = req.user;
  const receiverId = req.params.id;
  const {message} = req.body;

  let conversation = await Conversation.findOne({participants: {$all : [senderId, receiverId]}});
  if(!conversation){
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message
  });

  if(newMessage) conversation.messages.push(newMessage._id);

  await Promise.all([newMessage.save(), conversation.save()]);

  return success(res, "Message sent", 200, newMessage);
});

export const getMessage = TryCatch(async (req, res, next) => {
  const senderId = req.user;
  const receiverId = req.params.id;

  const conversation = await Conversation.findOne({
    participants: {$all: [senderId, receiverId]}
  });
  const messages = conversation?.messages;

  return success(res, "Conversation fetched successfully", 200, messages);
});