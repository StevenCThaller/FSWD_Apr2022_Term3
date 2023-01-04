import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'utils/axiosConfig.js'
import { Post } from 'components'
import LoadingSpinner from 'components/LoadingSpinner'
import { useProvideAuth } from 'hooks/useAuth'
import { toast } from 'react-toastify'
import './Feed.scss'

const initialState = {
  postText: '',
  isSubmitting: false,
  errorMessage: null,
}

const Feed = () => {
  const {
    state: { user },
  } = useProvideAuth()
  const [posts, setPosts] = useState(null)
  const [postLoading, setPostLoading] = useState(true)
  const [postError, setPostError] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState(initialState)
  const [validated, setValidated] = useState(false)

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }

  const handlePostSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      toast.error('Post text is required');
      setValidated(true)
      return
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })

    axios
      .post('/posts', {
        text: data.postText,
        author: user.username,
      })
      .then(
        (res) => {
          setData(initialState)
          setPosts((posts) => [
            {
              ...res.data,
              author: {
                username: user.username,
                profile_image: user.profile_image,
              },
            },
            ...posts,
          ])
          setValidated(false)
        },
        (error) => {
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: error.message,
          })
        }
      )
  }

  useEffect(() => {
    const getPosts = async () => {
      try {
        const allPosts = await axios.get('posts')
        setPosts(allPosts.data)
        setPostLoading(false)
      } catch (err) {
        console.error(err.message)
        setPostLoading(false)
        setPostError(true)
      }
    }
    getPosts()
  }, [])

  return (
    <>
      <Container className='pt-3 pb-3 clearfix'>
        <h4>Share a Snip</h4>
        <Form
          noValidate
          validated={validated}
          onSubmit={handlePostSubmit}
        >
          <Form.Control
            as='textarea'
            rows={3}
            maxLength='120'
            name='postText'
            placeholder="What's on your mind?"
            aria-describedby='post-form'
            size='lg'
            required
            value={data.postText}
            onChange={handleInputChange}
          />

          {data.errorMessage && (
            <span className='form-error'>{data.errorMessage}</span>
          )}
          <Button
            className='float-right mt-3'
            type='submit'
            disabled={data.isSubmitting}
          >
            {data.isSubmitting ? <LoadingSpinner /> : 'Post'}
          </Button>
        </Form>
      </Container>

      {!postLoading ? (
        <Container
          className='pt-3 pb-3'
        >
          <Row>
            <Col as="h6" xs={12} md={3} lg={6}>Recent Snips</Col>
            <Col xs={12} md={9} lg={6} className="relative">
              <Form.Control
                type="text"
                placeholder="Search for a snippet"
                name="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="pointer clear-search" onClick={() => setSearchTerm("")}>Clear</button>
            </Col>
          </Row>
          {postError && 'Error fetching posts'}
          {posts &&
            posts
              .filter((post) => post.text.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((post) => <Post key={post._id} post={post} />)}
        </Container>
      ) : (
        <LoadingSpinner full />
      )}
    </>
  )
}

export default Feed;