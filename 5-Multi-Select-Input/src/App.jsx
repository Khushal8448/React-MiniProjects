import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersSet, setSelectedUsersSet] = useState(new Set());

  const inputRef = useRef(null);

  // fetch('http://dummyjson.com/users/search?q=John')

  useEffect(() => {
    const fetchUsers = () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }
      fetch(`http://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => console.error(err));
    };

    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUsersSet(new Set([...selectedUsersSet, user.email]));
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter(
      (selUser) => selUser.id !== user.id
    );
    setSelectedUsers(updatedUsers);

    const updatedEmails = new Set(selectedUsersSet);
    updatedEmails.delete(user.email);
    setSelectedUsersSet(updatedEmails);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* Pills */}
        {selectedUsers.map((user) => (
          <Pill
            image={user.image}
            key={user.email}
            text={`${user.firstName} ${user.lastName}`}
            onClick={() => handleRemoveUser(user)}
          />
        ))}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search For a User..."
            onKeyDown={handleKeyDown}
          />
          {/* Search Suggestions */}

          {suggestions.length !== 0 && (
            <ul className="suggestions-list">
              {suggestions?.users?.map((user, index) => {
                return (
                  !selectedUsersSet.has(user.email) && (
                    <li key={user.email} onClick={() => handleSelectUser(user)}>
                      <img
                        src={user.image}
                        alt={user.firstName + " " + user.lastName}
                      />
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </li>
                  )
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
