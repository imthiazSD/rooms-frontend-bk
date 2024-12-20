import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomList from "../../components/RoomList";
import { createRoom, fetchRooms as getRooms } from "../../services/api";
import { logout } from "../../services/socket";
import "./HomePage.css";

const HomePage = () => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const newRoom = await createRoom(newRoomName);
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      setNewRoomName("");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  const handleLogout = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    logout(userId);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="homepage">
      <header className="header">
        <h1>Roomly</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>{" "}
      <h2>All Rooms</h2>
      <div className="create-room">
        <input
          type="text"
          placeholder="Enter room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
    </div>
  );
};

export default HomePage;
