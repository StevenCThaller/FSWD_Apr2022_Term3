import { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import axios from '../utils/axiosConfig';
import { io } from 'socket.io-client';

const initialState = {
  friends: [],
  chatRooms: [],
  loading: true,
  socket: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_CHAT": {
      return {
        ...state,
        chatRooms: [...state.chatRooms, action.payload]
      }
    }
    case "LOAD_FRIENDS":
      return {
        ...state,
        friends: action.payload
      }
    case "LOAD_CHATS":
      return {
        ...state,
        chatRooms: action.payload
      }
    case "LOAD_DASHBOARD":
      return {
        ...state,
        friends: action.payload.friends,
        chatRooms: action.payload.chatRooms,
        loading: false
      }
    case "SET_SOCKET":
      return {
        ...state,
        socket: action.payload
      }
    default:
      return state;
  }
}

const dashboardContext = createContext();

export const ProvideDashboard = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <dashboardContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {children}
    </dashboardContext.Provider>
  )
}

const useDashboard = () => {
  const { state, dispatch } = useContext(dashboardContext)

  const loadDashboard = async () => {
    try {
      const friends = await axios.get('/friends')

      const chats = await axios.get('/chatrooms')
      dispatch({
        type: "LOAD_DASHBOARD",
        payload: {
          friends,
          chatRooms: chats
        }
      })
    } catch (error) {
      toast.error("oh :(")
    }
  }

  const addChatRoom = (room) => {
    dispatch({
      type: "ADD_CHAT",
      payload: room
    })
  }

  const setSocket = (socket) => {
    dispatch({
      type: "SET_SOCKET",
      payload: socket
    })
  }



  return {
    state,
    loadDashboard,
    addChatRoom,
    setSocket
  }
}

export default useDashboard