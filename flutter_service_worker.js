'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "29284836ffb7ef1db77f21bb828a7687",
"/": "e91b037da9681c593dfd309bbdb6dbf0",
"main.dart.js": "8052288d71bede2e0b9ecef44f5cfa64",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "6c6b70bbd34e90713afd42c16314fb47",
"assets/AssetManifest.json": "88b2a0509cdce6d8c4a584755bebd1b7",
"assets/NOTICES": "e7bd0d1ea68cf0ebff3fe7f45b39af66",
"assets/FontManifest.json": "f4dc53989d3a932d7fb89a4e0a6c289b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "2aa350bd2aeab88b601a593f793734c0",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "2bca5ec802e40d3f4b60343e346cedde",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "5a37ae808cf9f652198acde612b5328d",
"assets/fonts/MaterialIcons-Regular.otf": "a68d2a28c526b3b070aefca4bac93d25",
"assets/assets/maps/index.html": "e91b037da9681c593dfd309bbdb6dbf0",
"assets/assets/images/timap.png": "e13f9ce9d8b9c0757c490f94c63442fc",
"assets/assets/images/alumni.png": "272ab617938e1f1c3c8f8560a5f1c87a",
"assets/assets/images/civil.png": "602177861eeaf8824f082417e9d07897",
"assets/assets/images/eic.png": "f40a86b03ada01e1ebf9d3cc8d448ac5",
"assets/assets/images/slides4.jpg": "a94c82cf77e7feb88d5ad387df6fffb1",
"assets/assets/images/helpdesk.png": "012b7b9fddd5d188efad9ac94e825bdb",
"assets/assets/images/Slider_LMTSM.jpg": "ae24e3f55ae19e9e09fcb063b43c2485",
"assets/assets/images/hostelm.jpg": "1217320743b8c9ac695d520bd94e3698",
"assets/assets/images/ece.png": "7898671ac82fee540b6edac22bff7f59",
"assets/assets/images/slides2.jpg": "10fa565e811b9284ad6731d3bf989382",
"assets/assets/images/streams.png": "abbacea5fd21e3d9ff13271d2662a09a",
"assets/assets/images/coe.png": "37965d9e4c38210c2d17dcd0e5e921b4",
"assets/assets/images/slides1.png": "0900fd8a19e37e0c4f99889e10987964",
"assets/assets/images/Line%252087.png": "67062906cc537e402db657bc5fab3c83",
"assets/assets/images/horizontal_line.png": "d5f317fa5476924eca4f5fa07cabf6b8",
"assets/assets/images/bio.png": "ebeab40f05de5701a0cd4d94e8fa91e1",
"assets/assets/images/vertical_line.png": "3d06edeb2de381a50187f43bbd85eeaa",
"assets/assets/images/slides%25203.jpg": "e43ad1c589fffbda6c6356de0b264656",
"assets/assets/images/faq.png": "c9530c4b8779b5524fbd1a5f72438edf",
"assets/assets/images/manny.jpg": "0cfe78fffe6856d76893adbf8e2564b6",
"assets/assets/images/chemical.png": "dd7f17c373b725ed77b917b1771ba0a9",
"assets/assets/images/mec.png": "c2a2d027bfe88bae16d66236bf846df8",
"assets/assets/images/Line%25201.png": "cbb4654b08fa1409132d34e60e97393f",
"assets/assets/images/tilogo.png": "5ebede6445e1088791b325d02582687c",
"assets/assets/fonts/Montserrat-Bold.ttf": "ade91f473255991f410f61857696434b",
"assets/assets/fonts/ProductSans-Bold.ttf": "a19a7b108b2e3961fc855c6ea5a6546f",
"assets/assets/fonts/ProductSans-Italic.ttf": "af05b47de35fd5a5960ad1e440a4c0c7",
"assets/assets/fonts/Montserrat-Regular.ttf": "ee6539921d713482b8ccd4d0d23961bb",
"assets/assets/fonts/ProductSans-Regular.ttf": "b61c0ab33a818a0162f3e868babcef4b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a 'reload' param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'reload'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
