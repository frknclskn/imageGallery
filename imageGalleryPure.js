class ImageGalleryPure {
    /**
     * 
     * @param {any} options
     * id:target element id
     * data:your src paths or base64 data
     * isBase64:if your image format base64 ? this should be true,
     * texts:{
     *  play: "Play",
        pause: "Pause",
        close: "Close",
        onceEvery: "Once every "
     * },
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
     */
    set(options) {
        if (!options) {
            alert(`Options value is should not null.`);
            return;
        }

        var targetEl = document.getElementById(options.id);
        if (targetEl == null) {
            alert(`Target element has not exist. Element id:${options.id}`);
            return;
        }

        this.fillThumbnailsOptions(options);

        targetEl.classList.add("sx-image-gallery-parent");

        var html = `<div></div><div class="sx-image-gallery ${options.versionId}">`;
        var footerHtml = ``;

        for (var i = 0; i < options.data.length; i++) {
            var data = options.data[i];

            html += `<div class="sx-image-gallery-thumbnail" img-id="${data.id}" img-index="${data.index}">
                        <img src="${data.value}" img-id="${data.id}" img-index="${data.index}" style="height:${options.thumbnail.height};width:${options.thumbnail.width};object-fit:${options.thumbnail.objectFit};background:${options.thumbnail.background};"/>
                    </div>`;

            footerHtml += `<div class="sx-image-gallery-thumbnail" img-id="${data.id}" img-index="${data.index}">
                        <img src="${data.value}" img-id="${data.id}" img-index="${data.index}" style="height:${options.footer.height};width:${options.footer.width};object-fit:${options.footer.objectFit};background:${options.footer.background};"/>
                    </div>`;
        }

        html += `<div class="sx-image-gallery-modal">
                    <div class="sx-image-gallery-modal-header">
                        <div class="sx-image-gallery-header-paginator">  5/${options.data.length}</div>
                            <div class="sx-header-action">
                                <span>${options.texts.onceEvery} <strong class="sx-header-action-intervalValue">${options.intervalValue}</strong> ms</span>
                                <input type="range" class="sx-header-action-range" min="10" max="500" value="${options.intervalValue}">
                                <span class="sx-header-action-play" title="${options.texts.play}">&#x25B6;</span>
                                <span class="sx-header-action-pause" title="${options.texts.pause}">&#x25A0;</span>
                                <span class="sx-header-action-close" title="${options.texts.close}">&#10006;</span>
                            </div>
                    </div>
                    <div class="sx-image-gallery-modal-body">
                        <div class="sx-image-gallery-modal-action sx-body-action-previous" title="${options.texts.previous}">&#8592</div>
                        <img src="" />
                        <div class="sx-image-gallery-modal-action sx-body-action-next" title="${options.texts.next}">&#8594</div>
                    </div>
                    <div class="sx-image-gallery-modal-footer">
                        <div></div>
                        <div style="display: flex;flex-direction: row;flex-wrap: nowrap;">${footerHtml}</div>
                        <div></div>
                    </div>
                </div>`;
        html += `</div><div></div>`;
        targetEl.innerHTML = html;

        options.modal = document.querySelector(`${options.versionSelector} .sx-image-gallery-modal`);

        document.querySelectorAll(`${options.versionSelector} .sx-image-gallery-thumbnail`).forEach(el => {
            el.onclick = (e) => {
                this.setShowingData(e.target.getAttribute("img-id"), options);
            }
        });

        document.querySelector(`${options.versionSelector} .sx-header-action-range`).onchange = (e) => {
            options.intervalValue = e.target.value;
            document.querySelector(`${options.versionSelector} .sx-header-action-intervalValue`).innerHTML = options.intervalValue;
            if (options.interval) {
                this.startInterval(options);
            }
        }

        document.querySelector(`${options.versionSelector} .sx-header-action-close`).onclick = (e) => {
            options.modal.style.display = "none";
            document.querySelector("body").classList.remove("image-gallery-active");
            this.endInterval(options);
        }

        document.querySelector(`${options.versionSelector} .sx-header-action-play`).onclick = (e) => {
            this.startInterval(options);
        }

        document.querySelector(`${options.versionSelector} .sx-header-action-pause`).onclick = (e) => {
            this.endInterval(options);
        }

        document.querySelector(`${options.versionSelector} .sx-body-action-previous`).onclick = (e) => {
            this.setShowingData(null, options, false);
        }

        document.querySelector(`${options.versionSelector} .sx-body-action-next`).onclick = (e) => {
            this.setShowingData(null, options, true);
        }

        document.querySelector(`${options.versionSelector} .sx-image-gallery-modal`).onmousewheel = (e) => {
            this.setShowingData(null, options, e.deltaY > 0);
        }
    }
    endInterval(options) {
        if (options.interval) {
            clearInterval(options.interval);
            options.interval = null;
        }
    }
    startInterval(options) {
        this.endInterval(options);
        options.interval = setInterval(() => {
            this.setShowingData(null, options, true);
        }, options.intervalValue);
    }
    setShowingData(imageId, options, isNext = null) {
        if (isNext == true) {
            imageId = options.data[options.showingOnModal.index + 1];
            if (!imageId)
                imageId = options.data[0];
        } else if (isNext == false) {
            imageId = options.data[options.showingOnModal.index - 1];
            if (!imageId)
                imageId = options.data[options.data.length - 1];
        }
        if (typeof (imageId) == "object") {
            imageId = imageId.id;
        }

        var target = options.data.find(p => p.id == imageId);
        options.modal.querySelector("* img").src = target.value;
        options.modal.querySelector("* .sx-image-gallery-header-paginator").innerHTML = `${target.index + 1}/${options.data.length}`;
        options.modal.style.display = "flex";
        options.showingOnModal = target;
        options.modal.querySelectorAll("* .sx-image-gallery-thumbnail").forEach(el => {
            if (el.getAttribute("img-id") == imageId) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });

        options.modal.querySelector(".sx-image-gallery-modal-footer").scrollLeft = document.querySelector(".sx-image-gallery-modal-footer div.active").offsetLeft;
        document.querySelector("body").classList.add("image-gallery-active");

    }
    fillThumbnailsOptions(options) {

        options.versionId = "versionId_" + new Date().getTime();
        options.versionSelector = `.sx-image-gallery.${options.versionId}`;

        options.intervalValue = 100;

        //#region data settigns.
        if (options.isBase64) {
            var newData = [];
            for (var i = 0; i < options.data.length; i++) {
                newData.push({
                    id: new Date().getTime() + "_" + i,
                    value: `data:image/jpeg;base64,` + options.data[i],
                    index: i
                });
            }
            options.data = newData;
        }
        //#endregion

        //#region thumbnail width&height
        if (!options.thumbnail)
            options.thumbnail = {};
        if (!options.thumbnail.height)
            options.thumbnail.height = "64px";
        if (!options.thumbnail.width)
            options.thumbnail.width = "64px";
        if (!options.thumbnail.objectFit)
            options.thumbnail.objectFit = "contain";
        if (!options.thumbnail.background)
            options.thumbnail.background = "black";
        //#endregion

        //#region footer width&height
        if (!options.footer)
            options.footer = {};
        if (!options.footer.height)
            options.footer.height = "64px";
        if (!options.footer.width)
            options.footer.width = "64px";
        if (!options.footer.objectFit)
            options.footer.objectFit = "contain";
        if (!options.footer.background)
            options.footer.background = "black";
        //#endregion

        //#region texts
        if (!options.texts)
            options.texts = {};
        if (!options.texts.close)
            options.texts.close = "Close";
        if (!options.texts.play)
            options.texts.play = "Play";
        if (!options.texts.pause)
            options.texts.pause = "Pause";
        if (!options.texts.onceEvery)
            options.texts.onceEvery = "Once every ";
        if (!options.texts.previous)
            options.texts.previous = "Previous";
        if (!options.texts.next)
            options.texts.next = "Next";
        //#endregion
    }
}

var imageGalleryPure = new ImageGalleryPure();

export { imageGalleryPure }