// pwa работает ?
// показать кнопку "скачать" - скрыть лоадер : подождать или вывести " увы "
// нажал загрузить - скрыть кнопку "скачать", показать загрузку
// скрыть загрузку - показать "открыть"
// подписать пользователя в фб.


// Registering Service Worker
if('serviceWorker' in navigator) {
    console.log('Registering serviceWorker');
	navigator.serviceWorker.register('sw.js');
};

// // Requesting permission for Notifications after clicking on the button
// var button = document.getElementById("notifications");
// button.addEventListener('click', function(e) {
// 	Notification.requestPermission().then(function(result) {
// 		if(result === 'granted') {
// 			randomNotification();
// 		}
// 	});
// });

// // Setting up random Notification
// function randomNotification() {
// 	var randomItem = Math.floor(Math.random()*games.length);
// 	var notifTitle = games[randomItem].name;
// 	var notifBody = 'Created by '+games[randomItem].author+'.';
// 	var notifImg = 'data/img/'+games[randomItem].slug+'.jpg';
// 	var options = {
// 		body: notifBody,
// 		icon: notifImg
// 	}
// 	var notif = new Notification(notifTitle, options);
// 	setTimeout(randomNotification, 30000);
// };


if( 'undefined' === typeof window){
	console.log("oneSignal");
	importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');
}

if('serviceWorker' in navigator) {
	console.log('serviceWorker');
	navigator.serviceWorker
			 .register('sw.js')
			 .then(function() { console.log('Service Worker Registered'); });
  }

let deferredPrompt;
const bntInst = document.querySelector('.menu-buttons');
const bntLoad = document.querySelector('.menu-buttons-loader');
const bntDow  = document.querySelector('.install-loading');

window.addEventListener('beforeinstallprompt', (e) => {
  console.log("beforeinstallprompt");
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  bntInst.classList.add("hide");
  bntLoad.classList.remove("mystyle");

  bntInst.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    bntLoad.classList.add("hide");
    bntDow.classList.remove("mystyle");
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});


