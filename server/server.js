const express = require('express');
const app = express();
const cors = require('cors')
const userRoutes = require('./routes/userRoutes');
const employerRoutes = require('./routes/employerRoutes');
const dotenv = require('dotenv')
dotenv.config();
const db = require('./config/dbConfig'); 
db()

app.use(express.json());
app.use(cors({
    origin : "https://facetrack-0s10.onrender.com"
}))

app.use('/api/users', userRoutes);
app.use('/api/employers', employerRoutes);

app.get('/', (req, res) => {
    res.send('Employee Management System API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
