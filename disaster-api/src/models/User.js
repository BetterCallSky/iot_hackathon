import { Schema } from 'mongoose';

const LocationSchema = new Schema({
  type: String,
  coordinates: Array,
});

export default new Schema({
  _id: String,
  location: {
    type: LocationSchema,
    index: '2dsphere',
  },
});
