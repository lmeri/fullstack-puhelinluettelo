const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const pName = process.argv[2]
const pNumber = process.argv[3]

if (pName === undefined && pNumber === undefined) {
    console.log('puhelinluettelo:')
    Person
    .find({})
    .then(result => {
        result.forEach(person => {
        console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: pName,
        number: pNumber
    })
    
    person
        .save()
        .then(response => {
            console.log('lisätään henkilö ' + pName + ' numero ' + pNumber + ' luetteloon')
            mongoose.connection.close()
    })
}





