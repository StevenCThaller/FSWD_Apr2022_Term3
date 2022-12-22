import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import useDashboard from '../../hooks/useDashboard';
import './OngoingChats.css';
import axios from '../../utils/axiosConfig';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const OngoingChats = () => {
  const [displaySearchedUsers, setDisplaySearchedUsers] = useState([])
  const [newChatUsername, setNewChatUsername] = useState("")
  const [collapsed, setCollapsed] = useState(false)
  const { state: { socket, chatRooms, loading } } = useDashboard()
  const { auth: { uid } } = useAuth()
  const navigate = useNavigate()

  const handleCreateChat = (id) => {
    socket.emit("createChatRoom", [id, uid])
  }

  const handleChange = (e) => {
    const uname = e.target.value
    setNewChatUsername(uname)

    if (uname) {
      axios.get(`/friends?username=${uname}`)
        .then(res => {
          console.log(res)
          setDisplaySearchedUsers(res)
        })
        .catch(err => console.log("Cannot search"))
    } else {
      setDisplaySearchedUsers([])
    }
  }

  return (
    <div className={`chatList ${collapsed ? 'collapsed' : 'expanded'}`}>
      {
        loading ?
          <p>Loading...</p>
          :
          chatRooms.map((room) => (
            <div className="roomPreview" key={room._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dashboard/chat/${room._id}`)}>
              {
                room.members
                  .filter((member) => member._id !== uid)
                  .filter((_, i) => i < 3)
                  .map((member) => member.username)
                  .join(', ')
              }
              {
                room.members.length > 3 ?
                  `and ${room.members.length - 3} more`
                  : ''
              }
            </div>
          ))
      }
      <div className="addChat">
        {
          displaySearchedUsers.map((user) => (
            <div key={user._id} className="d-flex justify-content-between">
              <span>{user.username}</span>
              <Button variant="info" onClick={() => handleCreateChat(user._id)}>Chat Now</Button>
            </div>
          ))
        }
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            autoComplete="off"
            placeholder="username"
            name="newChatUsername"
            value={newChatUsername}
            onChange={handleChange} />
        </Form.Group>
      </div>
    </div>
  )
}

export default OngoingChats