import { Button, Form, Input } from '@nextui-org/react'
import { FormEvent, useState } from 'react'
import { DEFAULT_API_LINK } from '../../route';

const LoginForm = () => {

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    
    if(!data.password) {
      setErrors({ password: "Password is required." })
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch(DEFAULT_API_LINK + '/login', {
        method: "POST",
        body: JSON.stringify({ password: data.password }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      const result = await res.json();
      if(result.error) {
        setErrors({ password: result.error })
      }

      if(res.ok){
        window.location.reload();
      }


    } catch (error) {
      setErrors({ password: error })
    } finally {
      setLoading(false);
    }

  }

  return (
    <Form 
      className='flex flex-col justify-center items-center gap-4 px-5 py-2'
      validationErrors={errors}
      onSubmit={onSubmit}
    >
        <span className='text-xl font-bold'>Welcome, please login.</span>
        <Input
          isRequired
          placeholder='Please enter a password'
          name='password'
          type='password'
        />
        <Button type='submit' color='primary' isLoading={loading}>Submit</Button>
    </Form>
  )
}

export default LoginForm