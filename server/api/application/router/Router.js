const express = require('express');
const DB = require('../modules/db/DB.js');
const UserManager = require('../modules/user/UserManager.js'); 
const ItemsManager = require('../modules/items/ItemsManager.js');
const Answer = require('./Answer.js');

function Router() {
    const router = express.Router();
    const db = new DB();
    
    const userManager = new UserManager(db);
    const itemsManager = new ItemsManager(db);

    // ============ USER ROUTES ============
    router.post('/login{/:login}{/:passwordHash}', async (req, res) => {
        const params = {
            login: req.params.login,
            passwordHash: req.params.passwordHash
        };
        const response = await userManager.login(params);
        res.json(Answer.response(response));
    });

    router.post('/logout{/:token}', async (req, res) => {
        const params = {
            token: req.params.token
        };
        const response = await userManager.logout(params);
        res.json(Answer.response(response));
    });

    router.post('/registration{/:login}{/:passwordHash}{/:nickname}', async (req, res) => {
        const params = {
            login: req.params.login,
            passwordHash: req.params.passwordHash,
            nickname: req.params.nickname
        };
        const response = await userManager.registration(params);
        res.json(Answer.response(response));
    });

    router.post('/deleteUser{/:token}', async (req, res) => {
        const params = {
            token: req.params.token
        };
        const response = await userManager.deleteUser(params);
        res.json(Answer.response(response));
    });

    router.post('/getUserInfo{/:token}', async (req, res) => {
        const params = {
            token: req.params.token
        };
        const response = await userManager.getUserInfo(params);
        res.json(Answer.response(response));
    });

    router.get('/getRatingTable{/:token}', async (req, res) => {
        const params = {
            token: req.params.token
        };
        const response = await userManager.getRatingTable(params);
        res.json(Answer.response(response));
    });

    // ============ ITEMS ROUTES ============
    router.post('/buyItem{/:token}{/:itemId}', async (req, res) => {
        const params = {
            token: req.params.token,
            itemId: req.params.itemId
        };
        const response = await itemsManager.buyItem(params);
        res.json(Answer.response(response));
    });

    router.post('/sellItem{/:token}{/:itemId}', async (req, res) => {
        const params = {
            token: req.params.token,
            itemId: req.params.itemId
        };
        const response = await itemsManager.sellItem(params);
        res.json(Answer.response(response));
    });

    router.post('/useArrow{/:token}', async (req, res) => {
        const params = {
            token: req.params.token
        };
        const response = await itemsManager.useArrow(params);
        res.json(Answer.response(response));
    });

    router.post('/usePotion{/:token}', async (req, res) => {
        const params = {
            token: req.params.token
        };
        const response = await itemsManager.usePotion(params);
        res.json(Answer.response(response));
    });

    router.get('/getItemsData{/:token}', async (req, res) => {
        const params = {
            token: req.params.token
        };
        const response = await itemsManager.getItemsData(params);
        res.json(Answer.response(response));
    });

    // ============ NOT FOUND ============
    router.get('/*path', (req, res) => {
        res.json(Answer.response({ error: 404 }));
    });

    router.post('/*path', (req, res) => {
        res.json(Answer.response({ error: 404 }));
    });

    return router;
}

module.exports = Router;