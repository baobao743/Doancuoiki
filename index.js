const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
require('dotenv').config()

const BaiViet = require('./models/Baiviet')
const BinhLuan = require('./models/Binhluan')
const TaiKhoan = require('./models/Taikhoan')
const ThongBao = require('./models/ThongBao')
require('./passport')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
//Dang nhap bang google
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
// Đăng nhập Google và Local (1.0)--------------------------------------------
// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    //console.log(req.user)
    req.session._id = req.user.id
    req.session.ten = req.user.ten
    req.session.role = 'sinhvien'
    res.redirect('/bangtin')
  }
)

//Xong
app.post('/login' , (req , res)=>{

    let {email, password} = req.body
    let temp = undefined
    TaiKhoan.findOne({email: email})
    .then(data => {
        if(!data) {
            return res.json({code: 1, message: 'Email khong ton tai'})
        }
        //console.log(data)
        if(password == data.pass) {
             req.session._id = data._id
             req.session.ten = data.ten
             req.session.role = data.role
             //console.log(data._id)
             //console.log(req.session._id)
             return res.redirect('bangtin')
        }
        else {
             return res.json({code: 1, message: 'Sai mat khau'})
        }
    })
 
 })
//Xong
app.get('/dangxuat', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/login');
})
//xong
//routing
app.get('/', (req, res) => {
    return res.redirect('/login')
})
//xong
app.get('/login', (req, res) => {
    return res.render('dangnhap')
})

//xong
app.get('/dangxuat', (req, res) => {
    req.session.destroy()
    return res.redirect('/login')
})
//xong
app.get('/bangtin' , (req , res)=>{
    if(!req.session._id) {
        return res.redirect('/login')
    }
    let baiviet = undefined
    let binhluan = undefined
    let thongbao = undefined
    BinhLuan.find()
    .then(data => {
        binhluan = data
        //console.log(data)
    })
    BaiViet.find()
    .then(data => {
        baiviet = data
        
    })
    ThongBao.find()
    .then(data => {
        thongbao = data
    })
    TaiKhoan.findOne({_id: req.session._id}, function (e, data) {
        //console.log(data)
        return res.render('trangchu',{acc: data, baiviets: baiviet, binhluans: binhluan, thongbaos: thongbao})
    })
})
app.get('/bangtin/:ten', (req, res) => {
    if(!req.session._id) {
        return res.redirect('/login')
    }
    let baiviet = undefined
    let binhluan = undefined
    let thongbao = undefined
    console.log(req.params.ten)
    BinhLuan.find()
    .then(data => {
        binhluan = data
        //console.log(data)
    })
    BaiViet.find()
    .then(data => {
        baiviet = data
    })
    ThongBao.find()
    .then(data => {
        thongbao = data
    })
    TaiKhoan.findOne({_id: req.session._id}, function (e, data) {
        //console.log(data)
        return res.render('canhan',{acc: data, baiviets: baiviet, binhluans: binhluan, thongbaos: thongbao, timeline: req.params.ten})
    })
})
// Tạo, xóa, cập nhật bài viết (0.5)------------------------------------------
//Xong
app.post('/bangtin/taobaiviet' , (req , res)=>{
    // if(!req.session._id) {
    //     return res.redirect('/login')
    // }
    let {noidung} = req.body
    let acc = undefined
    TaiKhoan.findOne({_id: req.session._id}, function(e, data) {
        let baivietmoi = new BaiViet({
            noidung: noidung,
            tacgia: req.session.ten
        })
        baivietmoi.save()
    })
    return res.redirect('/bangtin')
})
//Xong
app.post('/bangtin/xoa/:id' , (req , res)=>{
    if(!req.session._id) {
        return res.redirect('/login')
    }
   let id = req.params.id
   BaiViet.findByIdAndDelete({_id: id})
   .then(data => {
       return res.redirect('/bangtin')
   })

})
//Chua Xong
app.post('/bangtin/capnhat/:id', (req, res) => {
    // if(!req.session._id) {
    //     return res.redirect('/login')
    // }
   let id = req.params.id
   let noidungmoi = req.body.noidungmoi
   BaiViet.findByIdAndUpdate({_id: id}, {$set: {noidung: noidungmoi}})
   .then(data => {
       return res.json({code: 0, message: 'Da cap nhat bai viet '+data})
   })
})
//Xong
app.post('/bangtin/binhluan', (req, res) => {
    let {noidungbinhluan, idbaiviet} = req.body
    if(!noidungbinhluan || !idbaiviet) {
        return res.redirect('/bangtin')
    }
    let binhluan = new BinhLuan({
        noidung: noidungbinhluan,
        tacgia: req.session.ten,
        idbaiviet: idbaiviet
    })
    binhluan.save()
    return res.json({code: 0, message: 'Binh luan ok'})
})
//Xong
app.post('/bangtin/binhluan/xoa/:id', (req, res) => {
    let id = req.params.id
    console.log(id)
    BinhLuan.findByIdAndDelete({_id: id})
    .then(data => {
        console.log(data)
        return res.json({code: 0, message: 'Xoa ok'})
    })
})
// Tạo tài khoảng cho phòng khoa (0.25)--------------------------------------
//Xong
app.post('/taotaikhoan', (req, res) => {
    let {email, password, ten, role, khoa} = req.body
    TaiKhoan.findOne({email: email})
    .then(data => {
        if(data) {
            return res.send('Tai khoan ton tai')
        }
        let taikhoanmoi = new TaiKhoan({
            email: email,
            pass: password,
            ten: ten,
            khoa: khoa,
            role: 'khoa'
        })
        return taikhoanmoi.save()
    })
    .then(() => {
        return res.redirect('/bangtin')
    })
})
//Xong
app.get('/taotaikhoan', (req, res) => {
    if(!req.session._id) {
        return res.redirect('/login')
    }
    return res.render('dangki')
})
//Cập nhật mật khẩu cho phòng khoa (0.25)--------------------------------
//Xong
app.post('/doimatkhau' , (req , res)=>{
    //console.log(req.session._id)
   let {passcu, passmoi} = req.body
   TaiKhoan.findOne({_id: req.session._id})
    .then(data => {
        //console.log(data)
        if(passcu == data.pass) {
            TaiKhoan.findByIdAndUpdate({_id: req.session._id}, {$set: {
                pass: passmoi
                }})
                .then(data => {
                    return res.json({code: 0, message: 'Mat khau da duoc cap nhat'})
                })
        }
        else {
             return res.json({code: 1, message: 'Sai mat khau'})
        }
    })
   

})
//Sinh viên cập nhật thông tin (0.5)---------------------------
//Xong
app.post('/capnhatthongtin' , (req , res)=>{
    if(!req.session._id) {
        return res.redirect('/login')
    }
   let {ten, lop, khoa, avatar} = req.body
   TaiKhoan.findByIdAndUpdate({_id: req.session._id}, {$set: {
       ten: ten,
       lop: lop,
       khoa: khoa,
       avatar: avatar
   }})
   .then(data => {
       return res.redirect('/bangtin')
   })
})
app.post('/bangtin/taothongbao' , (req , res)=>{

   let {noidungthongbao,khoa,tieude} = req. body
   console.log(req.body)
   if(!noidungthongbao || !khoa || !tieude) {
       return res.redirect('/bangtin')
   }
   console.log(req.body)
    let thongbao = new ThongBao({
        tieude: tieude,
        noidung: noidungthongbao,
        tacgia: req.session.ten,
        khoa: khoa
    })
    thongbao.save()
    return res.redirect('/tatcathongbao')

})
//Xong
app.get('/tatcathongbao' , (req , res)=>{

    if(!req.session._id) {
        return res.redirect('/login')
    }
    let baiviet = undefined
    let binhluan = undefined
    let thongbao = undefined
    BinhLuan.find()
    .then(data => {
        binhluan = data
        //console.log(data)
    })
    BaiViet.find()
    .then(data => {
        baiviet = data
        
    })
    ThongBao.find()
    .then(data => {
        thongbao = data
    })
    TaiKhoan.findOne({_id: req.session._id}, function (e, data) {
        //console.log(data)
        return res.render('xemalltb',{acc: data, baiviets: baiviet, binhluans: binhluan, thongbaos: thongbao})
    })
})
app.post('/tatcathongbao/xoa/:id' , (req , res)=>{

   let id = req.params.id
   //console.log(id)
   ThongBao.deleteOne({_id: id})
   .then(data => {
       //console.log(data.deletedCount)
       if(data.deletedCount == 1) {
        return res.json({code: 0, message: 'Xoa thanh cong'})
       }
       else {
        return res.json({code: 1, message: 'Xoa that bai'})
       }
   })
   

})
app.post('/tatcathongbao/sua/:id', (req, res) => {
    let {noidungchinhsua,tieude,khoa} = req.body
    let id = req.params.id
    ThongBao.findByIdAndUpdate({_id: id}, {$set: {
        tieude: tieude,
        noidung: noidungchinhsua,
        khoa: khoa
    }})
    .then(data => {
        return res.json({code: 0, message: 'Chinh sua: '+data})
    })
})
app.get('/tatcathongbao/:id' , (req , res)=>{
    if(!req.session._id) {
        return res.redirect('/login')
    }
    let baiviet = undefined
    let binhluan = undefined
    let thongbao = undefined
    BinhLuan.find()
    .then(data => {
        binhluan = data
        //console.log(data)
    })
    BaiViet.find()
    .then(data => {
        baiviet = data
    })
    ThongBao.findOne({_id: req.params.id})
    .then(data => {
        thongbao = data
    })
    TaiKhoan.findOne({_id: req.session._id}, function (e, data) {
        //console.log(data)
        return res.render('thongbao',{acc: data, baiviets: baiviet, binhluans: binhluan, thongbaos: thongbao})
    })
})

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://admin:admin@cluster0.ptpeb.mongodb.net/hoaibao?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(console.log('CONECTED'))
app.listen(process.env.PORT, () => console.log('http://localhost:9191'))