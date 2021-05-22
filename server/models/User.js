const { Schema, model, Types } = require('mongoose');

//status types:
//0 - DISABLED;
//1 - PENDING;
//2 - ACTIVE;
const schema = new Schema({
    nickname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: Number, enum: [0, 1, 2], required: true },
    confirmationCode: { type: String, required: true, unique: true },
    passwordResetCode: { type: String, required: false, unique: false },
    contacts: [{ type : Types.ObjectId, ref: 'User' }]
});

module.exports = model('User', schema);