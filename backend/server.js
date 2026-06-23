const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config();
mongoose.set('strictQuery',true)

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes

app.use('/api/auth',  require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

app.get('/', (req, res) => {
  res.json({ message: 'Social App Backend is running ' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Serveris running port ${PORT} `);
    });
  })
  .catch((err) => {
    console.error('MongoDB not  connect ', err.message);
    process.exit(1);
  });