const mongoose = require('mongoose')
const baiViet = new mongoose.Schema({
    noidung: 'string',
    thoigian: {
        type: Date,
        default: new Date().getTime()
    },
    tacgia: 'string'
})
const BaiViet = mongoose.model('baiViet',baiViet)
module.exports = BaiViet