import pkg from "mongoose"
const { connect, disconnect, Schema, model, connection } = pkg

set("strictQuery", false) // the default actually, allows empty {} filter

const [_interpreter, _script, password, name, number] = process.argv
if (!password) {
  throw "password must be provided"
}

const url = `mongodb+srv://root:${password}@phonebook.h8rb2wm.mongodb.net/phonebookApp?retryWrites=true&w=majority`
connect(url)

const schema = new Schema({
  name: String,
  number: String,
})

const Person = model("Person", schema)

if (name && number) {
  const person = new Person({ name, number })
  await person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
  })
} else {
  await Person.find({}).then(people => {
    people.forEach((person) => {
      console.log(person.name, person.number)
    })
  })
}

// disconnect()
connection.close()
