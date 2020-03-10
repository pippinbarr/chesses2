"use strict";

/*****************

Chesses
Pippin Barr

******************/


let chess;

$(document).ready(setup);

function setup() {

  let title = "CHESSES 2";
  $('#title').text(`${title}`)

  let author = 'BY <a href="https://www.pippinbarr.com/" target="_blank">&nbsp;PIPPIN BARR</a>';
  $('#author').html(`${author}`)


  let menu = [{
      title: "SAMSARA",
    },
    {
      title: "REVERSAL",
    },
  ];

  for (let i = 0; i < menu.length; i++) {
    let marker = menu[i].title;
    let $item = $(`<div class="menu-item active" id="${marker}">${menu[i].title}</div>`);
    $item.data('game', marker);
    $('#menu').append($item);
  }

  $('.menu-item').on('click', menuClicked);
}

function titleClicked() {
  $('.instruction').slideUp();
  $('#message').slideUp();
  $('#title').removeClass('active');
  $('#game').slideUp(() => {
    $('.menu-item').slideDown();
    $('#author').slideDown();
    $('.menu-item').addClass('active');
    $('.menu-item').on('click', menuClicked);
  });
}

function menuClicked() {

  switch ($(this).data('game')) {
    case 'REVERSAL':
      chess = new Reversal();
      break;

    case 'SAMSARA':
      chess = new Samsara();
      break;
  }

  $('#title').addClass('active');
  $('#title.active').on('click', titleClicked);

  $('.menu-item').removeClass('active');

  $('.menu-item').off('click');

  $('#author').slideUp();
  $('.menu-item').not(`#${$(this).data('game')}`).slideUp(500, () => {
    // $('#menu').hide();
    $('#game').slideDown(() => {
      // console.log("slid")
      $(this).find('.instruction').slideDown();
    });
  });
  $('#message').slideUp();
}