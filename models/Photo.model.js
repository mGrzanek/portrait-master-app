const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, minlength: 3, maxlength: 25, match: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż -.,]+$/, required: true },
  author: { type: String, minlength: 3, maxlength: 50, match: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż -.,]+$/, required: true },
  email: { type: String, match: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, required: true },
  src: { type: String, required: true },
  votes: { type: Number, required: true },
});

module.exports = mongoose.model('Photo', photoSchema);
