"use strict";

/*****************

Chesses 2
Pippin Barr

Another eight variations of chess, following on from Chesses.

******************/

// Track whether the user is on mobile or not (we'll find out via events)
let MOBILE = false;

// The basic information about the game to display as part of the menu
const TITLE = `CHESSES2`;
const AUTHOR = `BY <a href="https://www.pippinbarr.com/" target="_blank">&nbsp;PIPPIN BARR</a>`;

// The game itself (as represented by BaseChess and its children)
let chess;
// The menu data
let menu = [{
    title: "SAMSARA",
    class: Samsara
  },
  {
    title: "REVERSAL",
    class: Reversal
  },
  {
    title: "FOG",
    class: Fog
  },
  {
    title: "XR",
    info: "Use this virtual board to play cross-reality chess! Orient your device screen up and place appropriately sized chess pieces in the standard opening position!",
    class: XR
  },
  {
    title: "LEWITT",
    info: `An homage to <a href="https://en.wikipedia.org/wiki/Sol_LeWitt">Sol LeWitt</a>'s <a href="https://en.wikipedia.org/wiki/Sol_LeWitt#Wall_drawings">wall drawings</a>.`,
    class: LeWitt
  },
  {
    title: "MUSICAL",
    class: Musical
  },
  {
    title: "3D",
    class: ThreeDee
  },
  {
    title: "CHECK-RS",
    info: "Checkers-style capturing only. Knights, being non-linear, cannot capture anything. Win by capturing the opponent's king.",
    class: Draughts
  },
];

$(document).ready(chessesSetup);

// Do the work of setting up and displaying the menu
function chessesSetup() {

  $('#title').text(`${TITLE}`)
  $('#author').html(`${AUTHOR}`)

  // Sort the menu alphabetically (nice that you can compare strings like this)
  menu.sort((a, b) => a.title < b.title ? -1 : 1);

  // Go through the menu data and create menu items and info icons
  for (let i = 0; i < menu.length; i++) {
    let $menuItem = $('<div>')
      .addClass('menu-item active')
      .attr('id', menu[i].title)
      .html(`${menu[i].title}`)
      .data('game', menu[i].title)
      .data('info', menu[i].info)
      .data('index', i)
      .on('click', menuClicked) // Click event for desktop
      .on('touchstart', menuClicked) // Touch event for mobile
      .appendTo('#menu');
    // Info icon will be positioned to the right of the title if needed
    let $infoSymbol = $('<span class="info">ⓘ</span>');
    $menuItem.append($infoSymbol);
  }

  // The info panel is used to display extra information about specific games
  const $infoPanel = $('<div>')
    .addClass('info-panel')
    .appendTo('#game')

  // The info text is displayed inside the info panel
  const $infoText = $('<div>')
    .addClass('info-text')
    .html("DRAUGHTS<p>What is this?</p>")
    .appendTo($infoPanel);
}

// Handles returning to the menu when you click the title
function titleClicked() {
  // Tell the currently active version of the game to quit
  chess.quit();

  // Slide up all the things we don't want to see on the main menu
  $('.instruction').slideUp();
  $('#message').slideUp();
  $('.info-panel').slideUp();
  $('#fog-message').slideUp();

  // Disable the title from "quitting" when you're already there
  $('#title').removeClass('active');
  // Hide the info icon if present
  $('.info').stop().css('opacity', 0);
  $('.info').off('click');

  // Slide up the game and slide down the menu interface elements
  $('#game').slideUp(() => {
    $('.menu-item').slideDown();
    $('#author').slideDown();
    // Make all menu items active again
    $('.menu-item')
      .addClass('active')
      .on('click', menuClicked);
  });
}

// Handle a click on a specific menu item
function menuClicked(e) {

  // Use the event type to determine whether the user is on mobile or desktop
  // (We use this for the instructions for FOG)
  if (e.type === 'touchstart') MOBILE = true;
  else MOBILE = false;

  // Get the index in the menu of the chosen item
  let index = $(this).data('index');
  // Instantiate the associated class
  chess = new menu[index].class(); // Is this hideous? It works...

  // Activate the title as a quit button
  $('#title').addClass('active');
  $('#title.active').one('click', titleClicked);

  // Deactivate the menu item buttons (because one of them is being
  // used to display the title of the current game and shouldn't start a new one)
  $('.menu-item').removeClass('active');
  $('.menu-item').off('click');

  // Slide away the elements we shouldn't see, including the author
  // and all menu items not presently being played
  $('#author').slideUp();
  $.when($('.menu-item').not(`#${$(this).data('game')}`).slideUp(500, () => {
      // Once all the menu items are gone, we can slide down the game
      $('#game').slideDown(() => {
        // If there are instructions slide them down (for Fog)
        $(this).find('.instruction').slideDown();
        // If there is an info icon for this game, fade it in so they notice
        if ($(this).data('info')) {
          $(`#${$(this).data('game')} .info`).stop().animate({
            opacity: 1
          }, 1000);
        }
      });
    }))
    .then(() => {
      // Listen for click events on the info icon and display the panel if so
      $('.info').on('click', function(e) {
        // Don't interpret it as a click on anything else
        e.stopPropagation();
        // If the panel isn't visible, put in the correct info and slide it down
        if (!$('.info-panel').is(':visible')) {
          $('.info-text').html(`<p>${$(this).parent().data('info')}</p>`);
          $('.info-panel').slideDown();
        }
        // If the panel is visible, slide it back up
        else {
          $('.info-panel').slideUp();
        }
      });
    });
}