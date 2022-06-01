const crypto = require('crypto');
const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;

require('dotenv').config();


//create environment variables for confidential values
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
    try {
        const { fullName, username, password, phoneNumber } = req.body;

        //create a random user ID for each user
        const userId = crypto.randomBytes(16).toString('hex');

        //make a connection to the Stream API
        const serverClient = connect(api_key, api_secret, app_id);

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a new user token for each connection
        const token = serverClient.createUserToken(userId);

        //return the data to the frontend
        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber});
 
    } catch (error) {
        console.log(error);

        res.status(500).json({ message : error});
    }
};

const login = async (req, res) => {
    try {
        
        const { username, password } = req.body;

        //make a connection to the Stream API
        const serverClient = connect(api_key, api_secret, app_id);

        //create a new instance of a stream chat  --> query all users from the database that match a specific username
        const client = StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ name: username });

        if(!users.length) return res.status(400).json({ message: "User not found"});

        //decrypt password, to see if it matches the one that the user created an account with
        const success = await bcrypt.compare(password, users[0].hashedPassword);

        //create a new user token, for the connection
        const token = serverClient.createUserToken(users[0].id);

        if(success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id });
        }
        else {
            res.status(500).json({ message: "Incorrect password" });
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({ message : error });
    }
};


module.exports = { signup, login } ;