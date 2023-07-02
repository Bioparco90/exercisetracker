const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const { User } = require('./models/User');
const { Exercise } = require('./models/Exercise');

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const { DB_USERNAME, DB_PASSWORD, PORT } = process.env;

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@clustertest.ustyboj.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(uri)
  .then(() => console.log('Database connected'))
  .catch((error) =>
    console.log('Something goes wrong with the DB connection: ', error.message)
  );

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  const newUser = new User({ username: username });
  await newUser.save();

  res.json({ username: newUser.username, _id: newUser._id });
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const checkedDate = isNaN(Date.parse(date))
    ? new Date().toDateString()
    : new Date(date).toDateString();

  const newExercise = new Exercise({
    userId: _id,
    description,
    duration,
    date: checkedDate,
  });
  await newExercise.save();

  const user = await User.findById(_id);

  const {
    _id: exerciseId,
    __v,
    userId,
    ...rest
  } = {
    ...user.toObject(),
    ...newExercise.toObject(),
  };

  res.json({ _id: userId, ...rest });
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = await User.findById(_id).lean();

  let exercises = await Exercise.find({ userId: _id }).lean();

  if (from) {
    const fromDate = new Date(from);
    exercises = exercises.filter(
      (exercise) => new Date(exercise.date) >= fromDate
    );
  }

  if (to) {
    const toDate = new Date(to);
    exercises = exercises.filter(
      (exercise) => new Date(exercise.date) <= toDate
    );
  }

  if (limit) {
    exercises = exercises.slice(0, Number(limit));
  }

  const obj = {
    count: exercises.length,
    log: exercises,
    ...user,
  };

  res.json(obj);
});

const listener = app.listen(PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
