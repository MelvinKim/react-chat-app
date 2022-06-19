import React, {useEffect, useState} from 'react';
import { Avatar, useChatChannel, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';

const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            { children }
        </div>
    )
} 

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        if(selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id) )
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }

        setSelected((prevSelected) => !prevSelected)
    }

    return (
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">{user.fullName || user.id }</p>
            </div>
            { selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    )
}

const UserList = ({ setSelectedUsers }) => {

    //get chat instance
    const { client } = useChatContext();

    // get all users
    const [users, setUsers] = useState([]);

    //set loading
    const [loading, setLoading] = useState(false);

    const [listEmpty, setListEmpty] = useState(false);

    const [error, setError] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            if(loading) return;

            setLoading(true);

            try {
                const response = await client.queryUsers(
                    { id :{ $ne: client.UserID } },
                    { id: 1},
                    { limit: 8}
                );

                if(response.users.length) {
                    setUsers(response.users)
                    console.log("printing the users from stream chat api...");
                    console.log(response.users)
                } else {
                    setListEmpty(true);
                    console.log("no users from stream chat api... check internet connection");
                    console.log(response.users)
                }
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        }

        // if there's a connection, retrieve the users
        if(client) getUsers();

    }, [])

    // check if an error exists
    if(error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    Error loading, please refresh and try again....
                </div>
            </ListContainer>
        )
    }

    if(listEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    No users found...
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            { loading ? <div className="user-list__message">
                loading users ....
            </div>: (
                users?.map((user, i) => (
                    <UserItem index={i} key={user.id} user={user}  setSelectedUsers={setSelectedUsers}/>
                ))
            )}
        </ListContainer>
    )
}


export default UserList;