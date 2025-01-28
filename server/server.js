const express = require('express');
const app = express();
const cors = require('cors')
const userRoutes = require('./routes/userRoutes');
// const employeeRoutes = require('./routes/employeeRoutes');
const employerRoutes = require('./routes/employerRoutes');
const dotenv = require('dotenv')
dotenv.config();
const db = require('./config/dbConfig'); // MongoDB connection
db()

app.use(express.json());
app.use(cors({
    origin : "http://localhost:5173"
}))
// Routes
app.use('/api/users', userRoutes);
// app.use('/api/employees', employeeRoutes);
app.use('/api/employers', employerRoutes);

app.get('/', (req, res) => {
    res.send('Employee Management System API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
