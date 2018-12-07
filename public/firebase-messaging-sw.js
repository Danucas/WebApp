
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase.js');
var config = {
    apiKey: "AIzaSyBjNyJlkNfgM3QNQYrMn6qZ5z4okXp3BTE",
    authDomain: "today-6648d.firebaseapp.com",
    databaseURL: "https://today-6648d.firebaseio.com",
    projectId: "today-6648d",
    storageBucket: "today-6648d.appspot.com",
    messagingSenderId: "775057201875"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload){
    console.log(payload);
    var data = payload;
    if(data.data.actions){
        var acts = JSON.parse(data.data.actions);
        console.log(acts);
        data.data.actions = acts;
    }

    vibrate= [30,5,60,8,90];
    data.data.vibrate = vibrate;
    data.data.renotify = true;
    data.data.color = '#FFFFFF';
    data.data.tag = 'medialuna';
    data.data.data = data.data;

    return self.registration.showNotification(data.data.title, data.data);
});

self.addEventListener('notificationclick', function(event) {
    var clickedNotification = event.notification;
    console.log(event);
    var promiseChain = clients.openWindow(event.notification.data.url);
    if(!event.action){
        console.log('Opening WebApp');
        clickedNotification.close();
        event.waitUntil(promiseChain);
        return;
    }else{
        switch(event.action){
        case 'opt1':
            console.log('opt1');
            clickedNotification.close();
            promiseChain = clients.openWindow(event.notification.data.url1);
            event.waitUntil(promiseChain);
            
            break;
        case 'opt2':
            console.log('opt2');
            clickedNotification.close();
            promiseChain = clients.openWindow(event.notification.data.url2);
            event.waitUntil(promiseChain);
            break;
        }

    }
    
  
  
});

