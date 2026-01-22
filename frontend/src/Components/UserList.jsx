import React from 'react';


function UsersList({ users, selectUser, selectedUser }) {
return (
<div className="users-list">
{users.map((user) => (
<div
key={user._id}
className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
onClick={() => selectUser(user)}
>
{user.fullname}
</div>
))}
</div>
);
}


export default UsersList;