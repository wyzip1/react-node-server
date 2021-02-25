const mongoose = require('mongoose')

// 字义Schema(描述文档结构)
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentId: { type: String, required: true, default: '0' }
})

// 定义Model(与集合对应, 可以操作集合)
const CategoryModel = mongoose.model('categorys', categorySchema)

// 向外暴露Model
module.exports = CategoryModel