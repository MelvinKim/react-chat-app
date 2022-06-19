const express = require('express');
const cors = require('cors');

//routes
const authRoutes = require("./routes/auth.js");

//create an instance of the express application
const app = express();
const PORT = process.env.PORT || 5000;

//enables us to call the environment variables inside our node application
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());  //allows passing of json payloads from the frontend to the backend
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.send("Hello, world!"); 
});

//use the routes
app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;
    if(type === 'message.new') {
        members
            .filter((member) => member.user_id != sender.id)
            .forEach(({ user }) => {
                if(!user.omline) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                    .then(() => {
                        console.log('Message sent successfuly')
                    })
                    .catch((error) => {
                        console.log(error);
                })
                }
                return res.status(200).send('Message sent!');
            })
    }

    return res.status(200).send('Not a new message request!');
});
app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





