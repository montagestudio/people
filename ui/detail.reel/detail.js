/**
 * @module ui/detail.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Detail
 * @extends Component
 */
exports.Detail = Component.specialize(/** @lends Detail# */ {
    constructor: {
        value: function Detail() {
            this.super();
        }
    },

    show: {
        value: function (startElement) {
            if(window.webkitConvertPointFromNodeToPage) {
                var startWidth = startElement.offsetWidth;
                var startHeight = startElement.offsetHeight;
                var endWidth = document.documentElement.clientWidth;
                var endHeight = document.documentElement.clientHeight;
                var startTopLeft = window.webkitConvertPointFromNodeToPage(startElement, new window.WebKitPoint(0, 0));
                var startBottomRight = window.webkitConvertPointFromNodeToPage(startElement, new window.WebKitPoint(startWidth, startHeight));
                var endBottomRight = new window.WebKitPoint(endWidth, endHeight);

                this.startX = startTopLeft.x + startWidth/2 - endBottomRight.x/2;
                this.startY = startTopLeft.y + startHeight/2 - endBottomRight.y/2;
                this.scaleX = (startBottomRight.x-startTopLeft.x)/endBottomRight.x;
                this.scaleY = (startBottomRight.y-startTopLeft.y)/endBottomRight.y;
            } else {
                this.startX = 0;
                this.startY = 0;
                this.scaleX = 0.1;
                this.scaleY = 0.1;
            }
            this._startElement = startElement;
            this.needsDraw = true;

        }
    },

    handleCloseAction: {
        value: function () {
            this.templateObjects.overlay.hide();

            this.dispatchEventNamed("closeDetail", true, true, {
                postController: this.postController
            });
        }
    },

    willDraw: {
        value: function () {
            if(this._startElement) {
                this._clonedElement = this._copyNodes(this._startElement);
                // only do it once
                this._startElement = null;
            }
        }
    },

    draw: {
        value: function () {
            var detailOverlay = this.detailOverlay;
            if (this.scaleX !== null) {
                this.backElement.innerHTML = "";
                this.backElement.appendChild(this._clonedElement);
                this.backElement.style.webkitTransform = ["scale(",1/this.scaleX,", ",1/this.scaleY,") rotateY(-180deg)"].join('');
                this.backElement.style.marginLeft = (90 * 1/this.scaleX) + "px";
                detailOverlay.style.webkitTransform = ["translate3d(",this.startX,"px,",this.startY,"px, 0px) rotateY(180deg) scale(",this.scaleX,",",this.scaleY ,")"].join('');
                this.templateObjects.overlay.show();
                this.scaleX = null;
            } else if(this._startAnimation) {
                detailOverlay.style.webkitTransform = "";
                this._startAnimation = false;
            }
        }
    },

    didShowOverlay: {
        value: function () {
            this._startAnimation = true;
            this.needsDraw = true;
        }
    },

    _startAnimation: {
        value: false
    },

    _startElement: {
        value: null
    },

    _clonedElement: {
        value: null
    },

    startX: {
        value: null
    },

    startY: {
        value: null
    },

    scaleX: {
        value: null
    },

    scaleY: {
        value: null
    },

    postController: {
        value: null
    },

    _copyNodes: {
        value: function (element) {
            var clonedElement = element.cloneNode(true);
            function copyCss(fromElement, toElement) {
                toElement.style.cssText = getComputedStyle(fromElement).cssText;
                var i = 0,
                fromElementLength = fromElement.children.length;
                for (i; i < fromElementLength; i++) {
                    copyCss(fromElement.children[i], toElement.children[i]);
                }
            }
            copyCss(element, clonedElement);
            return clonedElement;
        }
    }


});
