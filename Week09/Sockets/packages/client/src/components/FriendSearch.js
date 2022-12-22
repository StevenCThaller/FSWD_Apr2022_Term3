import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import axios from '../utils/axiosConfig'
import { Button, Card, Container, Form, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

const FriendSearch = ({ friends }) => {
  const [users, setUsers] = useState([])
  const [usernameSearch, setUsernameSearch] = useState("")
  const { auth: { uid } } = useAuth()

  const handleChange = (e) => {
    const uname = e.target.value
    setUsernameSearch(uname)

    if (uname) {
      axios.get(`/users?username=${uname}`)
        .then(res => setUsers(res))
        .catch(err => toast.error("Cannot search"))
    } else {
      setUsers([])
    }
  }

  const sendFriendRequest = (id) => {
    const socket = io('http://localhost:8080')

    socket.emit('addFriend', { from: uid, to: id })

    socket.disconnect()
  }

  return (
    <Container>
      <Row>
        <Form.Group xs={12} className="mb-2">
          <Form.Label>Search for a User</Form.Label>
          <Form.Control
            type="text"
            autoComplete="off"
            name="username"
            value={usernameSearch}
            onChange={handleChange} />
        </Form.Group>
      </Row>
      <Container>
        {
          users.map((user) => (
            <Row key={user._id}>
              <Card className="w-100">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <h4>{user.username}</h4>
                  <span>4 mutual friends</span>
                  <Button onClick={() => sendFriendRequest(user._id)}>Add</Button>
                </Card.Body>
              </Card>
            </Row>
          ))
        }
      </Container>
    </Container>
  )
}

export default FriendSearch