const express = require('express');
const router = express.Router();
const fs = require('fs')

module.exports = function productRouter(Product) {
    router.post('/add', (req, res) => {
        const { categoryList, name,
            desc, price, detail, imgs } = req.body;
        Product.create({
            categoryList, name, sales: Math.floor(Math.random() * 5000 + 2000),
            desc: desc || '', price: price || 0,
            detail: detail || '', imgs: imgs || []
        }).then(data => {
            res.json({ status: 0, meta: { msg: '添加商品成功', data } });
        }).catch(err => {
            console.log('添加商品异常', err);
            res.json({ status: 1, meta: { msg: '添加商品异常, 请重新尝试' } });
        });
    })

    router.get('/list', (req, res) => {
        const { type, productValue, pageNum, pageSize } = req.query;
        const reg = new RegExp(productValue);
        const findObj = productValue.trim() === '' ? {} : { $or: [{ [type]: { $regex: reg } }] };
        Product.find(findObj).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize)).sort({ _id: -1 }).exec((err, data) => {
            if (err) {
                console.log('查询异常', err);
                res.json({ status: 1, meta: { msg: '查询异常, 请重新尝试' } })
            } else {
                Product.countDocuments((err, count) => {
                    if (err) {
                        console.log('查询异常', err);
                        return res.json({ status: 1, meta: { msg: '查询异常, 请重新尝试' } })
                    }
                    let quotient = Math.floor(count / pageSize);
                    let pages = count % pageSize === 0 ? quotient : quotient + 1;
                    res.json({ status: 0, meta: { msg: '查询成功', pageNum, pageSize, pages, total: count, data } });
                });
            }
        });

    });

    router.put('/update', (req, res) => {
        const { id, status, name, desc, price, categoryList, detail, imgs } = req.body;
        let uObj;
        if (status !== undefined) uObj = { status }
        else uObj = { name, desc, price, categoryList, detail, imgs }
        Product.findByIdAndUpdate(id, uObj).then(doc => {
            res.json({ status: 0, meta: { msg: '修改商品信息成功', data: doc } })
        }).catch(err => {
            console.log('修改商品信息失败：', err);
            res.json({ status: 1, meta: { msg: '修改商品信息异常，请重新尝试' } });
        });
    })

    router.delete('/delete', (req, res) => {
        const { id } = req.query;
        Product.findByIdAndDelete(id, (err, doc) => {
            if (err) {
                console.log('删除商品失败：', err);
                return res.json({ status: 1, meta: { msg: '删除异常, 请稍后重试' } });
            }
            // 删除此商品的图片
            doc.imgs.map(i => {
                fs.unlinkSync(`${process.cwd()}/public/upload/${i.restName}`);
            })
            res.json({ status: 0, meta: { msg: '删除成功', data: doc } });
        })
    })

    return router;
}