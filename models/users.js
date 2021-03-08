const mongoose = require('mongoose');

// 后台管理用户信息字段的映射模板
const usersSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    isRoot: { type: Boolean, default: false },
    role_id: String,
    email: String,
    phone: String,
    create_time: { type: Number, default: Date.now }
})

const Users = mongoose.model('users', usersSchema);

module.exports = Users;