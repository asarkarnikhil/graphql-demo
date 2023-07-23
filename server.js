const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

const connectDataBase = require('./helper/database');
const { hashPassword } = require('./helper/util');
const Event = require('./modles/event.modle');
const User = require('./modles/users.model');
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
        creator: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        events: [Event!]!
        users: [User!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event!
        createUser(userInput: UserInput): User!
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
        users: async () => {
            const users = await User.find();
            return {...users._doc, password:null}
        },
        createEvent: async (args) => {
            //check if user/creator already exists
            const userExists = await User.findOne({_id: args.eventInput.creator})
            if (!userExists) {
                //return { message: 'User already exists' }
                throw new Error('Creator does not exists')
            }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: args.eventInput.creator
            })
            return await event.save()
            .then(result => { 
                //Event created updating the user with event id
                userExists.createdEvents.push(result)
                return result})
            .catch(err => {console.log('error while saving event', err.message);})
        },
        createUser: async(args) => {
            //check if user already exists
            const userExists = await User.findOne({email: args.userInput.email})
            if (userExists) {
                //return { message: 'User already exists' }
                throw new Error('User already exists')
            }
            //creaate a new hashed password using input string
            const hashedPassword = await hashPassword(args.userInput.password)

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })

            //create or saving user to database
            const result = await user.save()
            
            delete result.password
            return {...result._doc, password:null, message: 'user saved successfully'}
        }
    },
    graphiql: true
}))

connectDataBase(); //conction to the db
//server created
app.listen(port, () => console.log(`Yes buddy I'm litening on port ${port}`))