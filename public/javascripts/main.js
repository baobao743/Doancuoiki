$(document).ready(function() {
    $('button#Xoa-baiviet').click(e => {
        let data = e.target
        let id = data.dataset.id
        console.log('Clicked')
        console.log(data)
        $.ajax({
            url: '/bangtin/xoa/'+id,
            type: 'POST'
        })
        .then(data => console.log(data))
    })
    $('button.guibinhluan').click(e => {
        let data = e.target
        let id = data.dataset.id
        let noidungbinhluan = $(`#noidungbinhluan${id}`).val()
        console.log(noidungbinhluan)
        $.ajax({
            url: '/bangtin/binhluan',
            type: 'POST',
            data: {
                noidungbinhluan: noidungbinhluan,
                idbaiviet: id
            }
        })
        .then(data =>console.log(data))
    })
    $('.xoabinhluan').click(e => {
        let data = e.target
        let id = data.dataset.id
        console.log('clicked '+id)
        $.ajax({
            url: '/bangtin/binhluan/xoa/'+id,
            type: 'POST'
        })
    })
    $('.xoathongbao').click(e => {
        let data = e.target
        let id = data.dataset.id
        console.log(data)
        $.ajax({
            url: '/tatcathongbao/xoa/'+id,
            type: 'POST',
        })
        .then(data => console.log(data))
    })
    $('.suathongbao').click(e => {
        let data = e.target
        let id = data.dataset.id
        console.log(data)
        let tieude = $('#tieudethongbao').val()
        let noidungchinhsua = $('#noidungchinhsua').val()
        let khoa = $('#thongbaokhoa').val()
        $.ajax({
            url: '/tatcathongbao/sua/'+id,
            type: 'POST',
            data: {
                tieude: tieude,
                noidungchinhsua: noidungchinhsua,
                khoa: khoa
            }
        })
        .then(data => console.log(data))
    })
})
