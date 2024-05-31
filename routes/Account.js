const express = require('express');
const {
    getAccounts,
    createAccount,
    getAccount,
    updateAccount,
    deleteAccount,
    getAccountTransactions,
    getAccountBalance,
    getAccountDeposit,
    getAccountwithdrawals
} = require('../controllers/Account');

const verifyToken = require ('../middleware/TokenHandler');

const router = express.Router();

router.get("/", verifyToken, getAccounts);
router.post("/", verifyToken, createAccount);
router.get("/:id", verifyToken, getAccount);
router.put("/:id", verifyToken, updateAccount);
router.delete("/:id", verifyToken, deleteAccount);
router.get("/transactions/:id", verifyToken, getAccountTransactions);
router.get("/balance/:id", verifyToken, getAccountBalance);
router.post("/deposit/:id", verifyToken, getAccountDeposit);
router.post("/withdraw/:id", verifyToken, getAccountwithdrawals);


module.exports = router;