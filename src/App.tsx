import { useEffect, useState } from "react"
import Dashboard from "./components/ui/dashboard"
import LoginForm from "./components/ui/login-form"
import Cookies from "js-cookie";

function App() {

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if(!token) setIsConnected(false);
      else setIsConnected(true);
    };
    checkAuth();
  }, [])


  return (
    <>
      { isConnected ? <Dashboard /> : <LoginForm /> }
    </>
  )
}

export default App
