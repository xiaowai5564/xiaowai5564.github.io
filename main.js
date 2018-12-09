version = '1.0.0'

function hasServiceWorker(){
    return 'serviceWorker' in navigator;
}

function hasPushManager(){
    return 'PushManager' in window;
}


/* 注册serveice worker 通知浏览器，Service Worker 线程的 javaScript 文件位于什么地方*/

function registerServiceWorker(){
    if(hasServiceWorker()){
        // window.addEventListener('load',() => {
            return navigator.serviceWorker.register('/example_sw.js')
                .then((registration) => { 
                    console.log(`service worker register successful, ${registration}`, registration);
                    if(localStorage.getItem('v') !== version){
                        registration.update().then(()=>{
                            localStorage.setItem('v',version)
                        })
                    }
                    return registration;
                })
                .catch((err) => { console.log(`service worker register failed, ${err}`)});

               
        // })
    }
}

function pushManagerNotice(){
    if(hasPushManager()){
        let p = new Promise((resolve, reject) => {
            const permissionPromise = Notification.requestPermission(result => {
                resolve(result);
            })
            if (permissionPromise) {
                permissionPromise.then(resolve);
            }
        }).then(result => {
            if (result === 'granted') {
                execute();
            }
            else {
                console.log('no permission');
            }
        })
    }
}

function execute(){
    registerServiceWorker()
    // registerServiceWorker().then(registration => {
    //     registration.showNotification('Simple Title', {
    //         body: 'Simple piece of body text.\nSecond line of body text :)'
    //     })
    // })
}

(function initPage(){
    window.addEventListener('load', () => { 
        pushManagerNotice();
    })

    window.addEventListener('beforeinstallprompt', function (e) {
        debugger;
        // e.preventDefault();
        // return false;
    });
    
})()
