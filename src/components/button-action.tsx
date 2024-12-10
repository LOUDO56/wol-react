import { Button } from '@nextui-org/button'
import { MouseEventHandler } from 'react'
import { IconType } from 'react-icons'

interface ButtonActionProps {
    Icon: IconType,
    label: string,
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    loading: boolean
}

const ButtonAction = ({
    Icon, 
    label,
    color,
    onClick,
    loading
}: ButtonActionProps) => {
  return (
    <Button 
      radius='sm'
      color={color}
      className='flex gap-2 items-center'
      onClick={onClick}
      isDisabled={loading}
    >
      <Icon size={14} />
      <p>{label}</p>
    </Button>
  )
}

export default ButtonAction