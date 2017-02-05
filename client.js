//jshint esversion: 6, -W083
var shoe = require('shoe');
var hterm = require('hterm-umdjs').hterm; 
var lib = require('hterm-umdjs').lib; 
var solarized = require('./solarized');
const apc = require('./apc');

hterm.defaultStorage = new lib.Storage.Local();
var t = new hterm.Terminal();

t.onTerminalReady = function() {
    console.log('READY');

    // connect to websocket on the server
    var stream = shoe('/pty');
    var io = t.io.push();

    io.onVTKeystroke = function(str) {
        stream.write(str);
    };
    console.log("io",io);
    console.log("term",t);

    io.sendString = function(str) {
        //console.log(str);
        // Just like a keystroke, except str was generated by the
        // terminal itself.
        // Most likely you'll do the same this as onVTKeystroke.
    };
    //t.io.print('Print a string without a newline');
    t.io.println('*** 65535 BASIC BYTES FREE ***');

    apc(stream).on('data', function (data) {
        //console.log('terminal.print,', msg);
        t.io.print(data.toString());
    });

    // See https://chromium.googlesource.com/chromiumos/platform/assets/+/95f6a2c7a984b1c09b7d66c24794ce2057144e86/chromeapps/hterm/doc/faq.txt
    t.prefs_.set('cursor-color', 'rgba(155, 255, 155, 0.5)');
    t.prefs_.set('font-size', 35);
    //t.prefs_.set('font-family', 'Monaco for Powerline');
    t.prefs_.set('font-family', 'Inconsolata');
    t.prefs_.set('cursor-blink', true);

    t.prefs_.set('enable-bold', true);
    t.prefs_.set('enable-bold-as-bright', false);

    t.prefs_.set('environment', {
      "TERM": "xterm-256color"
    });
    solarized.dark(t);

};
t.decorate(document.querySelector('#terminal'));
t.installKeyboard();

