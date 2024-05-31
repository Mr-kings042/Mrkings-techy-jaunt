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
router.get("/:id/transactions", verifyToken, getAccountTransactions);
router.get("/:id/balance", verifyToken, getAccountBalance);
router.post("/:id/deposit", verifyToken, getAccountDeposit);
router.post("/:id/withdraw", verifyToken, getAccountwithdrawals);


module.exports = router;