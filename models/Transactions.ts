import { Schema, model } from 'mongoose'

const transactionSchema = new Schema({
    student : {
        type: String,
        required: true,
    },
    mentor : {
        type: String,
        required: true,
    },
    project : {
        type: String,
        required: true,
        unique: true
    },
    deleteIndex : {
        type: String,
        required: true
    },
    title :{
        type: String,
    },
    type:{
        type: String,
        required: true
    },
    open:{
        type: Boolean,
        required: true
    },
    points : {
        type: Number,
        required: true
    },
});

transactionSchema.index({ project: 1 }, { unique: true });

module.exports = model('transaction', transactionSchema)