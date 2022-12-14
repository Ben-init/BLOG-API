const express = require('express');
const router = express.Router();

const secure = require('./../../../auth/secure');
const response = require('./../../../network/response');
const controller = require('./index');

router.get('/', async (req, res, next) => {
    try {
        const userList = await controller.list();
        response.success(req, res, userList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await controller.get(id);
        response.success(req, res, user);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const data = req.body;
        const newUser = await controller.add(data);
        response.success(req, res, newUser);
    } catch (err) {
        next(err);
    }
});

router.get('/follow/:id/followers', async (req, res, next) => {
    try {
        const { id } = req.params;
        const followers = await controller.followers(id);
        response.success(req, res, followers);
    } catch (err) {
        next(err);
    }
});

router.get('/follow/:id/following', async (req, res, next) => {
    try {
        const { id } = req.params;
        const followers = await controller.following(id);
        response.success(req, res, followers);
    } catch (err) {
        next(err);
    }
});

router.post('/follow/:id', secure.follow, async (req, res, next) => {
    try {
        const { id : to } = req.params;
        const { sub : from } = req.user
        const follow = await controller.follow(from, to);
        response.success(req, res, follow);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', secure.update, async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedUser = await controller.update(data, id);
        response.success(req, res, updatedUser);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await controller.remove(id);
        response.success(req, res, deletedUser);
    } catch (err) {
        next(err);
    }
});

module.exports = router;