const mongoose = require('mongoose');

// 后台管理用户信息字段的映射模板
const usersSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role_id: String,
    email: String,
    phone: {
        type: String,
        match: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    },
    create_time: { type: Number, default: Date.now }
})

const Users = mongoose.model('users', usersSchema);

// 初次启动服务器时对管理员账号进行初始化
Users.find({}, (err, docs) => {
    if (err) {
        console.log(err);
        return;
    }
    if (docs.length === 0) {
        const user = new Users({
            username: 'admin',
            password: 'admin',
            email: 'admin@gmail.com',
            phone: '18086614501'
        });

        user.save((err, doc) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('初始化账号信息：', doc);
        })
    }
})

module.exports = Users;