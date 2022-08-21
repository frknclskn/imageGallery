
<p>First step is;</p>
<pre><code>import { imageGalleryPure } from '../imageGalleryPure.js';
@import 'imageGalleryPure/imageGalleryPure.css';</code></pre>
<p>and decide your div;</p>
<pre><code>< div id="image-gallery"></ div></code></pre>
<p>and use set method like this;</p>
<pre>imageGalleryPure.set({
    id: "image-gallery",
    data: Your array [] base64 format for this sample,
    isBase64: true,
    texts: {
        play: "Play",
        pause: "Stop",
        close: "Close",
        onceEvery: "Once every "
    },
    thumbnail: {
        height: "64px",
        width: "64px",
        objectFit: 'contain',
        background: 'black'
    },
    footer: {
        height: "64px",
        width: "64px",
        objectFit: 'contain',
        background: 'black'
    }
});</pre>

<p>or visited this sample folder, and open index.html with chrome.exe(disabled-web-security)</p>
<pre>
Win+R
chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
</pre>