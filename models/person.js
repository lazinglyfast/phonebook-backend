import dotenv from "dotenv"
dotenv.config()

import pkg from "mongoose"

const { connect, Schema, model } = pkg

console.log("connecting to mongodb...")
connect(process.env.MONGODB_URI).then(() => {
  console.log("connected to mongodb")
}).catch(error => {
  console.log("error connecting to MongoDB", error.message)
})

const schema = new Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: (phone) => {
        return phone.length > 7 && /\d{2,3}-\d+/.test(phone)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
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
