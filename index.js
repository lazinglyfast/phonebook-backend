import express, { json } from "express"
import cors from "cors"
import morgan, { token } from "morgan"

let persons = [
  {
    id: 0,
    name: "teddy",
    number: "123456789",
  },
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
]

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

app.get("/persons", (_req, res) => {
  res.json(persons)
})

app.use(json())

const generateId = () => {
  const maxId = persons.reduce((acc, p) => p.id > acc ? p.id : acc, Number.MIN_VALUE)
  return maxId + 1
}

app.post("/persons", (req, res) => {
  const fromClientPerson = req.body
  if (!fromClientPerson.name || !fromClientPerson.number) {
    res.status(400)
    return res.end()
  }

  const person = {
    id: generateId(),
    name: fromClientPerson.name,
    number: fromClientPerson.number,
  }

  persons.push(person)
  res.json(person)
})

app.delete("/persons/:id", (req, res) => {
  const id = req.params.id
  const length_before = persons.length
  persons = persons.filter(p => p.id != id)
  const length_after = persons.length
  if (length_before == length_after) {
    res.status(400) // person did not exist
  }
  res.end()
})

app.put("/persons/:id", (req, res) => {
  const person = req.body
  if (!persons.find(p => p.id == person.id)) {
    res.status(400) // person does not exist
  }

  persons = persons
    .filter(p => p.id != person.id)
    .concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
