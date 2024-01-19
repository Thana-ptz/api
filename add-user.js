import express from 'express';
import { createPool, sql } from '@vercel/postgres';

const app = express();
const port = 3000;

app.use(express.json());

const db = createPool({
  connectionString: 'your-postgres-connection-string',
});

app.post('/api/add-user', async (req, res) => {
  const { name, email, image } = req.body;

  try {
    // Insert user into the "users" table
    const result = await db.query(sql`
      INSERT INTO users (name, email, image)
      VALUES (${name}, ${email}, ${image})
      RETURNING *;
    `);

    const addedUser = result.rows[0];
    
    res.status(201).json({ user: addedUser, message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
