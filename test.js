
const mongoose = require('mongoose');
const config = require('./config/config')
const { Product, Category, Users, Role } = require('./models');
mongoose.connect(config.mongodb, config.options);


Users.create({
    username: 'admin2',
    password: 'admin',
    email: 'admin@gmail.com',
    phone: '18086614501',
}).then(rs => {
    console.log('账号信息：', rs);
});

// Role.find({ name: 'admin' }).then(data => {
//     if (!data.length)
//         Role.create({
//             name: 'admin',
//             auth_name: '初始化',
//             auth_time: Date.now(),
//             create_time: Date.now(),
//             menus: [
//                 'root', '/', 'shopping', '/user', '/role',
//                 'chart', '/shopping/category', '/shopping/goods',
//                 '/chart/barchart', '/chart/linechart', '/chart/piechart'
//             ]
//         }).then(data => {
//             // 初次启动服务器时对管理员账号进行初始化, 并绑定角色权限
//             Users.find({ username: 'admin' }).then(doc => {
//                 if (!doc.length)
//                     Users.create({
//                         username: 'admin',
//                         password: 'admin',
//                         email: 'admin@gmail.com',
//                         phone: '18086614501',
//                         role_id: data._id
//                     }).then(rs => {
//                         console.log('初始化账号信息：', rs);
//                     });
//                 else
//                     Users.findOneAndUpdate(
//                         { username: 'admin' }, { role_id: data._id }
//                     ).then(rs => {
//                         console.log('初始化账号信息：', rs);
//                     })
//             })
//         }).catch(err => console.log('初始化admin角色失败', err));
// }).catch(err => {
//     console.log('初始化admin角色失败', err);
// });

// Product.aggregate(
//     [
//         { $match: {} },
//         { $group: { _id: '$categoryList', total: { $sum: "$sales" } } }
//     ]
// ).then(async data => {
//     for (let i of data) {
//         let id = i._id[i._id.length - 1];
//         const { name } = await Category.findById(id);
//         i.name = name;
//     }
// })