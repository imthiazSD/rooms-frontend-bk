import "./UserList.css";

type UserListProps = {
  users: { id: string; username: string; status: string }[];
  onPing: (userId: string) => void;
};

export default function UserList({ users, onPing }: UserListProps) {
  return (
    <ul>
      {users.map(({ id, username, status }) => (
        <li key={id}>
          <span>
            {username} <span className={`status ${status}`}>{status}</span>
          </span>
          <button onClick={() => onPing(id)}>Ping</button>
        </li>
      ))}
    </ul>
  );
}
