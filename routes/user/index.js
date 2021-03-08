const express = require('express');
const router = express.Router();

module.exports = function userRouter(Users) {

    router.get('/list', (req, res) => {
        const { username, pageNum, pageSize } = req.query;
        const reg = new RegExp(username);
        Users.find(
            { $or: [{ username: { $regex: reg } }] }
        ).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize)).sort({ _id: -1 }).then(data => {
            Users.countDocuments((err, count) => {
                if (err) {
                    console.log('查询用户信息失败：', err);
                    return res.json({ status: 1, meta: { msg: '查询用户信息异常，请重新尝试' } });
                }
                let quotient = Math.floor(count / pageSize);
                let pages = count % pageSize === 0 ? quotient : quotient + 1;
                res.json({ status: 0, meta: { msg: '查询用户信息成功', data, pageSize, pageNum, total: count, pages } });
            })
        }).catch(err => {
            console.log('查询用户信息失败：', err);
            res.json({ status: 1, meta: { msg: '查询用户信息异常，请重新尝试' } });
        })
    })

    router.post('/add', (req, res) => {
        Users.create(req.body).then(data => {
            res.json({ status: 0, meta: { msg: '添加用户成功', data } });
        }).catch(err => {
            console.log('添加用户失败：', err);
            res.json({ status: 1, meta: { msg: '添加用户异常，请重新尝试' } });
        })

    })

    router.put('/update', (req, res) => {
        const { id, username, role_id, email, phone } = req.body;
        const updObj = { username, role_id, email, phone };
        Users.findByIdAndUpdate(id, updObj).then(data => {
            res.json({ status: 0, meta: { msg: '更新用户信息成功', data } });
        }).catch(err => {
            console.log('更新用户信息失败：', err);
            res.json({ status: 1, meta: { msg: '更新用户信息异常，请重新尝试' } });
        })
    })

    router.delete('/delete', (req, res) => {
        Users.findByIdAndDelete(req.query.id).then(data => {
            res.json({ status: 0, meta: { msg: '删除用户成功', data } });
        }).catch(err => {
            console.log('删除用户失败：', err);
            res.json({ status: 1, meta: { msg: '删除用户异常，请重新尝试' } });
        })
    })

    return router;
}