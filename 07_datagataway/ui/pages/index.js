
import {io } from 'socket.io-client'
import { useEffect } from 'react'
import { WoolletSocket } from '@/data/socket'
import { Env } from "env"

export default function Home() {

  useEffect(()=>{

    const socket = io(Env.AI, {path: '/comm/socket.io/', transports : ['socketio', 'flashsocket', 'websocket', 'polling' ] });

    socket.on('ready', (r)=>{
      console.log('Socket ready', r);
    })
    
    socket.emit('connects', 'Woollet');

  }, []);

  return (
    <>
    Welcome to CO<sub>2</sub> Evaluation System
    </>
  )
}
