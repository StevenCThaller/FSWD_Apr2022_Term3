import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import axios from '../utils/axiosConfig';

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [chatRooms, setChatRooms] = useState([])
  const { auth } = useAuth()

  useEffect(() => {
    if (auth.isAuthenticated) {
      axios.get('/users')
        .then(res => {
          setUsers(res)
          setLoading(false)
        })
        .catch(err => console.log(err))
      axios.get('/chatrooms')
        .then(res => {
          setChatRooms(res)
          setLoading(false)
        })
        .catch(err => console.log(err))
    }
  }, [auth])
  return (
    <Container>

    </Container>
  )
}

export default Dashboard