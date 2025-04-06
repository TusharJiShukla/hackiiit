import { connectDb } from '../lib/db.js';

const pool = await connectDb();
// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get receipts by user ID
export const getReceiptsByUser = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM receipts WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new receipt
export const createReceipt = async (req, res) => {
  try {
    const { amount, description, date } = req.body;
    const userId = req.params.id;

    const [result] = await pool.query(
      'INSERT INTO receipts (user_id, amount, description, date) VALUES (?, ?, ?, ?)',
      [userId, amount, description, date]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      amount,
      description,
      date,
      created_at: new Date()
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 