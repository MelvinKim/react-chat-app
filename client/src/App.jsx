import React from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

//importing the necessary components
import { ChannelContainer, ChannelListContainer, Auth } from './components';

//import the css styles
import './App.css';

//setup the apiKey
const apiKey = 'jvetwzp4fvmf';

//create an instance of stream chat
const client = StreamChat.getInstance(apiKey);

//token to indicate whethet one is logged in or not
const authToken = false;

const App = () => {

  if(!authToken) return <Auth />

  return (
    <div className="app__wrapper">
        <Chat client={client} theme="team light">
          <ChannelListContainer 

          />
          <ChannelContainer />
        </Chat>
    </div>
  )
}

export default App