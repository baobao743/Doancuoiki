const mongoose = require('mongoose')
const taiKhoan = new mongoose.Schema({
    email: 'string',
    pass: 'string',
    ten: 'string',
    lop: 'string',
    khoa: 'string',
    avatar: 'string',
    role: 'string'
})
const TaiKhoan = mongoose.model('taiKhoan',taiKhoan)
module.exports = TaiKhoan