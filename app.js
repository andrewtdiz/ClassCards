const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')
const schema = require('./schema/schema')
const Card = require('./models/card')
const mongoose = require('mongoose')
var cors = require('cors')

mongoose.set('useFindAndModify', false);

app.use(cors())
// app.use(express.json())
// app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))


mongoose.connect('mongodb+srv://andrew:2lxRE8UrhkpSmhAh@cluster0.2pshv.gcp.mongodb.net/app?retryWrites=true&w=majority'
, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    app.listen(3000)
}).then((err)=> console.log('server running on 3000')).catch((err) => {
    console.log(err)
})

