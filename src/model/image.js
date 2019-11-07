import mongoose, {Schema} from 'mongoose';
//const images = new Schema({imagename:String,createdDate:{type : Date,default :Date.now}})
const schema = new Schema({
    user_id: { 
        type: String,
        required: true 
    },
        imagename:[{type:String,
            createdDate:{type:Date,default:Date.now}
        }],
        //{createdDate:{type:Date,default:Date.now},
    imagedata: { 
        type: String, 
        required: true 
    },
    createdDate: { type: Date, default: Date.now },

    versionKey: false
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Image', schema);