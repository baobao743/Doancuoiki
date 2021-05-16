const mongoose = require('mongoose')
const thongBao = new mongoose.Schema({
    noidung: 'string',
    thoigian: {
        type: Date,
        default: new Date().getTime()
    },
    khoa: 'string',
    tieude: 'string',
    tacgia: 'string'
})
const ThongBao = mongoose.model('thongBao',thongBao)
module.exports = ThongBao