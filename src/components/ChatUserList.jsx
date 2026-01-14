import React from "react";

export default function ChatUserList({ users = [], onSelectUser, selectedUser }) {
  return (
    <div>
      {users.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No users found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={`cursor-pointer px-4 py-3 border-b hover:bg-blue-50 transition ${
              selectedUser?._id === user._id ? "bg-blue-100" : ""
            }`}
          >
            <p className="font-medium text-gray-700">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        ))
      )}
    </div>
  );
}
