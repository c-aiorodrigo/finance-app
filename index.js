import 'dotenv/config'
import express from 'express'

const app = express()
app.use(express.json())

app.listen(process.env.PORT_API, () => {
    console.log('Abrindo o predio 8080!')
})
