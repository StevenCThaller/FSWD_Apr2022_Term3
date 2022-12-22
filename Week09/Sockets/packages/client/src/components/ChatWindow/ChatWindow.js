import React, { useEffect, useRef, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useDashboard from '../../hooks/useDashboard'
import './ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([])
  const [messageBody, setMessageBody] = useState("")
  const [userTyping, setUserTyping] = useState(null)
  const [timeSinceTypingReceived, setTimeSinceTypingReceived] = useState(5)
  const { roomId } = useParams()
  const { auth: { isAuthenticated, uid, username } } = useAuth()
  const { state: { socket } } = useDashboard()

  const messageEnd = useRef(null)

  useEffect(() => {
    if (socket && isAuthenticated) {
      socket.emit("getMessages", roomId)

      socket.on("messagesLoaded", (messages) => {
        setMessages(messages)

      })

      socket.on("otherUserTyping", (username) => {
        setTimeSinceTypingReceived(0)
        setUserTyping(username)
      })

      socket.on("receive message", (huh) => {
        setMessages([...messages, { from: huh.from, body: huh.body }])
      })

    }
  }, [roomId, isAuthenticated])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (timeSinceTypingReceived < 5) {
      setTimeout(() => setTimeSinceTypingReceived(time => time + 1), 1000)
    }
  }, [timeSinceTypingReceived])


  const sendMessage = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!messageBody) return

    socket.emit("send message", {
      body: messageBody,
      from: uid,
      roomId
    })

    setMessageBody("")
    setMessages([...messages, { from: uid, body: messageBody }])
  }

  const scrollToBottom = () => {
    messageEnd.current?.scrollIntoView()
  }

  const handleChange = (e) => {
    setMessageBody(e.target.value)
    socket.emit("typing", { who: username, roomId })
  }

  return (
    <Container className="chatWindow">
      {
        roomId &&
        <>
          <div className="chat-log">
            {
              messages.map((message) => {
                if (message.from === uid || message.from._id === uid) {
                  return (
                    <div className="message sent" key={message._id}>
                      <span className="bubble">{message.body}</span>
                    </div>
                  )
                } else {
                  return (
                    <div className="message received" key={message._id}>
                      <div className="d-flex flex-column">
                        <span className="bubble">{message.body}</span>
                        <span className="from">{message.from.username}</span>
                      </div>
                    </div>
                  )
                }
              })
            }
            <div ref={messageEnd}></div>
          </div>
          <Form onSubmit={sendMessage} className="sendmsg">
            {
              timeSinceTypingReceived < 5 ?
                <Form.Text>{userTyping} is typing...</Form.Text>
                : ""
            }
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Send a message"
                value={messageBody}
                onChange={handleChange} />
              <Button type="submit" variant="primary">Send</Button>
            </Form.Group>
          </Form>
        </>
      }
    </Container>
  )
}

export default ChatWindow