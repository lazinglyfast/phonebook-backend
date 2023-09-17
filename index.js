import express, { json } from "express"
import cors from "cors"
import morgan, { token } from "morgan"
import Person from "./models/person.js" // the .js is needed
import { now } from "mongoose"

const app = express()
app.use(cors({ origin: true }))
app.use(express.static("build"))

token("data", (req) => {
  if (req.method == "POST") {
    return JSON.stringify(req.body)
  }
})
const format = ":method :url :status :res[content-length] - :response-time ms :data"
app.use(morgan(format))

app.get("/", (_req, res) => {
  res.send("hello, world!")
})

app.get("/api/persons", (_req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.use(json())

app.post("/api/persons", (req, res) => {
  const fromClientPerson = req.body
  if (!fromClientPerson.name || !fromClientPerson.number) {
    res.status(400)
    return res.end()
  }

  const person = new Person({
    name: fromClientPerson.name,
    number: fromClientPerson.number,
  })

  person.save().then(person => {
    res.json(person)
  })
})

app.delete("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(person => {
    person.deleteOne().then(() => {
      res.end()
    })
  })
})

app.put("/api/persons/:id", (req, res) => {
  const fromClientPerson = req.body
  Person.findById(req.params.id).then(person => {
    person.number = fromClientPerson.number
    person.save().then(person => {
      res.json(person)
    })
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
