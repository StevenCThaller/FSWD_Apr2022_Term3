import { useContext, useReducer, createContext, useEffect } from 'react';
import axios, { setAuthToken } from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initialState = {
  isAuthenticated: null,
  uid: null,
  username: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        uid: action.payload.uid,
        username: action.payload.username
      }
    case "LOGOUT":
      return {
        ...initialState,
        isAuthenticated: false
      }
    default:
      return state;
  }
}

const authContext = createContext()

export const ProvideAuth = ({ children }) => {
  const [auth, dispatch] = useReducer(reducer, initialState)

  return (
    <authContext.Provider
      value={{
        auth,
        dispatch
      }}
    >
      {children}
    </authContext.Provider>
  )
}

const useAuth = () => {
  const { auth, dispatch } = useContext(authContext)
  const navigate = useNavigate()

  const signUp = async (data) => {
    axios.post('/auth/signup', data)
      .then(res => {
        toast.success(`Signed up successfully! Welcome, ${res.username}`)
        dispatch({
          type: "LOGIN",
          payload: res
        })
        if (data.rememberMe) {
          localStorage.setItem('loggedInUser', JSON.stringify(res))
        }
        navigate('/dashboard')
      })
      .catch(err => {
        toast.error("Please try again.")
      })
  }

  const signIn = async (data) => {
    axios.post('/auth/signin', data)
      .then(res => {
        toast.success(`Success! Welcome, ${res.username}`)
        dispatch({
          type: "LOGIN",
          payload: res
        })
        if (data.rememberMe) {
          localStorage.setItem('loggedInUser', JSON.stringify(res))
        }
        navigate('/dashboard')
      })
  }

  const signOut = (e) => {
    e.preventDefault()
    dispatch({
      type: "LOGOUT"
    })
    localStorage.removeItem('loggedInUser')
    navigate('/')
  }

  useEffect(() => {
    if (!auth.isAuthenticated) {
      const localUser = JSON.parse(localStorage.getItem('loggedInUser'))
      console.log(localUser)
      if (localUser) {
        dispatch({
          type: "LOGIN",
          payload: localUser
        })

        setAuthToken(localUser.token)
      }
    }
  }, [])

  return {
    auth,
    signUp,
    signIn,
    signOut
  }
}

export default useAuth;