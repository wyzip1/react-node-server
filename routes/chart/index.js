const express = require('express');
const router = express.Router();


module.exports = function chartRouter(Product, Category) {

    router.get('/groupBycategoryTotalSales', (req, res) => {
        Product.aggregate(
            [
                { $match: {} },
                { $group: { _id: '$categoryList', total: { $sum: "$sales" } } }
            ]
        ).then(async data => {
            for (let i of data) {
                let id = i._id[i._id.length - 1];
                const { name } = await Category.findById(id);
                i.name = name;
            }
            res.json({ status: 0, meta: { msg: '获取各类商品售卖统计信息成功', data } });
        }).catch(err => {
            console.log('获取各类商品售卖统计信息失败：', err);
            res.json({ status: 1, meta: { msg: '获取各类商品售卖统计信息异常，请重新尝试' } });
        })
    })

    return router;
}