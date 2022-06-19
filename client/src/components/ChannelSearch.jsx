import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';

import { SearchIcon } from '../assets';
import { ResultsDropdown } from './'

const ChannelSearch = ({ setToggleContainer }) => {

    const { client, setActiveChannel } = useChatContext();

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([]);
    const [directChannels, setDirectChannels] = useState([]);

    useEffect(() => {
        if(!query) {
            setTeamChannels([]);
            setDirectChannels([]);
        }
    }, [query]);

    const getChannels = async (text) => {
        try {
            //query channels
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text },
                members: { $in: [client.userID]}
            });  
            //query users
            const userResponse = client.queryUsers({
                //excludes current userID
                id: { $ne: client.userID},
                name: { $autocomplete: text }
            });  
            
            //get all the channels and users at the same time
            const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

            if(channels.length) setTeamChannels(channels);
            if(users.length) setDirectChannels(users);
            
        } catch (error) {
            //reset the search, set the query to be equal to an empty String
            setQuery('');
        }
    }

    const onSearch = (event) => {
        event.preventDefault();  //prevents reloading

        setLoading(true);
        setQuery(event.target.value);
        //get the chat channels
        getChannels(event.target.value);
    }

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    }

    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-search__input__icon">
                    <SearchIcon />
                </div>
                <input 
                    className="channel-search__input__text" 
                    placeholder="Search"
                    type="text"
                    value={query}
                    onChange={onSearch}
                    />
            </div>
            { query && (
                <ResultsDropdown
                teamChannels={teamChannels}
                directChannels={directChannels}
                loading={loading}
                setChannel={setChannel}
                setQuery={setQuery}
                setToggleContainer={setToggleContainer}
                 />
            )}
        </div>
    )
}

export default ChannelSearch