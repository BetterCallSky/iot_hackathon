import { Schema } from 'mongoose';

const LocationSchema = new Schema({
  type: String,
  coordinates: Array,
});

export default new Schema({
  _id: { type: Number, required: true },
  value: { type: Number, required: true },
  type: String,
  isAlert: Boolean,
  location: {
    type: LocationSchema,
    index: '2dsphere',
  },
});
