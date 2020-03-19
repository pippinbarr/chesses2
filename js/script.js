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
      // info: "Pieces go through the great chain of existence as they are moved."
    },
    {
      title: "REVERSAL",
      // info: "Pieces change sides with every move."
    },
    {
      title: "FOG",
      info: "Each piece can see the square adjacent to it, as well as any squares it attacks. The view each player has is the combination of the views of all pieces. Take turns to play your moves and look away when your opponent is playing."
    },
    {
      title: "XR",
      info: "Cross-reality is the hottest reality! Get hyped about this cross-reality chess application! Use real chess pieces on a virtual board! Tip over your laptop, monitor, phone, or tablet and play this exciting hybrid game now!"
    },
    {
      title: "LEWITT",
      info: "A drawing is built up through the movements of your chess pieces on the board. When the game ends, you can download an image of the drawing you have made together. Created in the spirit of Sol LeWitt's wall drawings."
    },
    {
      title: "MUSICAL",
      // info: "A melody is played using the current game position as its score."
    },
    {
      title: "3D",
      // info: "Chess has finally entered the third dimension!"
    },
    {
      title: "DRAUGHTS",
      info: "Pieces can only capture adjacent pieces by jumping over them to a clear space, as in draughts or checkers. Because they do not move linearly, knights cannot capture anything at all. Win by forcing the opposing king into a situation where it cannot avoid being jumped."
    },
  ];
  menu.sort((a, b) => a.title < b.title ? -1 : 1);

  for (let i = 0; i < menu.length; i++) {
    let $menuItem = $('<div>')
      .addClass('menu-item active')
      .attr('id', menu[i].title)
      .html(`${menu[i].title}<span class="info">ⓘ</span>`)
      .data('game', menu[i].title)
      .data('info', menu[i].info)
      .on('click', menuClicked)
      .appendTo('#menu');
  }

  let $infoPanel = $('<div>')
    .addClass('info-panel')
    .appendTo('#game')

  let $infoText = $('<div>')
    .addClass('info-text')
    .html("DRAUGHTS<p>What is this?</p>")
    .appendTo($infoPanel);

  $('.info').on('click', function(e) {
    e.stopPropagation();
    if (!$('.info-panel').is(':visible')) {
      $('.info-text').html(`<p>${$(this).parent().data('info')}</p>`);
      $('.info-panel').slideDown();
    }
    else {
      $('.info-panel').slideUp();
    }
  });
}

function titleClicked() {
  $('.instruction').slideUp();
  $('#message').slideUp();
  $('#title').removeClass('active');
  $('.info-panel').slideUp();
  $('.info').stop().css('opacity', 0);

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
      if ($(this).data('info')) {
        $(`#${$(this).data('game')} .info`).stop().animate({
          opacity: 1
        }, 1000);
      }
    });
  });
  $('#message').slideUp();



}