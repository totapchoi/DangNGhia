const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const app = express();
const path = require('path');

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
app.use('/', express.static(path.join(__dirname, '../client/dist')));


//Create database, table, and inititate data sample if it doesn't exist
const db = new sqlite3.Database('employees.db');
initializeSampleData();



// API endpoints
app.get('/employees', getEmployees);
app.get('/search', searchEmployees);
app.post('/add-employee', upload.single('picture'), addEmployee);
app.delete('/delete-employee/:id', deleteEmployee);
app.put('/api/employees/:id', upload.single('picture'), updateEmployee);
app.get('/api/employees/:id', getEmployee);


// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function initializeSampleData() {
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
    {
      name: 'Kenshiro',
      address: 'Japan',
      picture: 'uploads/shine.jpeg',
    },
  ];

  try {
    // Check if the table exists
    const tableExists = await new Promise((resolve) => {
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'", (err, row) => {
        if (err || !row) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

    // If the table doesn't exist, create it
    if (!tableExists) {
      db.run('CREATE TABLE employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, picture TEXT)');
    }

    // Check if the table is empty
    const isEmpty = await new Promise((resolve) => {
      db.get('SELECT count(*) as count FROM employees', (err, row) => {
        if (err || row.count === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

      // If the table is empty, drop and recreate the table, then insert sample data
    if (isEmpty) {
      await new Promise((resolve, reject) => {
        db.run("DROP TABLE employees", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await new Promise((resolve, reject) => {
        db.run("CREATE TABLE employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, picture TEXT)", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      sampleEmployees.forEach((employee) => {
        const sql = 'INSERT OR IGNORE INTO employees (id, name, address, picture) VALUES (?, ?, ?, ?)';
        db.run(sql, [employee.id, employee.name, employee.address, employee.picture], (err) => {
          if (err) {
            console.error('Error initializing sample data:', err);
          }
        });
      });
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}

async function getEmployees(req, res) {
  try {
    const employees = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM employees', (error, rows) => {
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
    res.status(500).json({ error: 'An error occurred while fetching all employees' });
  }
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
  const picture = req.file ? req.file.path : 'uploads/default.jpeg'; // Set the default image path here

  // Check if the name field is empty
  if (!name) {
    res.status(400).send({ error: 'Employee name is required' });
    return;
  }

  const sql = 'INSERT INTO employees (name, address, picture) VALUES (?, ?, ?)';
  db.run(sql, [name, address, picture], function (err) {
    if (err) {
      res.status(500).send({ error: 'An error occurred while adding a new employee' });
    } else {
      const newEmployee = { id: this.lastID, name, address, picture };
      res.status(201).json(newEmployee);
    }
  });
}



async function updateEmployee(req, res) {
  const id = req.params.id;
  const { name, address } = req.body;
  const picture = req.file ? req.file.path : '';

  // Check if the name field is empty
  if (!name) {
    res.status(400).send({ error: 'Employee name is required' });
    return;
  }

  if (picture === '') {
    // If the picture field is empty, don't update the picture field
    const sql = 'UPDATE employees SET name = ?, address = ? WHERE id = ?';
    db.run(sql, [name, address, id], (err) => {
      if (err) {
        res.status(500).send({ error: 'An error occurred while updating the employee' });
      } else {
        res.status(200).send({ message: 'Employee updated successfully' });
      }
    });
  } else {
    // If the picture field is not empty, update the name, address, and picture fields
    const sql = 'UPDATE employees SET name = ?, address = ?, picture = ? WHERE id = ?';
    db.run(sql, [name, address, picture, id], (err) => {
      if (err) {
        res.status(500).send({ error: 'An error occurred while updating the employee' });
      } else {
        res.status(200).send({ message: 'Employee updated successfully' });
      }
    });
  }
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
async function getEmployee(req, res) {
  const id = req.params.id;

  try {
    const employee = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM employees WHERE id = ?', [id], (error, row) => {
        if (error) {
          console.error('Error in SQL query:', error);
          reject(error);
        } else {
          console.log('SQL query result:', row);
          resolve(row);
        }
      });
    });

    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'An error occurred while fetching the employee' });
  }
}