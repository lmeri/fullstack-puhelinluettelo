const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
morgan.token('content', function (req, res) { 
    return JSON.stringify(req.body);
})
app.use(morgan
    (':method :url :content :status :res[content-length] - :response-time ms')
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
    }
]
  
app.get('/', (req, res) => {
    res.send('')
})

app.get('/info', (req, res) => {
    let datetime = new Date();
    let info = 'Puhelinluettelossa ' + persons.length + ' henkilön tiedot';
    res.send(info + '<br />' + datetime)
})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id )

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const maxId = Math.floor(Math.random() * 100000);
    const person = request.body
    person.id = maxId

    if (person.name === undefined || person.number === undefined) {
        return response.status(400).json({error: 'name or number is missing'})
    } else if (checkPersons(person.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }

    persons = persons.concat(person)
  
    response.json(person)
})

function checkPersons(name) {
    for (let i = 0; i < persons.length; i++) {
        if (persons[i].name.toLowerCase().trim() === name.toLowerCase().trim() ) {
            return true;
        }
    }
    return false;
}
  
  
const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
