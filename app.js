const fs = require("fs");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 3001;

const secretKey = 'eyL0rem!p5um';

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

function readUsersFromFile() {
    const filepath = path.join(__dirname, "users.json");
    const filedata = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(filedata);
}

function writeUsersToFile(users) {
    const filepath = path.join(__dirname, "users.json");
    const jsonData = JSON.stringify(users, null, 4);
    fs.writeFileSync(filepath, jsonData, "utf-8");
}

// Read all users from the json
// Return the list of users as the response
app.get('/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});
  
// Read a specific user from the json
// Return the user as the response
app.get('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userId = req.params.id;
    const user = users.find((b) => b.id === userId);
    if (!user) {
        res.status(404).json({ error: 'User with the given id was not found' });
    } else {
        res.json(user);
    }
});

// Create a new user in the json
// Extract user data from the request body
// Add the new user to the json file
// Return the newly created user as the response
app.post('/users', (req, res) => {
    let users = readUsersFromFile();
    const newUser = req.body;
    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).json(newUser);
});

// Update a specific user in the json
// Extract user data from the request body
// Update the corresponding user in the json
// Return the updated user as the response
app.put('/users/:id', (req, res) => {
    let users = readUsersFromFile();
    const userId = req.params.id;
    const updatedUser = req.body;
    let user = users.find((b) => b.id === userId);
    user = { ...user, ...updatedUser };
    userIndex = users.findIndex((b) => b.id === userId);
    users[userIndex] = user;
    writeUsersToFile(users);
    res.status(200).json(user);
});

// Delete a specific user from the json
// Remove the corresponding user from the json
// Return a success message as the response
app.delete('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userId = req.params.id;
    const toBeDeletedIndex = users.findIndex((user) => user.id === userId);
    users.splice(toBeDeletedIndex, 1);
    writeUsersToFile(users);
    res.json(users);
});

app.post('/login', (req, res) => {
    const users = readUsersFromFile();
    const { email, password } = req.body;
    // Find user by username and password
    const user = users.find(u => u.email === email && u.password === password);
  
    if (user) {
      // Generate JWT token
      const token = jwt.sign({ username: user.email, role: user.role, expiration: 1000000 }, secretKey);
      res.json({ name: user.name, email, token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });

app.listen(port, function() {
    console.log(`Server running on ${port}`)
});
