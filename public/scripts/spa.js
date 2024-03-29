/**
 * @param {string} url
 * @param {string} title
 */
function navigateToPage(url, title) {
  console.log(`Navigating to ${url}...`);
  clearSubscriptions();
  $('#spaContainer').html('');
  $.ajax({
    url: url,
    cache: false,
    async: true
  }).done(function (html) {
    $('title').text(title);
    $('#spaContainer').html(html);
    if (typeof componentHandler !== 'undefined') {
      componentHandler.upgradeDom();
    }
  }).fail(function (jqXHR) {
    $('#spaContainer').html(jqXHR.responseText);
    if (typeof componentHandler !== 'undefined') {
      componentHandler.upgradeDom();
    }
  });
}

if ("onhashchange" in window) {
  window.onhashchange = function () {
    hashChanged(window.location.hash);
  }
} else {
  let storedHash = window.location.hash;
  window.setInterval(function () {
    if (window.location.hash !== storedHash) {
      storedHash = window.location.hash;
      hashChanged(storedHash);
    }
  }, 100);
}

hashChanged(window.location.hash);

/**
 * @type {Array.<Subscription>}
 */
var subscriptions = [];

/**
 * @param {Subscription} sub
 */
function addSubscription(sub) {
  if (!subscriptions) {
    subscriptions = [];
  }
  subscriptions.push(sub);
}

function clearSubscriptions() {
  if (!subscriptions) {
    return;
  }
  for (let i = 0; i < subscriptions.length; i++) {
    let sub = subscriptions[i];
    sub.dispose();
  }
  subscriptions = [];
}