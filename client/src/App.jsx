import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

//importing the necessary components
import { ChannelContainer, ChannelListContainer, Auth } from './components';

//import the css styles
import 'stream-chat-react/dist/css/index.css';
import './App.css';

const cookies = new Cookies();

//setup the apiKey
const apiKey = 'jvetwzp4fvmf';
//token to indicate whethet one is logged in or not
const authToken = cookies.get("token");

//create an instance of stream chat
const client = StreamChat.getInstance(apiKey);

//if we have an auth token we want to create a user
if(authToken) {
  client.connectUser({ 
      id: cookies.get('userId'),
      name: cookies.get('username'),
      fullName: cookies.get('fullName'),
      image: cookies.get('avatarUrl'),
      hashedPassword: cookies.get('hashedPassword'),
      phoneNumber: cookies.get('phoneNumber')
   }, authToken);
}

const App = () => {

  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if(!authToken) return <Auth />

  return (
    <div className="app__wrapper">
        <Chat client={client} theme="team light">
          <ChannelListContainer 
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
          />
          <ChannelContainer
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              createType={createType}
           />
        </Chat>
    </div>
  )
}

export default App