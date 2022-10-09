import React, { Fragment, useState } from 'react'
import { Form, Row, Col, Alert } from 'react-bootstrap'
import { useSnapshot } from 'valtio'
import { userStore } from '../models/user'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const userSnapshot = useSnapshot(userStore)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    userStore.login(email, password)
  }

  if (userSnapshot.user) {
    return (
      <Alert variant='success'>
        Logged in as {userSnapshot.user.attributes.email}
      </Alert>
    )
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={userSnapshot.isLoading}>
          <Form.Group as={Row} className='mb-2'>
            <Col>
              {userSnapshot.error && (
                <Alert variant='danger'>{userSnapshot.error.message}</Alert>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={5}>
              Login
            </Form.Label>
            <Col>
              <Form.Control
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={5}>
              Password
            </Form.Label>
            <Col>
              <Form.Control
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-2'>
            <Col xs={5} />
            <Col>
              <button type='submit' className='btn btn-primary'>
                Login
              </button>
            </Col>
          </Form.Group>
        </fieldset>
      </Form>
    </>
  )
}

export default LoginForm
