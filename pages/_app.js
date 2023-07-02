import { useEffect, useState } from 'react';
import useFirebase from '../lib/useFirebase';
import '../styles/globals.css'
import { useRouter } from 'next/router';
import { NextUIProvider, createTheme } from '@nextui-org/react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  const { streamUser } = useFirebase()
  const navigate = useRouter();
  useEffect(() => {
    streamUser((user) => {
      if (user) {
        if (navigate.pathname === '/login')
          navigate.push('/')
      }
      else {
        navigate.push('/login')
      }
    })
  }, [])

  const darkTheme = createTheme({
    type: 'dark',
    theme: {
    }
  });


  const getLayout = Component.getLayout || ((page) => page)

  return (
    <NextUIProvider theme={darkTheme}>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer theme='dark'/>
    </NextUIProvider>)
}

export default MyApp
