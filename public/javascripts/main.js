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
getPagination('#table-id');
function getPagination(table) {
  var lastPage = 1;

  $('#maxRows')
    .on('change', function(evt) {
     lastPage = 1;
      $('.pagination')
        .find('li')
        .slice(1, -1)
        .remove();
      var trnum = 0; // reset tr counter
      var maxRows = parseInt($(this).val()); // get Max Rows from select option

      if (maxRows == 5000) {
        $('.pagination').hide();
      } else {
        $('.pagination').show();
      }

      var totalRows = $(table + ' tbody tr').length; // numbers of rows
      $(table + ' tr:gt(0)').each(function() {
        // each TR in  table and not the header
        trnum++; // Start Counter
        if (trnum > maxRows) {
          // if tr number gt maxRows

          $(this).hide(); // fade it out
        }
        if (trnum <= maxRows) {
          $(this).show();
        } // else fade in Important in case if it ..
      }); //  was fade out to fade it in
      if (totalRows > maxRows) {
        // if tr total rows gt max rows option
        var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
        //	numbers of pages
        for (var i = 1; i <= pagenum; ) {
          // for each page append pagination li
          $('.pagination #prev')
            .before(
              '<li class="page-item" data-page="' + i +'">\
                <a class="page-link" href="#">' +
                i++ +
                '</a>\
								</li>'
            )
            .show();
        } // end for i
      } // end if row count > max rows
      $('.pagination [data-page="1"]').addClass('active page-item'); // add active class to the first li
      $('.pagination li').on('click', function(evt) {
        // on click each page
        evt.stopImmediatePropagation();
        evt.preventDefault();
        var pageNum = $(this).attr('data-page'); // get it's number

        var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

        if (pageNum == 'prev') {
          if (lastPage == 1) {
            return;
          }
          pageNum = --lastPage;
        }
        if (pageNum == 'next') {
          if (lastPage == $('.pagination li').length - 2) {
            return;
          }
          pageNum = ++lastPage;
        }

        lastPage = pageNum;
        var trIndex = 0; // reset tr counter
        $('.pagination li').removeClass('active'); // remove active class from all li
        $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
        // $(this).addClass('active');					// add active class to the clicked
	  	limitPagging();
        $(table + ' tr:gt(0)').each(function() {
          // each tr in table not the header
          trIndex++; // tr index counter
          // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
          if (
            trIndex > maxRows * pageNum ||
            trIndex <= maxRows * pageNum - maxRows
          ) {
            $(this).hide();
          } else {
            $(this).show();
          } //else fade in
        }); // end of for each tr in table
      }); // end of on click pagination list
	  limitPagging();
    })
    .val(5)
    .change();

  // end of on select change

  // END OF PAGINATION
}

function limitPagging(){
	// alert($('.pagination li').length)

	if($('.pagination li').length > 7 ){
			if( $('.pagination li.active').attr('data-page') <= 3 ){
			$('.pagination li:gt(5)').hide();
			$('.pagination li:lt(5)').show();
			$('.pagination [data-page="next"]').show();
		}if ($('.pagination li.active').attr('data-page') > 3){
			$('.pagination li:gt(0)').hide();
			$('.pagination [data-page="next"]').show();
			for( let i = ( parseInt($('.pagination li.active').attr('data-page'))  -2 )  ; i <= ( parseInt($('.pagination li.active').attr('data-page'))  + 2 ) ; i++ ){
				$('.pagination [data-page="'+i+'"]').show();

			}

		}
	}
}
