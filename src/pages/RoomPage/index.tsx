import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  joinRoom,
  onReceievePing,
  onUserJoined,
  onUserLeft,
  pingUser,
} from "../../services/socket";
import "./RoomPage.css";
import UserList from "../../components/UserList";

type User = {
  id: string;
  username: string;
  status: string;
};

const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [focusMode, setFocus] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const fetchUsers = useCallback(
    async function () {
      try {
        if (roomId) {
          const res = await api.getUsersInRoom(roomId);
          setUsers(res);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [roomId]
  );

  async function handleJoinRoom(userId: string, roomId: string) {
    try {
      await api.joinRoom(roomId);
      joinRoom(userId, roomId);
    } catch (err) {
      console.log(err);
      console.log(err);
    }
  }

  async function handleLeaveRoom(roomId: string) {
    try {
      await api.leaveRoom(roomId);
    } catch (err) {
      console.log(err);
    }
  }

  async function getRoomDetails(roomId: string) {
    try {
      const room = await api.getRoomById(roomId);
      setName(room.name);
    } catch (err) {
      console.log(err);
    }
  }

  async function getFocusMode(roomId: string) {
    try {
      const { focusMode } = await api.getFocusMode(roomId);
      setFocus(focusMode);
    } catch (err) {
      console.log(err);
    }
  }

  const handlePing = async (userId: string) => {
    const senderId = localStorage.getItem("userId");
    if (senderId && roomId) {
      try {
        pingUser(senderId, userId, roomId);
        await api.sendPing(senderId, roomId);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const toggleFocusMode = async () => {
    if (!roomId) return;
    try {
      await api.setFocusMode(roomId, !focusMode);
      setFocus(!focusMode);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Effects
   */

  useEffect(() => {
    onUserJoined((data) => {
      fetchUsers();
    });
    onUserLeft((data) => {
      fetchUsers();
    });

    onReceievePing(({ from }) => {
      toast(`${from.username} is pinging you!`, {
        theme: "dark",
      });
    });
  }, [fetchUsers]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!roomId || !userId) return;

    handleJoinRoom(userId, roomId);
    getRoomDetails(roomId);
    getFocusMode(roomId);
    fetchUsers();

    return () => {
      handleLeaveRoom(roomId);
    };
  }, [fetchUsers, roomId]);

  const handleLeaveClick = () => {
    navigate("/");
  };

  return (
    <div className="room-page">
      <header className="header">
        <h1>{name}</h1>
        <div>
          <button
            className={`action-btn  ${focusMode ? "enabled" : "disabled"}`}
            onClick={toggleFocusMode}
          >
            {focusMode ? "Disable Focus Mode" : "Enable Focus Mode"}
          </button>
          <button className={`action-btn`} onClick={handleLeaveClick}>
            Leave
          </button>
        </div>
      </header>
      <h2>Users</h2>
      <ul className="users-list">
        {users.length ? (
          <UserList users={users} onPing={handlePing} />
        ) : (
          <h1>Nobody is here</h1>
        )}
      </ul>
    </div>
  );
};

export default Room;
