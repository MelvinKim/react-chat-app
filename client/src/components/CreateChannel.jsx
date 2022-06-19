import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

//create a channel name input
const ChannelNameInput = ({ channelName = "", setChannelName }) => {
      const { client, setActiveChannel } = useChatContext();
      const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

      const handleChange = (event) => {
        event.preventDefault();  //prevernt browser reload

        setChannelName(event.target.value);
      };
 
    return (
      <div className="channel-name-input__wrapper">
          <p>Name</p>
          <input value={channelName} onChange={handleChange} placeholder="channel-name (no spaces)" />
          <p>Add Members</p>
      </div>
    );
}

const CreateChannel = ({ createType, setIsCreating }) => {

  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
  const [channelName, setChannelName] = useState('');

  const createChannel = async (e) => {
      e.preventDefault();

      try {
        const newChannel = await client.channel(createType, channelName, {
          name: channelName, 
          members: selectedUsers
        });

        await newChannel.watch();

        setChannelName("");
        setIsCreating(false);
        setSelectedUsers([client.userID])
        // switch to the newly created channel
        setActiveChannel(newChannel);
      } catch (error) {
        console.log(error);
      }
  }

  return (
    <div className="create-channel__container">
        <div className="create-channel__header">
              <p> { createType === "team" ? "Create a new Channel" : "Send a direct message" } </p>
              <CloseCreateChannel setIsCreating={setIsCreating}/>
        </div>
          { createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} /> }
          <UserList setSelectedUsers={setSelectedUsers}/>

          {/* create a button to enable creation of a channel */}
          <div className="create-channel__button-wrapper" onClick={createChannel}>
              <p>{createType === 'team' ? 'create channel' : 'create message group'}</p>
          </div>
    </div>
  )
}

export default CreateChannel