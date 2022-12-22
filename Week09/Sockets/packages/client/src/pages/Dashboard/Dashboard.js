import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, redirect } from 'react-router-dom';
import './Dashboard.css';
import OngoingChats from '../../components/OngoingChats/OngoingChats';
import useAuth from '../../hooks/useAuth';
import useDashboard from '../../hooks/useDashboard';
import { io } from 'socket.io-client';


const Dashboard = () => {
  const { state: { chatRooms, socket, loading }, loadDashboard, addChatRoom, setSocket } = useDashboard()
  const { auth: { isAuthenticated, uid } } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard()
    } else if (isAuthenticated === false) {
      redirect('/signin')
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!socket && isAuthenticated) {

      loadDashboard()

      let newSocket = io('http://localhost:8080')

      newSocket.on("connected", () => {
        newSocket.emit("handshake", uid)
      })

      newSocket.on("chatCreated", (room) => {
        addChatRoom(room)
      })

      setSocket(newSocket)
    }
  }, [isAuthenticated])

  return (
    <Container className="dashboard">
      <OngoingChats />
      {
        loading ?
          <p>Loading...</p>
          :
          <Outlet />
      }
    </Container>
  )
}

export default Dashboard