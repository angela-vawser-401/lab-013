const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  name: RequiredString,
  genre: { type: String },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  yearFormed: { type: Number },
  members: RequiredString,
  albums: [{ type: String }],
  language: { type: String },
  living: { type: Boolean }
});

module.exports = mongoose.model('Band', schema);