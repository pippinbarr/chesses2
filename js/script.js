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
      info: "Pieces go through the great chain of existence as they are moved."
    },
    {
      title: "REVERSAL",
      info: "Pieces change sides with every move."
    },
    {
      title: "FOG",
      info: "Each player can only see what their pieces can see."
    },
    {
      title: "XR",
      info: "A cross-reality application giving you the ability to use real chess pieces on a virtual board. Tip over your laptop, monitor, phone, or tablet and play now!"
    },
    {
      title: "LEWITT",
      info: "A drawing created by the movements of chess pieces in the spirit of Sol LeWitt's wall drawings."
    },
    {
      title: "MUSICAL",
      info: "A melody is played using the current game position as its score."
    },
    {
      title: "3D",
      info: "Chess has finally entered the third dimension!"
    },
    {
      title: "DRAUGHTS",
      info: "What if chess, but checkers capture rules?"
    },
  ];
  menu.sort((a, b) => a.title < b.title ? -1 : 1);

  for (let i = 0; i < menu.length; i++) {
    let $menuItem = $('<div>')
      .addClass('menu-item active')
      .attr('id', menu[i].title)
      .html(`${menu[i].title}<span class="info">ⓘ</span>`)
      .data('game', menu[i].title)
      .on('click', menuClicked)
      .appendTo('#menu');

    let $infoPanel = $('<div>')
      .addClass('info-panel')
      .text(menu[i].info)
      .hide()
      .appendTo('#menu');
  }

  $('.menu-item').hover(function() {}, function() {
    $(this).children('.info').css('opacity', 0);
  });

  $('.info').on('click', function(e) {
    e.stopPropagation();
    if (!$(this).parent().next('.info-panel').is(':visible')) {
      $('.menu-item').not($(this).parent()).slideUp(() => {
        $(this).parent().next('.info-panel').slideDown();
      });
    }
    else {
      $(this).parent().next('.info-panel').slideUp();
    }

  });
}

function titleClicked() {
  $('.instruction').slideUp();
  $('#message').slideUp();
  $('#title').removeClass('active');
  $('#game').slideUp(() => {
    $('.menu-item').slideDown();
    $('#author').slideDown();
    $('.menu-item')
      .addClass('active')
      .on('click', menuClicked);
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

    case '1D':
      chess = new OneDee();
      break;

    case 'DRAUGHTS':
      chess = new Draughts();
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

  $(`#${$(this).data('game')}`).children('.info').css('opacity', 1);

}