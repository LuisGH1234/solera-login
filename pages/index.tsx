import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import styled from 'styled-components'

const AppContainer = styled.div`
  text-align: center;
  background-color: #354c6b;
  background-image: linear-gradient(315deg, #869cb9 0%, #425b87 74%);
	height: 100vh;
  width: 100%;
  margin: 0;
  
  & > main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const FormContainer = styled.div`
  width: 45%;
  height: 40%;

  background-color: white;
  border-radius: 42px;
  padding: 4em;

  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 2em;

  box-shadow:
    rgba(22, 31, 39, 0.42) 0px 60px 123px -25px,
    rgba(19, 26, 32, 0.08) 0px 35px 75px -35px;

  @media (max-width: 920px) {
		padding: 2em;
	}

	@media (max-height: 850px) {
		padding: 2em;
		width: 52%;
		height: 60%;
	}

	@media (max-height: 1200px) {
		padding: 2em;
		width: 58%;
		height: 50%;
	}
`

const Button = styled.button`
  padding: 13px 24px;
	background-color: #354c6b;
	border: none;
	color: whitesmoke;
	font-weight: 700;
	border-radius: 12px;
	font-size: 1.2vw;
	cursor: pointer;
	text-decoration: none;
	margin-bottom: .67em;

  &:hover {
		background-color: rgb(53, 76, 107, .7);
	}

	&:active {
		background-color: rgb(53, 76, 107, .8);
		transition: transform 200ms ease;
		transform: scale(.98);
	}

  &:disabled {
    background-color: rgba(146, 165, 192, 0.7);
		cursor: unset;

    &:hover {
			background-color: rgba(146, 165, 192, 0.7);
		}
  }
`

interface AlertProps {
  error: boolean
}
const Alert = styled.div<AlertProps>`
  background-color: ${props => props.error ? 'rgb(211, 89, 89, .9)' : 'rgb(103, 178, 103, .9)'};
  border: solid 1px ${props => props.error ? 'rgb(211, 89, 89, 1)' : 'rgb(103, 178, 103, 1)'};
  border-radius: 12px;
  padding: 1em 1.2em;
  color: whitesmoke;
`

interface InputProps {
  error?: boolean
}

const Input = styled.input<InputProps>`
  height: 42px;
  border: solid 2px ${props => props.error === true ? 'red' : 'rgb(53, 76, 107, .6)'};
  border-radius: 12px;
  padding: 1em 1.2em;

  &:active {
    border: solid 2px rgb(53, 76, 107, 1);
  }
`

type Data = {
  error: boolean
  message: string
}

const Home: NextPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Data | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const onClick = () => {
    if (isDirty === false) setIsDirty(true)
    if (username.length === 0 || password.length === 0) {
      return
    }

    setLoading(true)
    fetch('/api/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    .then(res => res.json())
    .then(body => {
      console.log(body)
      setData(body as Data)
    })
    .catch(err => {
      console.log(err)
      setData({
        error: true,
        message: 'Ocurrio un error al intentar inciar sesión',
      })
    })
    .finally(() => setLoading(false))
  }

  return (
    <AppContainer>
      <Head>
        <title>Solera Login</title>
        <meta name="description" content="Solera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <FormContainer>
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Usuario"
            error={isDirty && username.length === 0}
          />
          <Input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            error={isDirty && password.length === 0}
          />
          <Button onClick={onClick} disabled={loading}>
            Iniciar Sesión
          </Button>
          {data !== null && (
            <Alert error={data.error}>
              {data.message}
            </Alert>
          )}
        </FormContainer>
      </main>
    </AppContainer>
  )
}

export default Home
