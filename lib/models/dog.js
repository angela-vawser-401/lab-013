const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  breed: RequiredString,
  temperment: { type: String },
  group: {
    type: String,
    enum: ['Working', 'Sporting', 'Foundation Stock Service', 'Hound', 'Terrier', 'Toy', 'Herding', 'Non-Sporting']
  },
  countryOfOrigin: { type: String },
  yearAKC: Number
});

module.exports = mongoose.model('Dog', schema);