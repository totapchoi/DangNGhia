const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const app = express();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// SQLite database connection
const db = new sqlite3.Database('employees.db');

// Create the employees table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, picture TEXT)');


// Initialize sample data
initializeSampleData();

// API endpoints
app.get('/search', searchEmployees);
app.post('/add-employee', upload.single('picture'), addEmployee);
app.delete('/delete-employee/:id', deleteEmployee);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function initializeSampleData() {
  const sampleEmployees = [
    {
      name: 'John Doe',
      address: '123 Main St',
      picture: 'uploads/sample1.jpg',
    },
    {
      name: 'Jane Smith',
      address: '456 Maple Ave',
      picture: 'uploads/sample2.jpg',
    },
    {
      name: 'Dang Nghia',
      address: 'Ben xe',
      picture: 'uploads/handsome.jpg',
    },

  ];

  sampleEmployees.forEach((employee) => {
    const sql = 'INSERT OR IGNORE INTO employees (id, name, address, picture) VALUES (?, ?, ?, ?)';
    db.run(sql, [employee.id, employee.name, employee.address, employee.picture], (err) => {
      if (err) {
        console.error('Error initializing sample data:', err);
      }
    });
  });
}

async function searchEmployees(req, res) {
  const query = req.query.q || '';
  console.log('Search request received:', query);
  try {
    const employees = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM employees WHERE name LIKE ?', `%${query}%`, (error, rows) => {
        if (error) {
          console.error('Error in SQL query:', error);
          reject(error);
        } else {
          console.log('SQL query result:', rows);
          resolve(rows);
        }
      });
    });

    res.json(employees);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'An error occurred while searching employees' });
  }
}

function addEmployee(req, res) {
  const { name, address } = req.body;
  const picture = req.file ? req.file.path : '';

  const sql = 'INSERT INTO employees (name, address, picture) VALUES (?, ?, ?)';
  db.run(sql, [name, address, picture], (err) => {
    if (err) {
      res.status(500).send({ error: 'An error occurred while adding a new employee' });
    } else {
      res.status(201).send({ message: 'Employee added successfully' });
    }
  });
}
async function deleteEmployee(req, res) {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({ error: 'Employee ID is required' });
    return;
  }

  const sql = 'DELETE FROM employees WHERE id = ?';
  db.run(sql, [id], (err) => {
    if (err) {
      res.status(500).send({ error: 'An error occurred while deleting the employee' });
    } else {
      res.status(200).send({ message: 'Employee deleted successfully' });
    }
  });
}
