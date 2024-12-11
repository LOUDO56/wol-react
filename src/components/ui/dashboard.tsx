import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react"
import ButtonAction from "../button-action"
import { MdElectricBolt, MdNightlightRound } from "react-icons/md"
import { toast, Toaster } from "sonner"
import { useState } from "react"
import { IoMdPower } from "react-icons/io"
import { DEFAULT_API_LINK } from "../../route"
import Cookies from 'js-cookie';
import PcAlive from "./pc-alive"

const Dashboard = () => {

  const [loadingPowerOn, setLoadingPowerOn] = useState(false);
  const [loadingPowerOff, setLoadingPowerOff] = useState(false);
  const [loadingHibernate, setLoadingHibernate] = useState(false);

  const action = async (loading: Function, type: "wake-up" | "shutdown" | "hibernate") => {
    loading(true)
    try {
      const platform = type === 'wake-up' ? 'raspb' : 'pc';
      const result = await fetch(DEFAULT_API_LINK + '/' + platform + '/action', {
        method: 'POST',
        body: JSON.stringify({ action: type }),
        headers: {
          'authorization': 'Bearer ' + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      })
      if(!result.ok) {
        const data = await result.json();
        toast.error('Your pc could not ' + type + ': ' + data.error)
      } else {
        switch (type) {
          case "wake-up":
            toast.success("Your pc is being power on...")
            break;
          case "shutdown":
            toast.success("Your pc is shutting down...")
            break;
          case "hibernate":
            toast.success("Your pc is hibernating...")
            break;
        }
      }
    } catch (error) {
      toast.error('Error while sending the request: ' + error)
    } finally {
      loading(false)
    }
  }



  return (
    <>
      <Toaster richColors position="top-center" />
      <Card>
        <CardHeader className="py-5 text-lg font-bold flex justify-center">
          Dashboard 
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-3 py-5">
          <ButtonAction 
            Icon={MdElectricBolt} 
            label="Waking up" 
            color="success" 
            onClick={() => action(setLoadingPowerOn, 'wake-up')} 
            loading={loadingPowerOn} 
          />
          <ButtonAction 
            Icon={IoMdPower} 
            label="Shuting down" 
            color="danger" 
            onClick={() => action(setLoadingPowerOff, 'shutdown')} 
            loading={loadingPowerOff} 
          />
          <ButtonAction
            Icon={MdNightlightRound} 
            label="Hibernate" 
            color="warning"
            onClick={() => action(setLoadingHibernate, 'hibernate')} 
            loading={loadingHibernate} 
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex gap-2 items-center justify-center py-4 px-5">
          <PcAlive />
        </CardFooter>
      </Card>
    </>
  )
}

export default Dashboard