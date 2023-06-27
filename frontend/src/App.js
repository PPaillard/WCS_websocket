import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [messageList, setMessageList] = useState([]);
  /**
   * Structure d'un message
   * {
   *     author: "nickname",
   *     text: "message"
   *     id: currentUser
   * }
   */
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [socket, setSocket] = useState(null); // Passage en useRef
  const currentUser = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    //!TO DO: submit message to server
    socket.emit("sendMessage", {
      author: nickName,
      text: newMessageText,
      id: currentUser.current,
    });
  };

  const ENDPOINT = "http://localhost:5050";
  // OnMount
  useEffect(() => {
    const socket = io(ENDPOINT);

    setSocket(socket);

    // https://socket.io/docs/v4/client-socket-instance/#connect
    // Cet événement est déclenché par l'instance Socket lors de la connexion et de la reconnexion.
    socket.on("connect", () => {
      currentUser.current = socket.id;
    });

    socket.on("newMessage", (message) => {
      setMessageList((oldMessageList) => [...oldMessageList, message]);
    });

    return () => {
      socket.emit("disconnectUser", socket.id);
      socket.off();
    };
  }, []);

  return (
    <div className="App">
      <h2>Messages</h2>
      {messageList.map((message, id) => {
        return (
          <p
            key={id}
            className={
              message.id === currentUser.current ? "my-message" : "message"
            }
          >
            <strong>{message.author}</strong>: {message.text}
          </p>
        );
      })}
      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input
          type="text"
          name="author"
          placeholder="nickname"
          value={nickName}
          required
          onChange={(e) => setNickName(e.target.value)}
        />
        <input
          type="text"
          name="messageContent"
          placeholder="message"
          value={newMessageText}
          required
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}

export default App;
