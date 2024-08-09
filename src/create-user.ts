import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id, name} = req.body
      await prisma.user.create({
        data: {
          id,
          name,
        },
      })
      res.status(200).json({ message: 'User created' })
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
