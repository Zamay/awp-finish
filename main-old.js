// pwa работает ? показать кнопку "установить" : показать кнопку "открыть" через 10c!
// нажать кнопку "установить" ? показать загрузку * : показать кнопку "установить"
// * нажал "установить" - попросить подписаться на пуши
// * запустить анимацию
// * показать кнопку "открыть"
// подписать пользователя на пуши.



// https://www.pin-upua.com/ru/?lang=lang&st=ivqrmcth&s1=2jb7isn21ei89&s2=gamblingtest&s3=1&s4=&s5=&pc=30&options={options}&form_key={_form_key}&trId=btd5mobvjahf9n6vuuqg&popup=registration

let deferredPrompt;
let timeout;
let isPwa = localStorage.getItem('isPwa') || false;
const bntInst = $('.menu-buttons');
const bntOpen = $('.menu-buttons-open');
const bntLoad = $('.menu-buttons-loader');
const bntDow  = $('.install-loading');

window.addEventListener('DOMContentLoaded', () => {
  // let displayMode = 'browser tab';
  // if (navigator.standalone) {
  //   displayMode = 'standalone-ios';
  //   clearTimeout(timeout);
  //   showBtnOpen();
  // }
  // if (window.matchMedia('(display-mode: standalone)').matches) {
  //   displayMode = 'standalone';
  // }
  // // Log launch display mode to analytics
  // console.log('DISPLAY_MODE_LAUNCH:', displayMode);
  
  // Установленное приложение ?
  if (isPwa) {
    showBtnOpen();
  }
  
  // Клик на  rнопку открыть 
  $('.menu-buttons-open').click(function() {

    bntLoad.addClass("hide");
    bntInst.addClass("hide");

    $("#pwaLanding").addClass("hide");
    $("#iframe").removeClass("hide");
    window.location.href = '/pwa.html';
    // $("#iframe").attr('src', $("#iframe").attr('data-src'));
  });
});

function notifyMe() {
  // Otherwise, we need to ask the user for permission
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) { });
  }
}

function showBtnOpen () {
    bntLoad.addClass("hide");
    bntInst.addClass("hide");
    bntOpen.removeClass("hide");
}

// показать кнопку, если нету события beforeinstallprompt (BIP) для айфонов и мозилы
window.addEventListener('load', (event) => {
  timeout = setTimeout(checkEventBIP, 10000);
});

function checkEventBIP() {
  let brSupportPwa = localStorage.getItem('browserSupportPwa') || false;
  if (!brSupportPwa) {
    console.log("brSupportPwa false");
    showBtnOpen();
  }
}

// Registering Service Worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker
     .register('sw2.js')
     .then(function() { console.log('Service Worker Registered'); });
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log("beforeinstallprompt");
  // не надо показывать кнопку "открыть" до установки 
  localStorage.setItem('browserSupportPwa', true);
  clearTimeout(timeout);
  
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  
  // pwa было устновлено, но потом удалено. Скрыть кнопку "открыть"
  if (isPwa) {
    bntOpen.addClass("hide");
  }
  
  bntLoad.addClass("hide");
  bntInst.removeClass("hide");

  bntInst.on('click', (e) => {
    // hide our user interface that shows our A2HS button
    bntInst.addClass("hide");
    bntDow.removeClass("hide");
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        //анимация установки 6с
        async function asd() {
          await new Promise(resolve => setTimeout(() => resolve(progresBar()), 1));
          await new Promise(resolve => setTimeout(() => resolve(progBarFinish()), 6000))
        }
        
        asd();

        function progresBar() {
          var width = 1;
          var id = setInterval(frame, 58);
          function frame() {
            if (width >= 100) {
              clearInterval(id);
            } else {
              width++;
              $('.runner').width(width + '%');
            }
          }
        }

        // после установки 
        function progBarFinish() {
          // Спросить подписаться на пуши
          notifyMe();
          
          bntDow.addClass("hide");
          bntInst.addClass("hide");
          bntOpen.removeClass("hide");
        }

      } else {
        // отказ установки
        bntDow.addClass("hide");
        bntInst.removeClass("hide");
      }
      deferredPrompt = null;
    });
  });
});

window.addEventListener('appinstalled', (evt) => {
  console.log('INSTALL: Success'); 
  localStorage.setItem('isPwa', true);
    
});