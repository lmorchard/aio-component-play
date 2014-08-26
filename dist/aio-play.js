(function (__DATA) {

/* global __DATA */

(function () {

  var importDoc;
  if (typeof __DATA !== 'undefined') {
    var doc = document.implementation.createHTMLDocument('import');
    var meta = doc.createElement('meta');
    meta.setAttribute('charset', 'utf-8');
    doc.head.appendChild(meta);
    doc.body.innerHTML = __DATA.HTML;
    importDoc = doc;
  } else {
    var currentScript = document._currentScript || document.currentScript;
    importDoc = currentScript.ownerDocument;
  }

  var AioPlayElementPrototype = Object.create(HTMLElement.prototype);

  // Lifecycle methods

  AioPlayElementPrototype.createdCallback = function () {
    var template = importDoc.querySelector('template');

    var shadowRoot = this.createShadowRoot();
    shadowRoot.appendChild(template.content.cloneNode(true));
  };

  AioPlayElementPrototype.attachedCallback = function () {

  };

  AioPlayElementPrototype.detachedCallback = function () {

  };

  window.AioPlayElement = document.registerElement('aio-play', {
    prototype: AioPlayElementPrototype
  });

})();

})({"HTML":"<link rel=\"stylesheet\" href=\"aio-play.css\">\n<link rel=\"stylesheet\" href=\"themes/default/default.css\">\n\n<template>\n  <p>Hello world</p>\n  <p style=\"color: red\"><content></content></p>\n</template>\n"});
