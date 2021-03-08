const express = require('express');
const router = express.Router();

module.exports = function roleRouter(Role) {
    router.post('/add', (req, res) => {
        const { name } = req.body;
        Role.create({ name }).then(data => {
            res.json({ status: 0, meta: { msg: '添加角色成功', data } });
        }).catch(err => {
            console.log('添加角色失败：', err);
            res.json({ status: 1, meta: { msg: '添加角色异常，请重新尝试' } });
        });
    });

    router.get('/list', (req, res) => {
        const { pageSize, pageNum } = req.query;
        Role.find({}).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize)).sort({ _id: -1 }).exec((err, data) => {
            if (err) {
                console.log('查询角色列表失败：', err);
                return res.json({ status: 1, meta: { msg: '角色列表查询异常，请重新尝试' } });
            }
            Role.countDocuments((err, count) => {
                if (err) {
                    console.log('查询角色列表失败：', err);
                    return res.json({ status: 1, meta: { msg: '角色列表查询异常，请重新尝试' } });
                }
                let quotient = Math.floor(count / pageSize);
                let pages = count % pageSize === 0 ? quotient : quotient + 1;
                res.json({ status: 0, meta: { msg: '查询角色列表成功', data, pages, total: count, pageNum, pageSize } });
            })
        })
    })

    router.get('/lists', (req, res) => {
        Role.find({}).then(data => {
            res.json({ status: 0, meta: { msg: '查询角色列表成功', data } });
        }).catch(err => {
            console.log('查询角色列表失败：', err);
            res.json({ status: 1, meta: { msg: '角色列表查询异常，请重新尝试' } });
        });
    })

    router.put('/update', (req, res) => {
        const { id, menus, auth_name, auth_id, name } = req.body;
        let updObj = name ? { name } : { menus, auth_time: Date.now(), auth_name, auth_id }
        Role.findByIdAndUpdate(id, updObj).then(data => {
            res.json({ status: 0, meta: { msg: '修改角色信息成功', data } })
        }).catch(err => {
            console.log('修改角色信息失败', err);
            return res.json({ status: 1, meta: { msg: '修改角色信息异常，请重新尝试' } });
        });
    });

    router.delete('/delete', (req, res) => {
        const { id } = req.query;
        Role.findByIdAndDelete(id).then(data => {
            res.json({ status: 0, meta: { msg: '删除角色成功', data } })
        }).catch(err => {
            console.log('删除角色失败：', err);
            res.json({ status: 1, meta: { msg: '删除角色异常，请重新尝试' } });
        });
    })

    return router;
}