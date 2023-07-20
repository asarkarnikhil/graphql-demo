const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

const connectDataBase = require('./helper/database');
const Event = require('./modles/event.modle');
app.use(bodyParser.json());

const port = process.env.PORT || 3000;



// //initial endpoint
// app.get('/',(req, res, next) =>{
//     console.log('Yes! the api is up and running')
// })

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event! 
    }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: async () => {
            const events = await Event.find();
            return events;
        },
        createEvent: async (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return await event.save()
            .then(result => { return result})
            .catch(err => {console.log('error while saving event', err.message);})
        }
    },
    graphiql: true
}))

connectDataBase(); //conction to the db
//server created
app.listen(port, () => console.log(`Yes buddy I'm litening on port ${port}`))