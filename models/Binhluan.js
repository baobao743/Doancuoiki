const mongoose = require('mongoose')
const binhLuan = new mongoose.Schema({
    noidung: 'string',
    thoigian: {
        type: Date,
        default: new Date().getTime()
    },
    tacgia: 'string',
    idbaiviet: 'string'
})
const BinhLuan = mongoose.model('binhLuan',binhLuan)
module.exports = BinhLuan