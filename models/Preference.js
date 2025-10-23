const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  favorites: [String],
  notPreferred: [String],
  restrictions: [String],
  allergies: [String],
  otherFoods: String,
  otherRestrictions: String
});

module.exports = mongoose.model('Preference', PreferenceSchema);
