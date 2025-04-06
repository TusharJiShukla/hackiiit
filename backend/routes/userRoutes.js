import express from 'express';
import { getUserById, updateUser, getReceiptsByUser, createReceipt } from "../controllers/userController.js";


const router = express.Router();

router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser); 
router.get('/user/:id/receipts', getReceiptsByUser);
router.post('/user/:id/receipts', createReceipt);

export default router;
