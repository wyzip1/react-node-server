const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const axios = require('axios');
const category = require('./category')
const product = require('./product')

const { Users, Roles, Category, Product } = require('../models');
// 登录方法
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    Users.findOne(
        { username, password },
        { _id: 0 }
    ).then(user => {
        if (user) {
            const token = 'Bearer ' + jwt.sign(user._doc, 'react', { expiresIn: 60 * 60 * 24 });
            if (user.role_id) {
                Roles.findOne({ _id: user.role_id }).then(role => {
                    user._doc.role = role.menus;
                    res.json({ status: 0, meta: { msg: '登陆成功', user, token } });
                });
            } else {
                user._doc.role = [];
                res.json({ status: 0, meta: { msg: '登陆成功', user, token } });
            }
        } else res.json({ status: 1, meta: { msg: '用户名或密码错误', user } });
    }).catch(err => {
        console.log(err);
        res.json({ status: 1, meta: { msg: '登陆异常，请稍后重试' } });
    })
})
// 测试用 - 获取所有用户信息
router.get('/getUsers', (req, res) => {
    Users.find({}).then(users => {
        res.json({ status: 0, meta: { msg: '查询成功', users } })
    }).catch(err => {
        console.log(err);
        res.json({ status: 1, meta: { msg: '查询异常' } })
    })
});
// 获取天气
router.get('/weather', (req, res) => {
    const ip = 'https://restapi.amap.com/v3/ip?parameters';
    const weather = 'https://restapi.amap.com/v3/weather/weatherInfo?parameters';
    const key = '1e91eb8a82da201ebce5aa72fbdcc664';
    axios.get(ip, { params: { key } }).then(rs => {
        const params = { key, city: rs.data.adcode, extensions: 'base' };
        axios.get(weather, { params }).then(r => {
            res.json({ ...r.data, status: 0 });
        })
    });
});

router.use('/category', category(Category))
router.use('/product', product(Product));

module.exports = router;
