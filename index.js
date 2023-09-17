import express, { json } from "express"
import cors from "cors"
import morgan, { token } from "morgan"
import Person from "./models/person.js" // the .js is needed

const app = express()
app.use(cors({ origin: true }))
app.use(express.static("build"))
app.use(json())

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

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    response.json(person)
  }).catch(error => {
    console.log(next)
    console.log(error.name)
    console.log(error)
    return next(error)
  })
})

app.get("/api/persons", (_req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

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

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(_result => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    number: req.body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true }).then(person => {
    res.json(person)
  }).catch(error => next(error))
})

const errorHandler = (error, _req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformed id" })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
