import dotenv from "dotenv"
dotenv.config()

import pkg from "mongoose"

const { connect, Schema, model } = pkg

console.log("connecting to mongodb...")
connect(process.env.MONGODB_URI).then(() => {
  console.log("connected to mongodb")
})

const schema = new Schema({
  name: String,
  number: String,
}, {
  toJSON: {
    transform: (person, returnedPerson) => {
      returnedPerson.name = person.name
      returnedPerson.number = person.number
      returnedPerson.id = person.id
      delete returnedPerson._id
      delete returnedPerson.__version
    }
  }
})

const Person = model("Person", schema)

export default Person
