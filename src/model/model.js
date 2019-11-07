import mongoose, {Schema} from 'mongoose';

const schema = new Schema({
    name: { 
        type: String,
        required: true 
    },
    email: {
         type: String,
          required: true,
          unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    Game :[String],
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friends'}],
    createdDate: { type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now}

    //versionKey: false
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);