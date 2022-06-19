import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import  UserList   from './UserList';
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

const EditChannel = ({ setIsEditing }) => {

  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const updateChannel = async (event) => {
      event.preventDefault();

      const nameChanged = channelName !== ( channel.update.name || channel.data.id );
      
      if(nameChanged) {
        await channel.update({ name: channelName}, { text: `Channel name changed to ${channelName}`});
      }

      if(selectedUsers.length) {
        await channel.addMembers(selectedUsers);
      }

      setChannelName(null);
      setIsEditing(false);
      selectedUsers([]);
  }

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
          <p>Edit channel</p>
          <CloseCreateChannel  setIsEditing={setIsEditing}/>
      </div>
      <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>
      <UserList setSelectedUsers={setSelectedUsers}/>
      <div className="edit-channel__button-wrapper" onClick={updateChannel}>
          <p>save changes</p>
      </div>
    </div>
  )
}

export default EditChannel 