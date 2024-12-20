import AppRouter from "./AppRouter";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <ToastContainer />
    </>
  );
}
