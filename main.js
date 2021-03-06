// pwa работает ? показать кнопку "установить" : показать кнопку "открыть" через 10c!
// нажать кнопку "установить" ? показать загрузку * : показать кнопку "установить"
// * нажал "установить" - попросить подписаться на пуши
// * запустить анимацию
// * показать кнопку "открыть"
// подписать пользователя на пуши.

let deferredPrompt;
let timeout; 
let clicked = false;
let isPwa = localStorage.getItem('isPwa') || false;
const bntInst = $('.menu-buttons');
const bntOpen = $('.menu-buttons-open');
const bntLoad = $('.menu-buttons-loader');
const bntDow  = $('.install-loading');

function hideShowBlocks(el){
  // clicked - костыль для bntInst.on('click',... )
  if(!clicked) {
    $('.menu').addClass("hide");
    el.removeClass("hide");
  } 
  
}

hideShowBlocks(bntLoad);

window.addEventListener('DOMContentLoaded', () => {
  
  // Установленно приложение ? показать кнопку :
  if (isPwa) {
    hideShowBlocks(bntOpen);
  }
  
  // Клик на кнопку открыть 
  $('.menu-buttons-open').click(function() {
    window.open( "/pwa.html", "_blank"); 
  });
});

// показать кнопку, если нету события beforeinstallprompt (BIP) для айфонов и мозилы
window.addEventListener('load', (event) => {
  timeout = setTimeout(checkEventBIP, 10000);
});

function checkEventBIP() {
  let brSupportPwa = localStorage.getItem('browserSupportPwa') || false;
  if (!brSupportPwa) {
    console.log("brSupportPwa false");
    hideShowBlocks(bntOpen);
  }
}

function notifyMe() {
  // Notification.requestPermission().then(function (permission) { });
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) { });
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
  
  // pwa было устновлено, но потом удалено. Скрыть кнопку "открыть", потому что остался isPwa в localStorage
  if (isPwa) {
    bntOpen.addClass("hide");
    // hideShowBlocks()
  }
  
  hideShowBlocks(bntInst);
  
  bntInst.on('click', (e) => {
    // после срабатывания события, вызывается window.addEventListener('beforeinstallprompt',...) и отрабатывает код на строке 95 и скрывает все кнопки. Добавил clicked
    hideShowBlocks(bntDow);
    clicked = true;
    // Show the prompt
    deferredPrompt.prompt();
    notifyMe();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        //анимация установки 6с
        async function asd() {
          await new Promise(resolve => setTimeout(() => resolve(progresBar()), 1));
          await new Promise(resolve => setTimeout(() => resolve(progBarFinish()), 6000));
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
          // notifyMe();
          // Вернуться возможность скрыть и показывать блоки
          clicked = false;
          hideShowBlocks(bntOpen);
        }

      } else {
        // отказ установки - вернуть кнопки
        hideShowBlocks(bntInst);
      }
      deferredPrompt = null;
    });
  });

});

window.addEventListener('appinstalled', (evt) => {
  console.log('INSTALL: Success'); 
  localStorage.setItem('isPwa', true);
});