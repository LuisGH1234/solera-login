// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { pool } from 'db'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

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
  const credentials = req.body as ReqBody

  const query = `select * from Users WHERE username = ?`
  const [rows] = await pool.query(query, [credentials.username])

  if ((rows as Array<User>).length === 0) {
    res.status(401).json({
      error: true,
      message: 'Credenciales incorrectas',
    })
    return
  }

  const { password, ...user } = (rows as Array<User>)[0]

  const isValid = bcrypt.compareSync(credentials.password, password);
  if (isValid) {
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
