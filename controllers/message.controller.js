import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try
    {
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
            }
        });

        if(! conversation) //when having conversation for the first time, we will make a new conversation
        {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        if(newMessage)
        {
            conversation.messages.push(newMessage._id);
        }

        
        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(), newMessage.save()]); //with this line, above 2 code lines will run in parallel
        
        //socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId)
        {
            //io.to() is used to send data to a specific client 
            io.to(receiverSocketId).emit("getMessage", newMessage);
        }


        res.status(200).json({newMessage});
    }
    catch(error)
    {
        console.log("Error while sending message is ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMessages = async (req, res) => {
    try
    {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, userToChatId],
            }
        }).populate("messages"); //it will populate the messages array in conversationrather than giving only the message id

        if(! conversation)
        {
            return res.status(200).json([]);
        }
        const messages = conversation.messages;

        res.status(200).json(messages);
    }
    catch(error)
    {
        console.log("Error while getting message is ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}