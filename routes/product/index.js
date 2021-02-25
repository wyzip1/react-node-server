const express = require('express');
const router = express.Router();

module.exports = function productRouter(Product) {
    router.post('/add', (req, res) => {
        const { categoryId, pCategoryId, name,
            desc, price, detail, imgs } = req.body;
        Product.create({
            categoryId, pCategoryId, name,
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
        const { productName, productDesc, pageNum, pageSize } = req.query;
        Product.find({
            [productName ? 'name' : 'desc']: productName ? productName : productDesc || ''
        }).skip(pageNum * pageSize).limit(pageSize).sort({ _id: -1 }).exec((err, data) => {
            if (err) {
                console.log('查询异常', err);
                res.json({ status: 1, meta: { msg: '查询异常, 请重新尝试' } })
            } else {
                res.json({ status: 0, meta: { msg: '查询成功', data } });
            }
        });

    });

    return router;
}