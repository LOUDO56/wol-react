import { useEffect, useState } from 'react'
import { DEFAULT_API_LINK } from '../../route';
import Cookies from 'js-cookie';
import { FaQuestion } from 'react-icons/fa';

const PcAlive = () => {

  const [pcAlive, isPcAlive] = useState(false);
  const [serverUp, isServerUp] = useState(false);

  async function checkPcAlive() {
    try {
      const result = await fetch(DEFAULT_API_LINK + '/is-alive', {
        headers: {
          'authorization': 'Bearer ' + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      })
      const data = await result.json();
      isPcAlive(data.online)
      isServerUp(true);
    } catch (error) {
      console.log("Error while trying to ping pc: ", error)
      isServerUp(false);
    }
  }

  useEffect(() => {
    const checkPcAliveInterval = setInterval(() => {
      checkPcAlive();
    }, 2000);
    return () => clearInterval(checkPcAliveInterval);
  }, [])

  return (
    <>
      <p>Current state of your pc :</p>
      { serverUp ? <span className={`w-4 h-4 ${pcAlive ? 'bg-green-400' : 'bg-red-400'} rounded-full`}></span> : <FaQuestion /> }
    </>
  )
}

export default PcAlive