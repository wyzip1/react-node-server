const mongoose = require('mongoose');
const Role = require('../routes/Role');

const rolesSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 角色名称
    auth_name: String, // 授权人
    auth_time: Number, // 授权时间
    create_time: { type: Number, default: Date.now }, // 创建时间
    menus: Array // 所有有权限操作的菜单path的数组
});

const RoleModel = mongoose.model('Roles', rolesSchema);

// RoleModel.find({ name: 'admin' }).then(data => {
//     if (!data.length)
//         RoleModel.create({
//             name: 'admin',
//             auth_name: '初始化',
//             auth_time: Date.now(),
//             create_time: Date.now(),
//             menus: [
//                 'root', '/', 'shopping', '/user', '/role',
//                 'chart', '/shopping/category', '/shopping/goods',
//                 '/chart/barchart', '/chart/linechart', '/chart/piechart'
//             ]
//         }).then()
// }).catch(err => {
//     console.log('初始化admin角色失败', err)
// });

module.exports = RoleModel;