const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const productSchema = new mongoose.Schema({
    categoryList: { type: Array, required: true },
    name: { type: String, required: true }, // 名称
    price: { type: Number, required: true }, // 价格
    desc: { type: String },
    status: { type: Number, default: 1 }, // 商品状态: 1:在售, 0: 下架了
    imgs: { type: Array, default: [] }, // n个图片文件名的json字符串
    detail: { type: String }
})


// 3. 定义Model(与集合对应, 可以操作集合)
const ProductModel = mongoose.model('products', productSchema)

// 4. 向外暴露Model
module.exports = ProductModel