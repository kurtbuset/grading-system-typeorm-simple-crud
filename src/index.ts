import express, { Request, Response } from 'express'
import studentRouter from './user.routes'
const app = express()

// import userRouter from './user.routes'

app.use(express.json())

app.use('', studentRouter)


app.listen(3000, () => {
    console.log('Server running on port 3000')
})






