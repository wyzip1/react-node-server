const express = require('express');
const router = express.Router();

function deleteCategoryById(Category) {
    return async (req, res) => {
        const { categoryId } = req.query;
        async function d(id) {
            const data = await Category.findOne({ _id: id });
            if (data) {
                const child = await Category.find({ parentId: data._id });
                if (child.length) {
                    for (let i of child) {
                        await d(i._id);
                    }
                } else {
                    await Category.deleteOne({ _id: id });
                    await d(categoryId);
                }
            }
        }
        try {
            await d(categoryId);
            res.json({ status: 0, meta: { msg: '删除分类成功' } });
        } catch (err) {
            console.log(err);
            res.json({ status: 1, meta: { msg: '删除分类异常, 请重新尝试' } });
        }
    }
}

module.exports = function categoryRouter(Category) {
    // 添加分类列表
    router.post('/add', (req, res) => {
        const { parentId, categoryName } = req.body
        Category.create({ name: categoryName, parentId: parentId || 0 })
            .then(ct => {
                res.json({ status: 0, meta: { msg: '添加分类成功', data: ct } })
            }).catch(err => {
                console.error('添加分类异常', err)
                res.json({ status: 1, meta: { msg: '添加分类异常, 请重新尝试' } })
            });
    })

    // 获取分类列表
    router.get('/list', (req, res) => {
        const parentId = req.query.parentId || '0';
        Category.find({ parentId }).then(data => {
            res.json({ status: 0, meta: { data, msg: '获取分类列表成功' } })
        }).catch(err => {
            console.log('获取分类列表异常：', err);
            res.json({ status: 1, meta: { msg: '获取分类列表异常，请重新尝试' } })
        });
    });

    // 获取树形分类 -----------
    router.get('/tree', async (req, res) => {
        try {
            let treeData = [];
            const getTree = async (obj) => {
                let d = obj ? obj : { id: '0' };
                let data = await Category.find({ parentId: d.id });
                if (data.length) {
                    if (!treeData.length) treeData = data;
                    else obj._doc.children = data;
                    for (let i of data) {
                        await getTree(i);
                    }
                };
            }
            await getTree();
            res.json({ status: 0, meta: { msg: '获取分类列表成功', data: treeData } });
        } catch (err) {
            console.log('获取分类列表异常：', err)
            res.json({ status: 1, meta: { msg: '获取分类列表异常，请重新尝试' } });
        }
    })

    // 更新分类
    router.put('/update', (req, res) => {
        const { categoryId, categoryName } = req.body;
        Category.findOneAndUpdate({ _id: categoryId }, { name: categoryName }).then(ct => {
            res.json({ status: 0, meta: { msg: '分类更新成功', data: ct } });
        }).catch(err => {
            console.log('更新分类列表一场：', err);
            res.json({ status: 1, meta: { msg: '更新分类异常，请重新尝试' } })
        })
    })
    // 删除分类
    router.delete('/delete', deleteCategoryById(Category));

    return router;
}