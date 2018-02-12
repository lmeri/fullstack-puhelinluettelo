const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
morgan.token('content', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms')
)

let persons = [
  {
    name:'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name:'Martti Tienari',
    number: '040-123456',
    id: 2
  },
  {
    name:'Arto Järvinen',
    number: '040-123456',
    id: 3
  },
  {
    name:'Lea Kutvonen',
    number: '040-123456',
    id: 4
  }]

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      let datetime = new Date()
      let info = 'Puhelinluettelossa ' + persons.length + ' henkilön tiedot'
      res.send(info + '<br />' + datetime)
    })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(formatPerson(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const p = req.body

  if (p.name === undefined || p.number === undefined) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: p.name,
    number: p.number
  })

  Person
    .findOne({ name: person.name })
    .then(result => {
      if (result === null) {
        person
          .save()
          .then(savedPerson => {
            res.json(formatPerson(savedPerson))
          })
      } else {
        return res.status(400).json({ error: 'name must be unique' })
      }
    })
})

app.put('/api/persons/:id', (req, res) => {
  const p = req.body

  const person = {
    name: p.name,
    number: p.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true } )
    .then(updatedPerson => {
      res.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

