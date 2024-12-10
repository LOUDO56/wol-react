import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react"
import ButtonAction from "./components/button-action"
import { MdElectricBolt, MdNightlightRound } from "react-icons/md"
import { FaPowerOff } from "react-icons/fa"
import { toast, Toaster } from "sonner"
import { useState } from "react"

function App() {

  const [pcAlive, isPcAlive] = useState(false);
  const [loadingPowerOn, setLoadingPowerOn] = useState(false);
  const [loadingPowerOff, setLoadingPowerOff] = useState(false);
  const [loadingHibernate, setLoadingHibernate] = useState(false);

  const powerOn = () => {
    setLoadingPowerOn(true)
    toast.success("Your pc is being power on...")
    setTimeout(() => {
      setLoadingPowerOn(false)
    }, 1000);
  }

  const powerOff = () => {
    setLoadingPowerOff(true)
    toast.success("Your pc is is being shutdown...")
    setTimeout(() => {
      setLoadingPowerOff(false)
    }, 1000);
  }

  const powerHibernate = () => {
    setLoadingHibernate(true)
    toast.success("Your pc is going to sleep...")
    setTimeout(() => {
      setLoadingHibernate(false)
    }, 1000);
  }


  return (
    <>
      <Toaster richColors position="top-center" />
      <Card>
        <CardHeader  className="py-5 text-lg font-bold flex justify-center">
          Dashboard 
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-3 py-5">
          <ButtonAction 
            Icon={MdElectricBolt} 
            label="Waking up" 
            color="success" 
            onClick={powerOn} 
            loading={loadingPowerOn} 
          />
          <ButtonAction 
            Icon={FaPowerOff} 
            label="Shuting down" 
            color="danger" 
            onClick={powerOff} 
            loading={loadingPowerOff} 
          />
          <ButtonAction
            Icon={MdNightlightRound} 
            label="Hibernate" 
            color="warning"
            onClick={powerHibernate} 
            loading={loadingHibernate} 
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex gap-2 items-center justify-center py-4 px-5">
          <p>Current state of your pc : </p>
          <span className={`w-4 h-4 ${pcAlive ? 'bg-green-400' : 'bg-red-400'} rounded-full`}></span> 
        </CardFooter>
      </Card>
    </>
  )
}

export default App
