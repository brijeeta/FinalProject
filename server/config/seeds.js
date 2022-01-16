const db = require('./connection');
const { Post } = require('../models');

db.once('open', async() => {
    await Post.deleteMany();

    await Post.create({
        username: 'holy',
        body: 'my first post',
        createdAt: '1/16/2022',

    });

    console.log('posts seeded');

    process.exit();
});