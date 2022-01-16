const { Post, User } = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secret = 'mysecretsshhhhh';
const expiration = '2h';
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators')

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, secret, { expiresIn: expiration })

}

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
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }

        },
        // login resolvers  
        async login(parent, { username, password }, context, info) {
            const { errors, valid } = validateLoginInput(username, password)
            const user = await User.findOne({ username });
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'credentials doesnot match'
                throw new UserInputError('credentials doesnot match', { errors })
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        }

    }
};

module.exports = resolvers;