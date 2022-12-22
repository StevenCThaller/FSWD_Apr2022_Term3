import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const initialState = {
  username: '',
  password: '',
  rememberMe: false
}

const LoginPage = () => {
  const [data, setData] = useState(initialState)
  const { signIn } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    signIn(data)
  }

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleCheck = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.checked
    })
  }

  return (
    <Container>
      <h1>Log In</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={data.username}
            onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Button type="submit" variant="primary">Sign In</Button>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Check
            label="Remember me"
            name="rememberMe"
            checked={data.rememberMe}
            onChange={handleCheck} />
          <Form.Text>Don't have an account? <Link to="/signup">Create an account.</Link></Form.Text>
        </Form.Group>
      </Form>

    </Container>
  )
}

export default LoginPage