const express = require('express');
const {
    getTransactions,
    getTransaction,
    deleteTransaction
} = require('../controllers/Transaction');
const verifyToken = require('../middleware/TokenHandler');
const router = express.Router();
router.get("/",verifyToken,getTransactions);
router.get("/:id", verifyToken, getTransaction);
router.delete("/:id", verifyToken,deleteTransaction);

module.exports = router;