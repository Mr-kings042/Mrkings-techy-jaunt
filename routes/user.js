const express = require('express');
const{
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    Userlogin,
} = require('../controllers/user');

const verifyToken = require('../middleware/TokenHandler');

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/detail", getUser);
router.put("/",verifyToken, updateUser);
router.delete("/",verifyToken, deleteUser);
router.post("/login/", Userlogin);

module.exports = router;