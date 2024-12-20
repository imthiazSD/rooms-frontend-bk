import "./RoomList.css";

type RoomListProps = {
  rooms: { id: string; name: string }[];
  onJoinRoom: (roomId: string) => void;
};

export default function RoomList({ rooms, onJoinRoom }: RoomListProps) {
  return (
    <ul className="room-list">
      {rooms.map((room) => (
        <li key={room.id}>
          <span>{room.name}</span>
          <button onClick={() => onJoinRoom(room.id)}>Join</button>
        </li>
      ))}
    </ul>
  );
}
