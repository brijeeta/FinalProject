const { Post, User } = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secret = 'mysecretsshhhhh';
const expiration = '2h';
const { UserInputError } = require('apollo-server');
const { validateRegisterInput } = require('../utils/validators')

const resolvers = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        // destructure the args(registerinput from typedef to access the keys)
        async register(parents, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            // validate input data with validator file
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            // user exists or not
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    // the below errors will be user in client to display error on UI
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            // hash pawd and create auth token
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })
            const res = await newUser.save();
            // jwt token 
            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username,
            }, secret, { expiresIn: expiration })

            return {
                ...res._doc,
                id: res._id,
                token
            }

        }
    }
};

module.exports = resolvers;