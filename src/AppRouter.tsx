import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useAuth } from "./contexts/AuthContext";

const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  console.log("is auth", isAuthenticated());
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const ProtectedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
    </Routes>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/*"
          element={<PrivateRoute element={<ProtectedApp />} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
