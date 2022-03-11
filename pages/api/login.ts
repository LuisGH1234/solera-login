// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { pool } from 'db'
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(crypto.scrypt)

interface ReqBody {
  username: string
  password: string
}

interface User {
  id: number
  password: string
  username: string
  fullname: string
  createdAt: string
  updatedAt: string
}

type Data = {
  user?: Partial<User>
  error: boolean
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // const salt = crypto.randomBytes(12).toString('hex')
  const query = "select * from Users WHERE username = 'admin'"
  const [rows] = await pool.query(query)
  const { password, ...user } = (rows as Array<User>)[0]
  
  const credentials = req.body as ReqBody
  const hash = await scrypt(credentials.password, 'bcrypt salt 12', 64) as Buffer

  if (hash.toString('hex') === password) {
    res.status(200).json({
      user,
      error: false,
      message: 'Ha iniciado sesión correctamente',
    })
  } else {
    res.status(401).json({
      error: true,
      message: 'Credenciales incorrectas',
    })
  }
}
