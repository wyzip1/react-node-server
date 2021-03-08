const mongoose = require('mongoose');
const Users = require('./users');

const rolesSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 角色名称
    auth_id: String,
    auth_name: String, // 授权人
    auth_time: Number, // 授权时间
    create_time: { type: Number, default: Date.now }, // 创建时间
    menus: Array // 所有有权限操作的菜单path的数组
});

const RoleModel = mongoose.model('Roles', rolesSchema);

// 初次启动服务器时对管理员账号进行初始化, 并绑定角色权限 
RoleModel.find({ name: 'admin' }).then(data => {
    if (!data.length)
        RoleModel.create({
            name: 'admin',
            auth_name: '初始化',
            auth_time: Date.now(),
            auth_id: 'init',
            create_time: Date.now(),
            menus: [
                'root', '/', 'shopping', '/user', '/role',
                'chart', '/shopping/category', '/shopping/goods',
                '/chart/barchart', '/chart/linechart', '/chart/piechart',
                '/shopping/add', '/shopping/update'
            ]
        }).then(data => {
            Users.find({ username: 'admin' }).then(doc => {
                if (!doc.length)
                    Users.create({
                        username: 'admin',
                        password: 'admin',
                        email: 'admin@gmail.com',
                        phone: '18086614501',
                        isRoot: true,
                        role_id: data._id
                    }).then(rs => {
                        console.log('初始化账号信息：', rs);
                    });
                else
                    Users.findOneAndUpdate(
                        { username: 'admin' }, { role_id: data._id }
                    ).then(rs => {
                        console.log('初始化账号信息：', rs);
                    })
            })
        }).catch(err => console.log('初始化admin角色失败', err));
}).catch(err => {
    console.log('初始化admin角色失败', err);
});

module.exports = RoleModel;