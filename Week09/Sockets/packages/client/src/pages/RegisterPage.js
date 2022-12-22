import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const initialState = {
  username: '',
  password: '',
  confirmPassword: '',
  rememberMe: false
}
const RegisterPage = () => {
  const [data, setData] = useState(initialState)
  const { signUp } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    signUp(data)
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
      <h1>Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            autoComplete="off"
            name="username"
            value={data.username}
            onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            autoComplete="off"
            name="password"
            value={data.password}
            onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            autoComplete="off"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange} />
        </Form.Group>
        <Button type="submit" variant="primary">Sign Up</Button>
        <Form.Group className="mb-2">
          <Form.Check
            label="Remember me"
            name="rememberMe"
            checked={data.rememberMe}
            onChange={handleCheck} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Text>Already have an account? <Link to="/signin">Sign in.</Link></Form.Text>
        </Form.Group>
      </Form>
    </Container>
  )
}

export default RegisterPage