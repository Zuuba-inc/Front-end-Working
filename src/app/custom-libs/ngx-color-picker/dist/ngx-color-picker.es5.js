import { Directive, Input, Output, HostListener, ElementRef, EventEmitter, Injectable, Component, ViewEncapsulation, ChangeDetectorRef, ViewChild, ReflectiveInjector, Injector, ComponentFactoryResolver, ApplicationRef, ViewContainerRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { htmlTemplate } from '../html-template';
import { cpCss } from '../css-template';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var ColorFormats = {
    HEX: 0,
    RGBA: 1,
    HSLA: 2,
};
ColorFormats[ColorFormats.HEX] = 'HEX';
ColorFormats[ColorFormats.RGBA] = 'RGBA';
ColorFormats[ColorFormats.HSLA] = 'HSLA';
var Cmyk = /** @class */ (function () {
    function Cmyk(c, m, y, k) {
        this.c = c;
        this.m = m;
        this.y = y;
        this.k = k;
    }
    return Cmyk;
}());
var Hsla = /** @class */ (function () {
    function Hsla(h, s, l, a) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }
    return Hsla;
}());
var Hsva = /** @class */ (function () {
    function Hsva(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
    return Hsva;
}());
var Rgba = /** @class */ (function () {
    function Rgba(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    return Rgba;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @return {?}
 */
function detectIE() {
    /** @type {?} */
    var ua = '';
    if (typeof navigator !== 'undefined') {
        ua = navigator.userAgent.toLowerCase();
    }
    /** @type {?} */
    var msie = ua.indexOf('msie ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    // Other browser
    return false;
}
var TextDirective = /** @class */ (function () {
    function TextDirective() {
        this.newValue = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    TextDirective.prototype.inputChange = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            /** @type {?} */
            var value = event.target.value;
            if (this.rg === undefined) {
                this.newValue.emit(value);
            }
            else {
                /** @type {?} */
                var numeric = parseFloat(value);
                this.newValue.emit({ v: numeric, rg: this.rg });
            }
        };
    TextDirective.decorators = [
        {
            type: Directive, args: [{
                selector: '[text]'
            },]
        }
    ];
    TextDirective.propDecorators = {
        rg: [{ type: Input }],
        text: [{ type: Input }],
        newValue: [{ type: Output }],
        inputChange: [{ type: HostListener, args: ['input', ['$event'],] }]
    };
    return TextDirective;
}());
var SliderDirective = /** @class */ (function () {
    function SliderDirective(elRef) {
        var _this = this;
        this.elRef = elRef;
        this.dragEnd = new EventEmitter();
        this.dragStart = new EventEmitter();
        this.newValue = new EventEmitter();
        this.listenerMove = function (event) { return _this.move(event); };
        this.listenerStop = function () { return _this.stop(); };
    }
    /**
     * @param {?} event
     * @return {?}
     */
    SliderDirective.prototype.mouseDown = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            this.start(event);
        };
    /**
     * @param {?} event
     * @return {?}
     */
    SliderDirective.prototype.touchStart = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            this.start(event);
        };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    SliderDirective.prototype.move = /**
     * @private
     * @param {?} event
     * @return {?}
     */
        function (event) {
            event.preventDefault();
            this.setCursor(event);
        };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    SliderDirective.prototype.start = /**
     * @private
     * @param {?} event
     * @return {?}
     */
        function (event) {
            this.setCursor(event);
            event.stopPropagation();
            document.addEventListener('mouseup', this.listenerStop);
            document.addEventListener('touchend', this.listenerStop);
            document.addEventListener('mousemove', this.listenerMove);
            document.addEventListener('touchmove', this.listenerMove);
            this.dragStart.emit();
        };
    /**
     * @private
     * @return {?}
     */
    SliderDirective.prototype.stop = /**
     * @private
     * @return {?}
     */
        function () {
            document.removeEventListener('mouseup', this.listenerStop);
            document.removeEventListener('touchend', this.listenerStop);
            document.removeEventListener('mousemove', this.listenerMove);
            document.removeEventListener('touchmove', this.listenerMove);
            this.dragEnd.emit();
        };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    SliderDirective.prototype.getX = /**
     * @private
     * @param {?} event
     * @return {?}
     */
        function (event) {
            /** @type {?} */
            var position = this.elRef.nativeElement.getBoundingClientRect();
            /** @type {?} */
            var pageX = (event.pageX !== undefined) ? event.pageX : event.touches[0].pageX;
            return pageX - position.left - window.pageXOffset;
        };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    SliderDirective.prototype.getY = /**
     * @private
     * @param {?} event
     * @return {?}
     */
        function (event) {
            /** @type {?} */
            var position = this.elRef.nativeElement.getBoundingClientRect();
            /** @type {?} */
            var pageY = (event.pageY !== undefined) ? event.pageY : event.touches[0].pageY;
            return pageY - position.top - window.pageYOffset;
        };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    SliderDirective.prototype.setCursor = /**
     * @private
     * @param {?} event
     * @return {?}
     */
        function (event) {
            /** @type {?} */
            var width = this.elRef.nativeElement.offsetWidth;
            /** @type {?} */
            var height = this.elRef.nativeElement.offsetHeight;
            /** @type {?} */
            var x = Math.max(0, Math.min(this.getX(event), width));
            /** @type {?} */
            var y = Math.max(0, Math.min(this.getY(event), height));
            if (this.rgX !== undefined && this.rgY !== undefined) {
                this.newValue.emit({ s: x / width, v: (1 - y / height), rgX: this.rgX, rgY: this.rgY });
            }
            else if (this.rgX === undefined && this.rgY !== undefined) {
                this.newValue.emit({ v: y / height, rgY: this.rgY });
            }
            else if (this.rgX !== undefined && this.rgY === undefined) {
                this.newValue.emit({ v: x / width, rgX: this.rgX });
            }
        };
    SliderDirective.decorators = [
        {
            type: Directive, args: [{
                selector: '[slider]'
            },]
        }
    ];
    /** @nocollapse */
    SliderDirective.ctorParameters = function () {
        return [
            { type: ElementRef }
        ];
    };
    SliderDirective.propDecorators = {
        rgX: [{ type: Input }],
        rgY: [{ type: Input }],
        slider: [{ type: Input }],
        dragEnd: [{ type: Output }],
        dragStart: [{ type: Output }],
        newValue: [{ type: Output }],
        mouseDown: [{ type: HostListener, args: ['mousedown', ['$event'],] }],
        touchStart: [{ type: HostListener, args: ['touchstart', ['$event'],] }]
    };
    return SliderDirective;
}());
var SliderPosition = /** @class */ (function () {
    function SliderPosition(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
    return SliderPosition;
}());
var SliderDimension = /** @class */ (function () {
    function SliderDimension(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
    return SliderDimension;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ColorPickerService = /** @class */ (function () {
    function ColorPickerService() {
        this.active = null;
    }
    /**
     * @param {?} active
     * @return {?}
     */
    ColorPickerService.prototype.setActive = /**
     * @param {?} active
     * @return {?}
     */
        function (active) {
            if (this.active && this.active !== active && this.active.cpDialogDisplay !== 'inline') {
                this.active.closeDialog();
            }
            this.active = active;
        };
    /**
     * @param {?} hsva
     * @return {?}
     */
    ColorPickerService.prototype.hsva2hsla = /**
     * @param {?} hsva
     * @return {?}
     */
        function (hsva) {
            /** @type {?} */
            var h = hsva.h;
            /** @type {?} */
            var s = hsva.s;
            /** @type {?} */
            var v = hsva.v;
            /** @type {?} */
            var a = hsva.a;
            if (v === 0) {
                return new Hsla(h, 0, 0, a);
            }
            else if (s === 0 && v === 1) {
                return new Hsla(h, 1, 1, a);
            }
            else {
                /** @type {?} */
                var l = v * (2 - s) / 2;
                return new Hsla(h, v * s / (1 - Math.abs(2 * l - 1)), l, a);
            }
        };
    /**
     * @param {?} hsla
     * @return {?}
     */
    ColorPickerService.prototype.hsla2hsva = /**
     * @param {?} hsla
     * @return {?}
     */
        function (hsla) {
            /** @type {?} */
            var h = Math.min(hsla.h, 1);
            /** @type {?} */
            var s = Math.min(hsla.s, 1);
            /** @type {?} */
            var l = Math.min(hsla.l, 1);
            /** @type {?} */
            var a = Math.min(hsla.a, 1);
            if (l === 0) {
                return new Hsva(h, 0, 0, a);
            }
            else {
                /** @type {?} */
                var v = l + s * (1 - Math.abs(2 * l - 1)) / 2;
                return new Hsva(h, 2 * (v - l) / v, v, a);
            }
        };
    /**
     * @param {?} hsva
     * @return {?}
     */
    ColorPickerService.prototype.hsvaToRgba = /**
     * @param {?} hsva
     * @return {?}
     */
        function (hsva) {
            /** @type {?} */
            var r;
            /** @type {?} */
            var g;
            /** @type {?} */
            var b;
            /** @type {?} */
            var h = hsva.h;
            /** @type {?} */
            var s = hsva.s;
            /** @type {?} */
            var v = hsva.v;
            /** @type {?} */
            var a = hsva.a;
            /** @type {?} */
            var i = Math.floor(h * 6);
            /** @type {?} */
            var f = h * 6 - i;
            /** @type {?} */
            var p = v * (1 - s);
            /** @type {?} */
            var q = v * (1 - f * s);
            /** @type {?} */
            var t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0:
                    r = v, g = t, b = p;
                    break;
                case 1:
                    r = q, g = v, b = p;
                    break;
                case 2:
                    r = p, g = v, b = t;
                    break;
                case 3:
                    r = p, g = q, b = v;
                    break;
                case 4:
                    r = t, g = p, b = v;
                    break;
                case 5:
                    r = v, g = p, b = q;
                    break;
                default:
                    r = 0, g = 0, b = 0;
            }
            return new Rgba(r, g, b, a);
        };
    /**
     * @param {?} rgba
     * @return {?}
     */
    ColorPickerService.prototype.rgbaToCmyk = /**
     * @param {?} rgba
     * @return {?}
     */
        function (rgba) {
            /** @type {?} */
            var k = 1 - Math.max(rgba.r, rgba.g, rgba.b);
            if (k === 1) {
                return new Cmyk(0, 0, 0, 1);
            }
            else {
                /** @type {?} */
                var c = (1 - rgba.r - k) / (1 - k);
                /** @type {?} */
                var m = (1 - rgba.g - k) / (1 - k);
                /** @type {?} */
                var y = (1 - rgba.b - k) / (1 - k);
                return new Cmyk(c, m, y, k);
            }
        };
    /**
     * @param {?} rgba
     * @return {?}
     */
    ColorPickerService.prototype.rgbaToHsva = /**
     * @param {?} rgba
     * @return {?}
     */
        function (rgba) {
            /** @type {?} */
            var h;
            /** @type {?} */
            var s;
            /** @type {?} */
            var r = Math.min(rgba.r, 1);
            /** @type {?} */
            var g = Math.min(rgba.g, 1);
            /** @type {?} */
            var b = Math.min(rgba.b, 1);
            /** @type {?} */
            var a = Math.min(rgba.a, 1);
            /** @type {?} */
            var max = Math.max(r, g, b);
            /** @type {?} */
            var min = Math.min(r, g, b);
            /** @type {?} */
            var v = max;
            /** @type {?} */
            var d = max - min;
            s = (max === 0) ? 0 : d / max;
            if (max === min) {
                h = 0;
            }
            else {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                    default:
                        h = 0;
                }
                h /= 6;
            }
            return new Hsva(h, s, v, a);
        };
    /**
     * @param {?} rgba
     * @param {?=} allowHex8
     * @return {?}
     */
    ColorPickerService.prototype.rgbaToHex = /**
     * @param {?} rgba
     * @param {?=} allowHex8
     * @return {?}
     */
        function (rgba, allowHex8) {
            /* tslint:disable:no-bitwise */
            /** @type {?} */
            var hex = '#' + ((1 << 24) | (rgba.r << 16) | (rgba.g << 8) | rgba.b).toString(16).substr(1);
            if (allowHex8) {
                hex += ((1 << 8) | Math.round(rgba.a * 255)).toString(16).substr(1);
            }
            /* tslint:enable:no-bitwise */
            return hex;
        };
    /**
     * @param {?} rgba
     * @return {?}
     */
    ColorPickerService.prototype.denormalizeRGBA = /**
     * @param {?} rgba
     * @return {?}
     */
        function (rgba) {
            return new Rgba(Math.round(rgba.r * 255), Math.round(rgba.g * 255), Math.round(rgba.b * 255), rgba.a);
        };
    /**
     * @param {?=} colorString
     * @param {?=} allowHex8
     * @return {?}
     */
    ColorPickerService.prototype.stringToHsva = /**
     * @param {?=} colorString
     * @param {?=} allowHex8
     * @return {?}
     */
        function (colorString, allowHex8) {
            if (colorString === void 0) { colorString = ''; }
            if (allowHex8 === void 0) { allowHex8 = false; }
            /** @type {?} */
            var hsva = null;
            colorString = (colorString || '').toLowerCase();
            /** @type {?} */
            var stringParsers = [
                {
                    re: /(rgb)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*%?,\s*(\d{1,3})\s*%?(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    parse: function (execResult) {
                        return new Rgba(parseInt(execResult[2], 10) / 255, parseInt(execResult[3], 10) / 255, parseInt(execResult[4], 10) / 255, isNaN(parseFloat(execResult[5])) ? 1 : parseFloat(execResult[5]));
                    }
                }, {
                    re: /(hsl)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    parse: function (execResult) {
                        return new Hsla(parseInt(execResult[2], 10) / 360, parseInt(execResult[3], 10) / 100, parseInt(execResult[4], 10) / 100, isNaN(parseFloat(execResult[5])) ? 1 : parseFloat(execResult[5]));
                    }
                }
            ];
            if (allowHex8) {
                stringParsers.push({
                    re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})?$/,
                    parse: function (execResult) {
                        return new Rgba(parseInt(execResult[1], 16) / 255, parseInt(execResult[2], 16) / 255, parseInt(execResult[3], 16) / 255, parseInt(execResult[4] || 'FF', 16) / 255);
                    }
                });
            }
            else {
                stringParsers.push({
                    re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/,
                    parse: function (execResult) {
                        return new Rgba(parseInt(execResult[1], 16) / 255, parseInt(execResult[2], 16) / 255, parseInt(execResult[3], 16) / 255, 1);
                    }
                });
            }
            stringParsers.push({
                re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/,
                parse: function (execResult) {
                    return new Rgba(parseInt(execResult[1] + execResult[1], 16) / 255, parseInt(execResult[2] + execResult[2], 16) / 255, parseInt(execResult[3] + execResult[3], 16) / 255, 1);
                }
            });
            for (var key in stringParsers) {
                if (stringParsers.hasOwnProperty(key)) {
                    /** @type {?} */
                    var parser = stringParsers[key];
                    /** @type {?} */
                    var match = parser.re.exec(colorString);
                    /** @type {?} */
                    var color = match && parser.parse(match);
                    if (color) {
                        if (color instanceof Rgba) {
                            hsva = this.rgbaToHsva(color);
                        }
                        else if (color instanceof Hsla) {
                            hsva = this.hsla2hsva(color);
                        }
                        return hsva;
                    }
                }
            }
            return hsva;
        };
    /**
     * @param {?} hsva
     * @param {?} outputFormat
     * @param {?} alphaChannel
     * @return {?}
     */
    ColorPickerService.prototype.outputFormat = /**
     * @param {?} hsva
     * @param {?} outputFormat
     * @param {?} alphaChannel
     * @return {?}
     */
        function (hsva, outputFormat, alphaChannel) {
            if (outputFormat === 'auto') {
                outputFormat = hsva.a < 1 ? 'rgba' : 'hex';
            }
            switch (outputFormat) {
                case 'hsla':
                    /** @type {?} */
                    var hsla = this.hsva2hsla(hsva);
                    /** @type {?} */
                    var hslaText = new Hsla(Math.round((hsla.h) * 360), Math.round(hsla.s * 100), Math.round(hsla.l * 100), Math.round(hsla.a * 100) / 100);
                    if (hsva.a < 1 || alphaChannel === 'always') {
                        return 'hsla(' + hslaText.h + ',' + hslaText.s + '%,' + hslaText.l + '%,' +
                            hslaText.a + ')';
                    }
                    else {
                        return 'hsl(' + hslaText.h + ',' + hslaText.s + '%,' + hslaText.l + '%)';
                    }
                case 'rgba':
                    /** @type {?} */
                    var rgba = this.denormalizeRGBA(this.hsvaToRgba(hsva));
                    if (hsva.a < 1 || alphaChannel === 'always') {
                        return 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' +
                            Math.round(rgba.a * 100) / 100 + ')';
                    }
                    else {
                        return 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';
                    }
                default:
                    /** @type {?} */
                    var allowHex8 = (alphaChannel === 'always' || alphaChannel === 'forced');
                    return this.rgbaToHex(this.denormalizeRGBA(this.hsvaToRgba(hsva)), allowHex8);
            }
        };
    ColorPickerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ColorPickerService.ctorParameters = function () { return []; };
    return ColorPickerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ColorPickerComponent = /** @class */ (function () {
    function ColorPickerComponent(elRef, cdRef, service) {
        this.elRef = elRef;
        this.cdRef = cdRef;
        this.service = service;
        this.isIE10 = false;
        this.dialogArrowSize = 10;
        this.dialogArrowOffset = 15;
        this.dialogInputFields = [
            ColorFormats.HEX,
            ColorFormats.RGBA,
            ColorFormats.HSLA
        ];
        this.useRootViewContainer = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerComponent.prototype.handleEsc = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            if (this.show && this.cpDialogDisplay === 'popup') {
                this.onCancelColor(event);
            }
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerComponent.prototype.handleEnter = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            if (this.show && this.cpDialogDisplay === 'popup') {
                this.onAcceptColor(event);
            }
        };
    /**
     * @return {?}
     */
    ColorPickerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
        function () {
            var _this = this;
            this.slider = new SliderPosition(0, 0, 0, 0);
            /** @type {?} */
            var hueWidth = this.hueSlider.nativeElement.offsetWidth || 140;
            /** @type {?} */
            var alphaWidth = this.alphaSlider.nativeElement.offsetWidth || 140;
            this.sliderDimMax = new SliderDimension(hueWidth, this.cpWidth, 130, alphaWidth);
            if (this.cpOutputFormat === 'rgba') {
                this.format = ColorFormats.RGBA;
            }
            else if (this.cpOutputFormat === 'hsla') {
                this.format = ColorFormats.HSLA;
            }
            else {
                this.format = ColorFormats.HEX;
            }
            this.listenerMouseDown = function (event) { _this.onMouseDown(event); };
            this.listenerResize = function () { _this.onResize(); };
            this.openDialog(this.initialColor, false);
        };
    /**
     * @return {?}
     */
    ColorPickerComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
        function () {
            this.closeDialog();
        };
    /**
     * @return {?}
     */
    ColorPickerComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
        function () {
            if (this.cpWidth !== 230 || this.cpDialogDisplay === 'inline') {
                /** @type {?} */
                var hueWidth = this.hueSlider.nativeElement.offsetWidth || 140;
                /** @type {?} */
                var alphaWidth = this.alphaSlider.nativeElement.offsetWidth || 140;
                this.sliderDimMax = new SliderDimension(hueWidth, this.cpWidth, 130, alphaWidth);
                this.updateColorPicker(false);
                this.cdRef.detectChanges();
            }
        };
        /**
     * @return {?}
     */
    ColorPickerComponent.prototype.isOutOfViewport = function (elem) {

        // Get element's bounding
        var bounding = elem.getBoundingClientRect();
    
        // Check if it's out of the viewport on each side
        var out = {};
        out.top = bounding.top < 0;
        out.left = bounding.left < 0;
        out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
        out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
        out.any = out.top || out.left || out.bottom || out.right;
        out.all = out.top && out.left && out.bottom && out.right;
        out.topV = bounding.top;
        out.leftV = bounding.left;
        out.bottomV = bounding.bottom;
        out.rightV = bounding.right;
    
        return out;
    
    };
    /**
     * @param {?} color
     * @param {?=} emit
     * @return {?}
     */
    ColorPickerComponent.prototype.openDialog = /**
     * @param {?} color
     * @param {?=} emit
     * @return {?}
     */
        function (color, emit) {
            if (emit === void 0) { emit = true; }
            this.service.setActive(this);
            console.log(this.directiveElementRef);
            if (!this.width) {
                this.cpWidth = this.directiveElementRef.nativeElement.offsetWidth;
            }
            if (!this.height) {
                this.height = 320;
            }
            this.setInitialColor(color);
            this.setColorFromString(color, emit);
            this.openColorPicker();
            // see if the elment is visible in DOM
            let cpElem = document.querySelector('.color-picker');
            let hbBox = document.querySelector('.hue-alpha');
            let isOut = this.isOutOfViewport(cpElem);
            //console.log("isOut", isOut);

            // if any of the top, left, right, bottom are out of viewport simple add scroll to style attr, else remove
            // if (isOut.top || isOut.left || isOut.bottom || isOut.right) {
            //     console.log("part of the color picker is out of viewport, add scrollbar and height to style attrbute");
            //     cpElem.classList.add("adjust-hs");
            //     hbBox.classList.add("adjust-hb-box");

            // } else {
            //     cpElem.classList.remove("adjust-hs");
            //     hbBox.classList.remove("adjust-hb-box");
            // }
        };
    /**
     * @return {?}
     */
    ColorPickerComponent.prototype.closeDialog = /**
     * @return {?}
     */
        function () {
            this.closeColorPicker();
        };
    /**
     * @param {?} instance
     * @param {?} elementRef
     * @param {?} color
     * @param {?} cpWidth
     * @param {?} cpHeight
     * @param {?} cpDialogDisplay
     * @param {?} cpFallbackColor
     * @param {?} cpColorMode
     * @param {?} cpAlphaChannel
     * @param {?} cpOutputFormat
     * @param {?} cpDisableInput
     * @param {?} cpIgnoredElements
     * @param {?} cpSaveClickOutside
     * @param {?} cpCloseClickOutside
     * @param {?} cpUseRootViewContainer
     * @param {?} cpPosition
     * @param {?} cpPositionOffset
     * @param {?} cpPositionRelativeToArrow
     * @param {?} cpPresetLabel
     * @param {?} cpPresetColors
     * @param {?} cpMaxPresetColorsLength
     * @param {?} cpPresetEmptyMessage
     * @param {?} cpPresetEmptyMessageClass
     * @param {?} cpOKButton
     * @param {?} cpOKButtonClass
     * @param {?} cpOKButtonText
     * @param {?} cpCancelButton
     * @param {?} cpCancelButtonClass
     * @param {?} cpCancelButtonText
     * @param {?} cpAddColorButton
     * @param {?} cpAddColorButtonClass
     * @param {?} cpAddColorButtonText
     * @param {?} cpRemoveColorButtonClass
     * @param {?} defColors
     * @return {?}
     */
    ColorPickerComponent.prototype.setupDialog = /**
     * @param {?} instance
     * @param {?} elementRef
     * @param {?} color
     * @param {?} cpWidth
     * @param {?} cpHeight
     * @param {?} cpDialogDisplay
     * @param {?} cpFallbackColor
     * @param {?} cpColorMode
     * @param {?} cpAlphaChannel
     * @param {?} cpOutputFormat
     * @param {?} cpDisableInput
     * @param {?} cpIgnoredElements
     * @param {?} cpSaveClickOutside
     * @param {?} cpCloseClickOutside
     * @param {?} cpUseRootViewContainer
     * @param {?} cpPosition
     * @param {?} cpPositionOffset
     * @param {?} cpPositionRelativeToArrow
     * @param {?} cpPresetLabel
     * @param {?} cpPresetColors
     * @param {?} cpMaxPresetColorsLength
     * @param {?} cpPresetEmptyMessage
     * @param {?} cpPresetEmptyMessageClass
     * @param {?} cpOKButton
     * @param {?} cpOKButtonClass
     * @param {?} cpOKButtonText
     * @param {?} cpCancelButton
     * @param {?} cpCancelButtonClass
     * @param {?} cpCancelButtonText
     * @param {?} cpAddColorButton
     * @param {?} cpAddColorButtonClass
     * @param {?} cpAddColorButtonText
     * @param {?} cpRemoveColorButtonClass
     * @param {?} defColors
     * @return {?}
     */
        function (instance, elementRef, color, cpWidth, cpHeight, cpDialogDisplay, cpFallbackColor, cpColorMode, cpAlphaChannel, cpOutputFormat, cpDisableInput, cpIgnoredElements, cpSaveClickOutside, cpCloseClickOutside, cpUseRootViewContainer, cpPosition, cpPositionOffset, cpPositionRelativeToArrow, cpPresetLabel, cpPresetColors, cpMaxPresetColorsLength, cpPresetEmptyMessage, cpPresetEmptyMessageClass, cpOKButton, cpOKButtonClass, cpOKButtonText, cpCancelButton, cpCancelButtonClass, cpCancelButtonText, cpAddColorButton, cpAddColorButtonClass, cpAddColorButtonText, cpRemoveColorButtonClass, defColors) {
            this.setInitialColor(color);
            this.setColorMode(cpColorMode);
            this.isIE10 = (detectIE() === 10);
            this.directiveInstance = instance;
            this.directiveElementRef = elementRef;
            this.cpDisableInput = cpDisableInput;
            this.cpAlphaChannel = cpAlphaChannel;
            this.cpOutputFormat = cpOutputFormat;
            this.cpDialogDisplay = cpDialogDisplay;
            this.cpIgnoredElements = cpIgnoredElements;
            this.cpSaveClickOutside = cpSaveClickOutside;
            this.cpCloseClickOutside = cpCloseClickOutside;
            this.useRootViewContainer = cpUseRootViewContainer;
            this.width = this.cpWidth = parseInt(cpWidth, 10);
            this.height = this.cpHeight = parseInt(cpHeight, 10);
            this.cpPosition = cpPosition;
            this.cpPositionOffset = parseInt(cpPositionOffset, 10);
            console.log("cpOKButton", cpOKButton, "cpCancelButton", cpCancelButton);
            this.cpOKButton = cpOKButton;
            this.cpOKButtonText = cpOKButtonText;
            this.cpOKButtonClass = cpOKButtonClass;
            this.cpCancelButton = cpCancelButton;
            this.cpCancelButtonText = cpCancelButtonText;
            this.cpCancelButtonClass = cpCancelButtonClass;
            this.fallbackColor = cpFallbackColor || '#fff';
            this.setPresetConfig(cpPresetLabel, cpPresetColors);
            this.cpMaxPresetColorsLength = cpMaxPresetColorsLength;
            this.cpPresetEmptyMessage = cpPresetEmptyMessage;
            this.cpPresetEmptyMessageClass = cpPresetEmptyMessageClass;
            this.cpAddColorButton = cpAddColorButton;
            this.cpAddColorButtonText = cpAddColorButtonText;
            this.cpAddColorButtonClass = cpAddColorButtonClass;
            this.cpRemoveColorButtonClass = cpRemoveColorButtonClass;
            this.defColors = defColors;
            if (!cpPositionRelativeToArrow) {
                this.dialogArrowOffset = 0;
            }
            if (cpDialogDisplay === 'inline') {
                this.dialogArrowSize = 0;
                this.dialogArrowOffset = 0;
            }
            if (cpOutputFormat === 'hex' &&
                cpAlphaChannel !== 'always' && cpAlphaChannel !== 'forced') {
                this.cpAlphaChannel = 'disabled';
            }
        };
    /**
     * @param {?} mode
     * @return {?}
     */
    ColorPickerComponent.prototype.setColorMode = /**
     * @param {?} mode
     * @return {?}
     */
        function (mode) {
            switch (mode.toString().toUpperCase()) {
                case '1':
                case 'C':
                case 'COLOR':
                    this.cpColorMode = 1;
                    break;
                case '2':
                case 'G':
                case 'GRAYSCALE':
                    this.cpColorMode = 2;
                    break;
                case '3':
                case 'P':
                case 'PRESETS':
                    this.cpColorMode = 3;
                    break;
                default:
                    this.cpColorMode = 1;
            }
        };
    /**
     * @param {?} color
     * @return {?}
     */
    ColorPickerComponent.prototype.setInitialColor = /**
     * @param {?} color
     * @return {?}
     */
        function (color) {
            this.initialColor = color;
        };
    /**
     * @param {?} cpPresetLabel
     * @param {?} cpPresetColors
     * @return {?}
     */
    ColorPickerComponent.prototype.setPresetConfig = /**
     * @param {?} cpPresetLabel
     * @param {?} cpPresetColors
     * @return {?}
     */
        function (cpPresetLabel, cpPresetColors) {
            this.cpPresetLabel = cpPresetLabel;
            this.cpPresetColors = cpPresetColors;
        };
    /**
     * @param {?} value
     * @param {?=} emit
     * @param {?=} update
     * @return {?}
     */
    ColorPickerComponent.prototype.setColorFromString = /**
     * @param {?} value
     * @param {?=} emit
     * @param {?=} update
     * @return {?}
     */
        function (value, emit, update) {
            if (emit === void 0) { emit = true; }
            if (update === void 0) { update = true; }
            /** @type {?} */
            var hsva;
            if (this.cpAlphaChannel === 'always' || this.cpAlphaChannel === 'forced') {
                hsva = this.service.stringToHsva(value, true);
                if (!hsva && !this.hsva) {
                    hsva = this.service.stringToHsva(value, false);
                }
            }
            else {
                hsva = this.service.stringToHsva(value, false);
            }
            if (!hsva && !this.hsva) {
                hsva = this.service.stringToHsva(this.fallbackColor, false);
            }
            if (hsva) {
                this.hsva = hsva;
                this.sliderH = this.hsva.h;
                this.updateColorPicker(emit, update);
            }
        };
    /**
     * @return {?}
     */
    ColorPickerComponent.prototype.onResize = /**
     * @return {?}
     */
        function () {
            if (this.position === 'fixed') {
                this.setDialogPosition();
            }
            else if (this.cpDialogDisplay !== 'inline') {
                this.closeColorPicker();
            }
        };
    /**
     * @param {?} slider
     * @return {?}
     */
    ColorPickerComponent.prototype.onDragEnd = /**
     * @param {?} slider
     * @return {?}
     */
        function (slider) {
            this.directiveInstance.sliderDragEnd({ slider: slider, color: this.outputColor });
        };
    /**
     * @param {?} slider
     * @return {?}
     */
    ColorPickerComponent.prototype.onDragStart = /**
     * @param {?} slider
     * @return {?}
     */
        function (slider) {
            this.directiveInstance.sliderDragStart({ slider: slider, color: this.outputColor });
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerComponent.prototype.onMouseDown = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            if (!this.isIE10 && this.cpDialogDisplay === 'popup' &&
                event.target !== this.directiveElementRef.nativeElement &&
                !this.isDescendant(this.elRef.nativeElement, event.target) &&
                !this.isDescendant(this.directiveElementRef.nativeElement, event.target) &&
                this.cpIgnoredElements.filter(function (item) { return item === event.target; }).length === 0) {
                if (this.cpSaveClickOutside) {
                    this.directiveInstance.colorSelected(this.outputColor);
                }
                else {
                    this.setColorFromString(this.initialColor, false);
                    this.directiveInstance.colorChanged(this.initialColor);
                }
                if (this.cpCloseClickOutside) {
                    this.closeColorPicker();
                }
            }
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerComponent.prototype.onAcceptColor = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            event.stopPropagation();
            if (this.cpDialogDisplay === 'popup') {
                this.closeColorPicker();
            }
            if (this.outputColor) {
                this.directiveInstance.colorSelected(this.outputColor);
            }
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerComponent.prototype.onCancelColor = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            event.stopPropagation();
            this.setColorFromString(this.initialColor, true);
            if (this.cpDialogDisplay === 'popup') {
                this.directiveInstance.colorChanged(this.initialColor, true);
                this.directiveInstance.cpPresetColorsChange.emit(this.initialColor);
                this.closeColorPicker();
            }
            this.directiveInstance.colorCanceled();
        };
    /**
     * @param {?} change
     * @return {?}
     */
    ColorPickerComponent.prototype.onFormatToggle = /**
     * @param {?} change
     * @return {?}
     */
        function (change) {
            /** @type {?} */
            var availableFormats = this.dialogInputFields.length;
            /** @type {?} */
            var nextFormat = (((this.dialogInputFields.indexOf(this.format) + change) %
                availableFormats) + availableFormats) % availableFormats;
            this.format = this.dialogInputFields[nextFormat];
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onColorChange = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            this.hsva.s = value.s / value.rgX;
            this.hsva.v = value.v / value.rgY;
            this.updateColorPicker();
            this.directiveInstance.sliderChanged({
                slider: 'lightness',
                value: this.hsva.v,
                color: this.outputColor
            });
            this.directiveInstance.sliderChanged({
                slider: 'saturation',
                value: this.hsva.s,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onHueChange = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            this.hsva.h = value.v / value.rgX;
            this.sliderH = this.hsva.h;
            this.updateColorPicker();
            this.directiveInstance.sliderChanged({
                slider: 'hue',
                value: this.hsva.h,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onValueChange = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            this.hsva.v = value.v / value.rgX;
            this.updateColorPicker();
            this.directiveInstance.sliderChanged({
                slider: 'value',
                value: this.hsva.v,
                color: this.outputColor
            });
        };
    /**
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.setColor = /**
     * @param {?} value
     * @return {?}
     */
        // function (value) {
        //     this.hsva.v = value.v / value.rgX;
        //     this.updateColorPicker();
        //     this.directiveInstance.sliderChanged({
        //         slider: 'value',
        //         value: this.hsva.v,
        //         color: this.outputColor
        //     });
        // };
        function(value) {
            console.log("selected color::", value, "this.outputColor", this.outputColor);
            this.setColorFromString(value, true, true);
            this.directiveInstance.cpPresetColorsChange.emit(value);
            // this.directiveInstance.colorChanged(this.outputColor);
        }
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onAlphaChange = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            this.hsva.a = value.v / value.rgX;
            this.updateColorPicker();
            this.directiveInstance.sliderChanged({
                slider: 'alpha',
                value: this.hsva.a,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onHexInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            if (value === null) {
                this.updateColorPicker();
            }
            else {
                if (value && value[0] !== '#') {
                    value = '#' + value;
                }
                /** @type {?} */
                var validHex = /^#([a-f0-9]{3}|[a-f0-9]{6})$/gi;
                if (this.cpAlphaChannel === 'always') {
                    validHex = /^#([a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})$/gi;
                }
                /** @type {?} */
                var valid = validHex.test(value);
                if (valid) {
                    if (value.length < 5) {
                        value = '#' + value.substring(1)
                            .split('')
                            .map(function (c) { return c + c; })
                            .join('');
                    }
                    if (this.cpAlphaChannel === 'forced') {
                        value += Math.round(this.hsva.a * 255).toString(16);
                    }
                    this.setColorFromString(value, true, false);
                }
                this.directiveInstance.inputChanged({
                    input: 'hex',
                    valid: valid,
                    value: value,
                    color: this.outputColor
                });
            }
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onRedInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            /** @type {?} */
            var rgba = this.service.hsvaToRgba(this.hsva);
            /** @type {?} */
            var valid = !isNaN(value.v) && value.v >= 0 && value.v <= value.rg;
            if (valid) {
                rgba.r = value.v / value.rg;
                this.hsva = this.service.rgbaToHsva(rgba);
                this.sliderH = this.hsva.h;
                this.updateColorPicker();
            }
            this.directiveInstance.inputChanged({
                input: 'red',
                valid: valid,
                value: rgba.r,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onBlueInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            /** @type {?} */
            var rgba = this.service.hsvaToRgba(this.hsva);
            /** @type {?} */
            var valid = !isNaN(value.v) && value.v >= 0 && value.v <= value.rg;
            if (valid) {
                rgba.b = value.v / value.rg;
                this.hsva = this.service.rgbaToHsva(rgba);
                this.sliderH = this.hsva.h;
                this.updateColorPicker();
            }
            this.directiveInstance.inputChanged({
                input: 'blue',
                valid: valid,
                value: rgba.b,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onGreenInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            /** @type {?} */
            var rgba = this.service.hsvaToRgba(this.hsva);
            /** @type {?} */
            var valid = !isNaN(value.v) && value.v >= 0 && value.v <= value.rg;
            if (valid) {
                rgba.g = value.v / value.rg;
                this.hsva = this.service.rgbaToHsva(rgba);
                this.sliderH = this.hsva.h;
                this.updateColorPicker();
            }
            this.directiveInstance.inputChanged({
                input: 'green',
                valid: valid,
                value: rgba.g,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onHueInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            /** @type {?} */
            var valid = !isNaN(value.v) && value.v >= 0 && value.v <= value.rg;
            if (valid) {
                this.hsva.h = value.v / value.rg;
                this.sliderH = this.hsva.h;
                this.updateColorPicker();
            }
            this.directiveInstance.inputChanged({
                input: 'hue',
                valid: valid,
                value: this.hsva.h,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onValueInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            /** @type {?} */
            var valid = !isNaN(value.v) && value.v >= 0 && value.v <= value.rg;
            if (valid) {
                this.hsva.v = value.v / value.rg;
                this.updateColorPicker();
            }
            this.directiveInstance.inputChanged({
                input: 'value',
                valid: valid,
                value: this.hsva.v,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onAlphaInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            /** @type {?} */
            var valid = !isNaN(value.v) && value.v >= 0 && value.v <= value.rg;
            if (valid) {
                this.hsva.a = value.v / value.rg;
                this.updateColorPicker();
            }
            this.directiveInstance.inputChanged({
                input: 'alpha',
                valid: valid,
                value: this.hsva.a,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onLightnessInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            /** @type {?} */
            var hsla = this.service.hsva2hsla(this.hsva);
            /** @type {?} */
            var valid = !isNaN(value.v) && value.v >= 0 && value.v <= value.rg;
            if (valid) {
                hsla.l = value.v / value.rg;
                this.hsva = this.service.hsla2hsva(hsla);
                this.sliderH = this.hsva.h;
                this.updateColorPicker();
            }
            this.directiveInstance.inputChanged({
                input: 'lightness',
                valid: valid,
                value: hsla.l,
                color: this.outputColor
            });
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onSaturationInput = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            /** @type {?} */
            var hsla = this.service.hsva2hsla(this.hsva);
            /** @type {?} */
            var valid = !isNaN(value.v) && value.v >= 0 && value.v <= value.rg;
            if (valid) {
                hsla.s = value.v / value.rg;
                this.hsva = this.service.hsla2hsva(hsla);
                this.sliderH = this.hsva.h;
                this.updateColorPicker();
            }
            this.directiveInstance.inputChanged({
                input: 'saturation',
                valid: valid,
                value: hsla.s,
                color: this.outputColor
            });
        };
    /**
     * @param {?} event
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onAddPresetColor = /**
     * @param {?} event
     * @param {?} value
     * @return {?}
     */
        function (event, value) {
            event.stopPropagation();
            if (!this.cpPresetColors.filter(function (color) { return (color === value); }).length) {
                this.cpPresetColors = this.cpPresetColors.concat(value);
                this.directiveInstance.presetColorsChanged(this.cpPresetColors);
            }
        };
    /**
     * @param {?} event
     * @param {?} value
     * @return {?}
     */
    ColorPickerComponent.prototype.onRemovePresetColor = /**
     * @param {?} event
     * @param {?} value
     * @return {?}
     */
        function (event, value) {
            event.stopPropagation();
            this.cpPresetColors = this.cpPresetColors.filter(function (color) { return (color !== value); });
            this.directiveInstance.presetColorsChanged(this.cpPresetColors);
        };
    // Private helper functions for the color picker dialog status
    // Private helper functions for the color picker dialog status
    /**
     * @private
     * @return {?}
     */
    ColorPickerComponent.prototype.openColorPicker =
        // Private helper functions for the color picker dialog status
        /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            if (!this.show) {
                this.show = true;
                this.hidden = true;
                setTimeout(function () {
                    _this.hidden = false;
                    _this.setDialogPosition();
                    _this.cdRef.detectChanges();
                }, 0);
                this.directiveInstance.stateChanged(true);
                if (!this.isIE10) {
                    document.addEventListener('mousedown', this.listenerMouseDown);
                }
                window.addEventListener('resize', this.listenerResize);
            }
        };
    /**
     * @private
     * @return {?}
     */
    ColorPickerComponent.prototype.closeColorPicker = /**
     * @private
     * @return {?}
     */
        function () {
            if (this.show) {
                this.show = false;
                this.directiveInstance.stateChanged(false);
                if (!this.isIE10) {
                    document.removeEventListener('mousedown', this.listenerMouseDown);
                }
                window.removeEventListener('resize', this.listenerResize);
                if (!this.cdRef['destroyed']) {
                    this.cdRef.detectChanges();
                }
            }
        };
    /**
     * @private
     * @param {?=} emit
     * @param {?=} update
     * @return {?}
     */
    ColorPickerComponent.prototype.updateColorPicker = /**
     * @private
     * @param {?=} emit
     * @param {?=} update
     * @return {?}
     */
        function (emit, update) {
            if (emit === void 0) { emit = true; }
            if (update === void 0) { update = true; }
            if (this.sliderDimMax) {
                if (this.cpColorMode === 2) {
                    this.hsva.s = 0;
                }
                /** @type {?} */
                var lastOutput = this.outputColor;
                /** @type {?} */
                var hsla = this.service.hsva2hsla(this.hsva);
                /** @type {?} */
                var rgba = this.service.denormalizeRGBA(this.service.hsvaToRgba(this.hsva));
                /** @type {?} */
                var hue = this.service.denormalizeRGBA(this.service.hsvaToRgba(new Hsva(this.sliderH || this.hsva.h, 1, 1, 1)));
                if (update) {
                    this.hslaText = new Hsla(Math.round((hsla.h) * 360), Math.round(hsla.s * 100), Math.round(hsla.l * 100), Math.round(hsla.a * 100) / 100);
                    this.rgbaText = new Rgba(rgba.r, rgba.g, rgba.b, Math.round(rgba.a * 100) / 100);
                    /** @type {?} */
                    var allowHex8 = this.cpAlphaChannel === 'always';
                    this.hexText = this.service.rgbaToHex(rgba, allowHex8);
                    this.hexAlpha = this.rgbaText.a;
                }
                if (this.cpOutputFormat === 'auto') {
                    if (this.hsva.a < 1) {
                        this.format = this.hsva.a < 1 ? ColorFormats.RGBA : ColorFormats.HEX;
                    }
                }
                this.hueSliderColor = 'rgb(' + hue.r + ',' + hue.g + ',' + hue.b + ')';
                this.alphaSliderColor = 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';
                this.outputColor = this.service.outputFormat(this.hsva, this.cpOutputFormat, this.cpAlphaChannel);
                this.selectedColor = this.service.outputFormat(this.hsva, 'rgba', null);
                this.slider = new SliderPosition((this.sliderH || this.hsva.h) * this.sliderDimMax.h - 8, this.hsva.s * this.sliderDimMax.s - 8, (1 - this.hsva.v) * this.sliderDimMax.v - 8, this.hsva.a * this.sliderDimMax.a - 8);
                if (emit && lastOutput !== this.outputColor) {
                    this.directiveInstance.colorChanged(this.outputColor);
                }
            }
        };
    // Private helper functions for the color picker dialog positioning
    // Private helper functions for the color picker dialog positioning
    /**
     * @private
     * @return {?}
     */
    ColorPickerComponent.prototype.setDialogPosition =
        // Private helper functions for the color picker dialog positioning
        /**
         * @private
         * @return {?}
         */
        function () {
            if (this.cpDialogDisplay === 'inline') {
                this.position = 'relative';
            }
            else {
                /** @type {?} */
                var position = 'static';
                /** @type {?} */
                var transform = '';
                /** @type {?} */
                var style = void 0;
                /** @type {?} */
                var parentNode = null;
                /** @type {?} */
                var transformNode = null;
                /** @type {?} */
                var node = this.directiveElementRef.nativeElement.parentNode;
                /** @type {?} */
                var dialogHeight = this.dialogElement.nativeElement.offsetHeight;
                while (node !== null && node.tagName !== 'HTML') {
                    style = window.getComputedStyle(node);
                    position = style.getPropertyValue('position');
                    transform = style.getPropertyValue('transform');
                    if (position !== 'static' && parentNode === null) {
                        parentNode = node;
                    }
                    if (transform && transform !== 'none' && transformNode === null) {
                        transformNode = node;
                    }
                    if (position === 'fixed') {
                        parentNode = transformNode;
                        break;
                    }
                    node = node.parentNode;
                }
                /** @type {?} */
                var boxDirective = this.createDialogBox(this.directiveElementRef.nativeElement, (position !== 'fixed'));
                if (this.useRootViewContainer || (position === 'fixed' &&
                    (!parentNode || parentNode instanceof HTMLUnknownElement))) {
                    this.top = boxDirective.top;
                    this.left = boxDirective.left;
                }
                else {
                    if (parentNode === null) {
                        parentNode = node;
                    }
                    /** @type {?} */
                    var boxParent = this.createDialogBox(parentNode, (position !== 'fixed'));
                    this.top = boxDirective.top - boxParent.top;
                    this.left = boxDirective.left - boxParent.left;
                }
                if (position === 'fixed') {
                    this.position = 'fixed';
                }
                if (this.cpPosition === 'left') {
                    this.top += boxDirective.height * this.cpPositionOffset / 100 - this.dialogArrowOffset;
                    this.left -= this.cpWidth + this.dialogArrowSize - 2;
                }
                else if (this.cpPosition === 'top') {
                    this.arrowTop = dialogHeight - 1;
                    this.top -= dialogHeight + this.dialogArrowSize;
                    this.left += this.cpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
                }
                else if (this.cpPosition === 'bottom') {
                    this.top += boxDirective.height + this.dialogArrowSize;
                    this.left += this.cpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
                }
                else {
                    this.top += boxDirective.height * this.cpPositionOffset / 100 - this.dialogArrowOffset;
                    this.left += boxDirective.width + this.dialogArrowSize - 2;
                }
            }
        };
    // Private helper functions for the color picker dialog positioning and opening
    // Private helper functions for the color picker dialog positioning and opening
    /**
     * @private
     * @param {?} parent
     * @param {?} child
     * @return {?}
     */
    ColorPickerComponent.prototype.isDescendant =
        // Private helper functions for the color picker dialog positioning and opening
        /**
         * @private
         * @param {?} parent
         * @param {?} child
         * @return {?}
         */
        function (parent, child) {
            /** @type {?} */
            var node = child.parentNode;
            while (node !== null) {
                if (node === parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        };
    /**
     * @private
     * @param {?} element
     * @param {?} offset
     * @return {?}
     */
    ColorPickerComponent.prototype.createDialogBox = /**
     * @private
     * @param {?} element
     * @param {?} offset
     * @return {?}
     */
        function (element, offset) {
            return {
                top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
                left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        };
    ColorPickerComponent.decorators = [
        {
            type: Component, args: [{
                selector: 'color-picker',
                template: htmlTemplate,
                encapsulation: ViewEncapsulation.None,
                styles: cpCss
            }]
        }
    ];
    /** @nocollapse */
    ColorPickerComponent.ctorParameters = function () {
        return [
            { type: ElementRef },
            { type: ChangeDetectorRef },
            { type: ColorPickerService }
        ];
    };
    ColorPickerComponent.propDecorators = {
        dialogElement: [{ type: ViewChild, args: ['dialogPopup',] }],
        hueSlider: [{ type: ViewChild, args: ['hueSlider',] }],
        alphaSlider: [{ type: ViewChild, args: ['alphaSlider',] }],
        handleEsc: [{ type: HostListener, args: ['document:keyup.esc', ['$event'],] }],
        handleEnter: [{ type: HostListener, args: ['document:keyup.enter', ['$event'],] }]
    };
    return ColorPickerComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ColorPickerDirective = /** @class */ (function () {
    function ColorPickerDirective(injector, cfr, appRef, vcRef, elRef, _service) {
        this.injector = injector;
        this.cfr = cfr;
        this.appRef = appRef;
        this.vcRef = vcRef;
        this.elRef = elRef;
        this._service = _service;
        this.dialogCreated = false;
        this.ignoreChanges = false;
        this.cpWidth = '230px';
        this.cpHeight = 'auto';
        this.cpToggle = false;
        this.cpDisabled = false;
        this.cpIgnoredElements = [];
        this.cpFallbackColor = '';
        this.cpColorMode = 'color';
        this.cpOutputFormat = 'auto';
        this.cpAlphaChannel = 'enabled';
        this.cpDisableInput = false;
        this.cpDialogDisplay = 'popup';
        this.cpSaveClickOutside = true;
        // this.cpSaveClickOutside = false;
        this.cpCloseClickOutside = true;
        this.cpUseRootViewContainer = false;
        this.cpPosition = 'right';
        this.cpPositionOffset = '0%';
        this.cpPositionRelativeToArrow = false;
        // this.cpOKButton = false;
        this.cpOKButton = true;
        this.cpOKButtonText = 'OK';
        this.cpOKButtonClass = 'cp-ok-button-class';
        // this.cpCancelButton = false;
        this.cpCancelButton = true;
        this.cpCancelButtonText = 'Cancel';
        this.cpCancelButtonClass = 'cp-cancel-button-class';
        this.cpPresetLabel = 'Preset colors';
        this.cpMaxPresetColorsLength = 6;
        this.cpPresetEmptyMessage = 'No colors added';
        this.cpPresetEmptyMessageClass = 'preset-empty-message';
        this.cpAddColorButton = false;
        this.cpAddColorButtonText = 'Add color';
        this.cpAddColorButtonClass = 'cp-add-color-button-class';
        this.cpRemoveColorButtonClass = 'cp-remove-color-button-class';
        this.defColors = [
            '#ffffff',
            '#959595',
            '#19cb99',
            '#f0c228',
            '#1e6377',
            '#0e4d60',
            '#00313f',
            '#cb1cbe', 
            '#f0482a',
            '#14cce3'
        ];
        this.cpInputChange = new EventEmitter(true);
        this.cpToggleChange = new EventEmitter(true);
        this.cpSliderChange = new EventEmitter(true);
        this.cpSliderDragEnd = new EventEmitter(true);
        this.cpSliderDragStart = new EventEmitter(true);
        this.colorPickerOpen = new EventEmitter(true);
        this.colorPickerClose = new EventEmitter(true);
        this.colorPickerCancel = new EventEmitter(true);
        this.colorPickerSelect = new EventEmitter(true);
        this.colorPickerChange = new EventEmitter(false);
        this.cpPresetColorsChange = new EventEmitter(true);
    }
    /**
     * @return {?}
     */
    ColorPickerDirective.prototype.handleClick = /**
     * @return {?}
     */
        function () {
            this.inputFocus();
        };
    /**
     * @return {?}
     */
    ColorPickerDirective.prototype.handleFocus = /**
     * @return {?}
     */
        function () {
            this.inputFocus();
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerDirective.prototype.handleInput = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            this.inputChange(event);
        };
    /**
     * @return {?}
     */
    ColorPickerDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
        function () {
            if (this.cmpRef !== undefined) {
                this.cmpRef.destroy();
            }
        };
    /**
     * @param {?} changes
     * @return {?}
     */
    ColorPickerDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
        function (changes) {
            if (changes.cpToggle && !this.cpDisabled) {
                if (changes.cpToggle.currentValue) {
                    this.openDialog();
                }
                else if (!changes.cpToggle.currentValue) {
                    this.closeDialog();
                }
            }
            if (changes.colorPicker) {
                if (this.dialog && !this.ignoreChanges) {
                    if (this.cpDialogDisplay === 'inline') {
                        this.dialog.setInitialColor(changes.colorPicker.currentValue);
                    }
                    this.dialog.setColorFromString(changes.colorPicker.currentValue, false);
                    if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                        this.cmpRef.changeDetectorRef.detectChanges();
                    }
                }
                this.ignoreChanges = false;
            }
            if (changes.cpPresetLabel || changes.cpPresetColors) {
                if (this.dialog) {
                    this.dialog.setPresetConfig(this.cpPresetLabel, this.cpPresetColors);
                }
            }
        };
    /**
     * @return {?}
     */
    ColorPickerDirective.prototype.openDialog = /**
     * @return {?}
     */
        function () {
            if (!this.dialogCreated) {
                /** @type {?} */
                var vcRef = this.vcRef;
                this.dialogCreated = true;
                if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                    /** @type {?} */
                    var classOfRootComponent = this.appRef.componentTypes[0];
                    /** @type {?} */
                    var appInstance = this.injector.get(classOfRootComponent);
                    vcRef = appInstance.vcRef || appInstance.viewContainerRef || this.vcRef;
                    if (vcRef === this.vcRef) {
                        console.warn('You are using cpUseRootViewContainer, ' +
                            'but the root component is not exposing viewContainerRef!' +
                            'Please expose it by adding \'public vcRef: ViewContainerRef\' to the constructor.');
                    }
                }
                /** @type {?} */
                var compFactory = this.cfr.resolveComponentFactory(ColorPickerComponent);
                /** @type {?} */
                var injector = ReflectiveInjector.fromResolvedProviders([], vcRef.parentInjector);
                this.cmpRef = vcRef.createComponent(compFactory, 0, injector, []);
                this.cmpRef.instance.setupDialog(this, this.elRef, this.colorPicker, this.cpWidth, this.cpHeight, this.cpDialogDisplay, this.cpFallbackColor, this.cpColorMode, this.cpAlphaChannel, this.cpOutputFormat, this.cpDisableInput, this.cpIgnoredElements, this.cpSaveClickOutside, this.cpCloseClickOutside, this.cpUseRootViewContainer, this.cpPosition, this.cpPositionOffset, this.cpPositionRelativeToArrow, this.cpPresetLabel, this.cpPresetColors, this.cpMaxPresetColorsLength, this.cpPresetEmptyMessage, this.cpPresetEmptyMessageClass, this.cpOKButton, this.cpOKButtonClass, this.cpOKButtonText, this.cpCancelButton, this.cpCancelButtonClass, this.cpCancelButtonText, this.cpAddColorButton, this.cpAddColorButtonClass, this.cpAddColorButtonText, this.cpRemoveColorButtonClass, this.defColors);
                this.dialog = this.cmpRef.instance;
                if (this.vcRef !== vcRef) {
                    this.cmpRef.changeDetectorRef.detectChanges();
                }
            }
            else if (this.dialog) {
                this.dialog.openDialog(this.colorPicker);
            }
        };
    /**
     * @return {?}
     */
    ColorPickerDirective.prototype.closeDialog = /**
     * @return {?}
     */
        function () {
            if (this.dialog && this.cpDialogDisplay === 'popup') {
                this.dialog.closeDialog();
            }
        };
    /**
     * @param {?} state
     * @return {?}
     */
    ColorPickerDirective.prototype.stateChanged = /**
     * @param {?} state
     * @return {?}
     */
        function (state) {
            this.cpToggleChange.emit(state);
            if (state) {
                this.colorPickerOpen.emit(this.colorPicker);
            }
            else {
                this.colorPickerClose.emit(this.colorPicker);
            }
        };
    /**
     * @param {?} value
     * @param {?=} ignore
     * @return {?}
     */
    ColorPickerDirective.prototype.colorChanged = /**
     * @param {?} value
     * @param {?=} ignore
     * @return {?}
     */
        function (value, ignore) {
            if (ignore === void 0) { ignore = true; }
            this.ignoreChanges = ignore;
            this.colorPickerChange.emit(value);
        };
    /**
     * @return {?}
     */
    ColorPickerDirective.prototype.colorCanceled = /**
     * @return {?}
     */
        function () {
            this.colorPickerCancel.emit();
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerDirective.prototype.colorSelected = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            this.colorPickerSelect.emit(value);
        };
    /**
     * @return {?}
     */
    ColorPickerDirective.prototype.inputFocus = /**
     * @return {?}
     */
        function () {
            /** @type {?} */
            var element = this.elRef.nativeElement;
            /** @type {?} */
            var ignored = this.cpIgnoredElements.filter(function (item) { return item === element; });
            if (!this.cpDisabled && !ignored.length) {
                if (typeof document !== 'undefined' && element === document.activeElement) {
                    this.openDialog();
                }
                else if (!this.dialog || !this.dialog.show) {
                    this.openDialog();
                }
                else {
                    this.closeDialog();
                }
            }
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerDirective.prototype.inputChange = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            if (this.dialog) {
                this.dialog.setColorFromString(event.target.value, true);
            }
            else {
                this.colorPicker = event.target.value;
                this.colorPickerChange.emit(this.colorPicker);
            }
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerDirective.prototype.inputChanged = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            this.cpInputChange.emit(event);
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerDirective.prototype.sliderChanged = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            this.cpSliderChange.emit(event);
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerDirective.prototype.sliderDragEnd = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            this.cpSliderDragEnd.emit(event);
        };
    /**
     * @param {?} event
     * @return {?}
     */
    ColorPickerDirective.prototype.sliderDragStart = /**
     * @param {?} event
     * @return {?}
     */
        function (event) {
            this.cpSliderDragStart.emit(event);
        };
    /**
     * @param {?} value
     * @return {?}
     */
    ColorPickerDirective.prototype.presetColorsChanged = /**
     * @param {?} value
     * @return {?}
     */
        function (value) {
            this.cpPresetColorsChange.emit(value);
        };
    ColorPickerDirective.decorators = [
        {
            type: Directive, args: [{
                selector: '[colorPicker]',
                exportAs: 'ngxColorPicker'
            },]
        }
    ];
    /** @nocollapse */
    ColorPickerDirective.ctorParameters = function () {
        return [
            { type: Injector },
            { type: ComponentFactoryResolver },
            { type: ApplicationRef },
            { type: ViewContainerRef },
            { type: ElementRef },
            { type: ColorPickerService }
        ];
    };
    ColorPickerDirective.propDecorators = {
        colorPicker: [{ type: Input }],
        cpWidth: [{ type: Input }],
        cpHeight: [{ type: Input }],
        cpToggle: [{ type: Input }],
        cpDisabled: [{ type: Input }],
        cpIgnoredElements: [{ type: Input }],
        cpFallbackColor: [{ type: Input }],
        cpColorMode: [{ type: Input }],
        cpOutputFormat: [{ type: Input }],
        cpAlphaChannel: [{ type: Input }],
        cpDisableInput: [{ type: Input }],
        cpDialogDisplay: [{ type: Input }],
        cpSaveClickOutside: [{ type: Input }],
        cpCloseClickOutside: [{ type: Input }],
        cpUseRootViewContainer: [{ type: Input }],
        cpPosition: [{ type: Input }],
        cpPositionOffset: [{ type: Input }],
        cpPositionRelativeToArrow: [{ type: Input }],
        cpOKButton: [{ type: Input }],
        cpOKButtonText: [{ type: Input }],
        cpOKButtonClass: [{ type: Input }],
        cpCancelButton: [{ type: Input }],
        cpCancelButtonText: [{ type: Input }],
        cpCancelButtonClass: [{ type: Input }],
        cpPresetLabel: [{ type: Input }],
        cpPresetColors: [{ type: Input }],
        cpMaxPresetColorsLength: [{ type: Input }],
        cpPresetEmptyMessage: [{ type: Input }],
        cpPresetEmptyMessageClass: [{ type: Input }],
        cpAddColorButton: [{ type: Input }],
        cpAddColorButtonText: [{ type: Input }],
        cpAddColorButtonClass: [{ type: Input }],
        cpRemoveColorButtonClass: [{ type: Input }],
        defColors: [{ type: Input }],
        cpInputChange: [{ type: Output }],
        cpToggleChange: [{ type: Output }],
        cpSliderChange: [{ type: Output }],
        cpSliderDragEnd: [{ type: Output }],
        cpSliderDragStart: [{ type: Output }],
        colorPickerOpen: [{ type: Output }],
        colorPickerClose: [{ type: Output }],
        colorPickerCancel: [{ type: Output }],
        colorPickerSelect: [{ type: Output }],
        colorPickerChange: [{ type: Output }],
        cpPresetColorsChange: [{ type: Output }],
        handleClick: [{ type: HostListener, args: ['click',] }],
        handleFocus: [{ type: HostListener, args: ['focus',] }],
        handleInput: [{ type: HostListener, args: ['input', ['$event'],] }]
    };
    return ColorPickerDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ColorPickerModule = /** @class */ (function () {
    function ColorPickerModule() {
    }
    ColorPickerModule.decorators = [
        {
            type: NgModule, args: [{
                imports: [CommonModule],
                exports: [ColorPickerDirective],
                providers: [ColorPickerService],
                declarations: [ColorPickerComponent, ColorPickerDirective, TextDirective, SliderDirective],
                entryComponents: [ColorPickerComponent]
            },]
        }
    ];
    return ColorPickerModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { Cmyk, Hsla, Hsva, Rgba, TextDirective, SliderDirective, ColorPickerComponent, ColorPickerDirective, ColorPickerModule, ColorPickerService };
//# sourceMappingURL=ngx-color-picker.es5.js.map
