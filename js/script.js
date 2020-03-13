"use strict";

/*****************

Chesses
Pippin Barr

******************/


let chess;
let $p5Canvas;

$(document).ready(chessesSetup);

function chessesSetup() {

  let title = "CHESSES2";
  $('#title').text(`${title}`)

  let author = 'BY <a href="https://www.pippinbarr.com/" target="_blank">&nbsp;PIPPIN BARR</a>';
  $('#author').html(`${author}`)


  let menu = [{
      title: "SAMSARA",
    },
    {
      title: "REVERSAL",
    },
    {
      title: "FOG",
    },
    {
      title: "XR",
    },
    {
      title: "LEWITT",
    },
    {
      title: "MUSICAL",
    },
    {
      title: "LIFE",
    },
    {
      title: "3D",
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

    case 'FOG':
      chess = new Fog();
      break;

    case 'XR':
      chess = new XR();
      break;

    case 'LEWITT':
      chess = new LeWitt();
      break;

    case 'MUSICAL':
      chess = new Musical();
      break;

    case 'LIFE':
      chess = new Life();
      break;

    case '3D':
      chess = new ThreeDee();
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

function setup() {
  createCanvas(640, 640);
  $p5Canvas = $('canvas');
  // $p5Canvas.detach();
  $p5Canvas.hide();

  background(255, 0, 0);
}