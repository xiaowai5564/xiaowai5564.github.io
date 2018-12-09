
let fileToCache = [
    '/',
    '/index.html',
    '/main.css',
    '/main.js',
    '/img/xxx.jpg'
];

var chachename = 'test-cache-v1';
/* 监听install 事件 */

this.addEventListener('install',(event)=> {
    /* ExtendableEvent.waitUntil() 方法会确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成。 */
    event.waitUntil(
        /* 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间 */
        caches.open(chachename)
        .then((cache) => {
            /* 静态资源缓存 */
            return cache.addAll(fileToCache)
        })
        .then(()=> this.skipWaiting())
    )
});

this.addEventListener('active',(event)=>{
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheList)=>{
                return Promise.all(
                    cacheList.map((cacheName) => {
                        if(cacheName !== chachename){
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
        ])
    )
})
/* 动态资源缓存 */
this.addEventListener('fetch', (event) => {
    // event.respondWith(
    //     caches.match(event.request)
    //         .then((response) => {
    //             if (response) return response;
    //             var request = event.request.clone();
    //             return fetch(request).then((httpRes) => {
    //                 if (!httpRes || !httpRes !== 200) {
    //                     return httpRes
    //                 }

    //                 var responseClone = httpRes.clone();
    //                 caches.open(chachename)
    //                     .then((cahce) => {
    //                         cache.put(event.request, responseClone)
    //                     })

    //                 return httpRes;


    //             })
    //         })
    // )
});

/*
 on install 的优点是第二次访问即可离线，缺点是需要将需要缓存的 URL 在编译时插入到脚本中，增加代码量和降低可维护性；

on fetch 的优点是无需更改编译过程，也不会产生额外的流量，缺点是需要多一次访问才能离线可用。 */