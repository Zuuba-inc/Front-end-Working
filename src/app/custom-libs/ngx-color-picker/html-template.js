export const htmlTemplate = `<div #dialogPopup class="color-picker" [class.open]="show" [style.display]="!show ? 'none' : 'block'" [style.visibility]="hidden ? 'hidden' : 'visible'" [style.top.px]="top" [style.left.px]="left" [style.position]="position" [style.height.px]="cpHeight" [style.width.px]="cpWidth" (click)="$event.stopPropagation()">

<div *ngIf="cpDialogDisplay=='popup'" class="arrow arrow-{{cpUsePosition}}" [style.top.px]="arrowTop" style="top: 4px !important;left: -20px;border-width: 10px 10px;border-color: transparent #777 transparent transparent;"></div>

<div *ngIf="cpPresetColors?.length || cpAddColorButton" class="preset-area">
  <hr>

  <div class="preset-label">{{cpPresetLabel}}</div>

  <div *ngIf="cpPresetColors?.length" class="{{cpPresetColorsClass}}">
    <div *ngFor="let color of cpPresetColors" class="preset-color" [style.backgroundColor]="color" (click)="setColorFromString(color)">
      <span *ngIf="cpAddColorButton" class="{{cpRemoveColorButtonClass}}" (click)="onRemovePresetColor($event, color)"></span>
    </div>
  </div>

  <div *ngIf="!cpPresetColors?.length && cpAddColorButton" class="{{cpPresetEmptyMessageClass}}">{{cpPresetEmptyMessage}}</div>
</div>

<div class="default-color-pickers" style="display: inline-block;padding: 0px 1px 10px 7px;">
  <div class="def-colors" *ngFor="let color of defColors" [style.background-color]="color" (click)="setColor(color)"></div>
</div>

<hr style="width: 90%;margin: 0 auto;border-top: 2px solid #eee; margin-left: 12px !important;">



<div *ngIf="!cpDisableInput && (cpColorMode || 1) === 1" class="hex-text" [class.hex-alpha]="cpAlphaChannel==='forced'"
  [style.display]="format !== 0 ? 'none' : 'block'" style="width: 97%;">
  <div class="box" style="width: 100%;height: 100%;margin-left: 3px !important;margin-top: 5px;">
    <input style="height: inherit;" [text] [value]="hexText" (blur)="onHexInput(null)" (keyup.enter)="onAcceptColor($event)" (newValue)="onHexInput($event)"/>
    <input style="height: inherit;" *ngIf="cpAlphaChannel==='forced'" type="number" pattern="[0-9]+([\.,][0-9]{1,2})?" min="0" max="1" step="0.1" [text] [rg]="1" [value]="hexAlpha" (keyup.enter)="onAcceptColor($event)" (newValue)="onAlphaInput($event)"/>
    <div class="selected-color" style="box-shadow: 0px 3px 6px #00000029;float: left;width: 25px;height: 25px;border: 1px solid #a9a9a9;border-radius: 50%;margin-bottom: 4px;" [style.background-color]="selectedColor"></div>
    </div>
</div>

<div *ngIf="!cpDisableInput && (cpColorMode || 1) === 1" class="cmyk-text" [style.display]="format !== 3 ? 'none' : 'block'" style="width: 97%;">
  <div class="box" style="width: 100%;height: 100%;margin-left: 3px !important;">
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="100" [text] [rg]="100" [value]="cmykText?.c" (keyup.enter)="onAcceptColor($event)" (newValue)="onCyanInput($event)" />
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="100" [text] [rg]="100" [value]="cmykText?.m" (keyup.enter)="onAcceptColor($event)" (newValue)="onMagentaInput($event)" />
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="100" [text] [rg]="100" [value]="cmykText?.y" (keyup.enter)="onAcceptColor($event)" (newValue)="onYellowInput($event)" />
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="100" [text] [rg]="100" [value]="cmykText?.k" (keyup.enter)="onAcceptColor($event)" (newValue)="onBlackInput($event)" />
    <input style="height: inherit;" *ngIf="cpAlphaChannel!=='disabled'" type="number" pattern="[0-9]+([\.,][0-9]{1,2})?" min="0" max="1" step="0.1" [text] [rg]="1" [value]="cmykText?.a" (keyup.enter)="onAcceptColor($event)" (newValue)="onAlphaInput($event)" />
  </div>

   <div class="box" style="width: 100%;height: 100%;margin-left: 0;">
    <div>C</div><div>M</div><div>Y</div><div>K</div><div *ngIf="cpAlphaChannel!=='disabled'" >A</div>
  </div>
</div>

<div *ngIf="!cpDisableInput && (cpColorMode || 1) === 1 " class="hsla-text" [style.display]="format !== 2 ? 'none' : 'block'" style="width: 97%;">
  <div class="box" style="width: 100%;height: 100%;margin-left: 3px !important;">
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="360" [text] [rg]="360" [value]="hslaText?.h" (keyup.enter)="onAcceptColor($event)" (newValue)="onHueInput($event)" />
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="100" [text] [rg]="100" [value]="hslaText?.s" (keyup.enter)="onAcceptColor($event)" (newValue)="onSaturationInput($event)" />
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="100" [text] [rg]="100" [value]="hslaText?.l" (keyup.enter)="onAcceptColor($event)" (newValue)="onLightnessInput($event)" />
    <input style="height: inherit;" *ngIf="cpAlphaChannel!=='disabled'" type="number" pattern="[0-9]+([\.,][0-9]{1,2})?" min="0" max="1" step="0.1" [text] [rg]="1" [value]="hslaText?.a" (keyup.enter)="onAcceptColor($event)" (newValue)="onAlphaInput($event)" />
  </div>

  <div class="box" style="width: 100%;height: 100%;margin-left: 0;">
    <div>H</div><div>S</div><div>L</div><div *ngIf="cpAlphaChannel!=='disabled'">A</div>
  </div>
</div>

<div *ngIf="!cpDisableInput && (cpColorMode || 1) === 1 " [style.display]="format !== 1 ? 'none' : 'block'" class="rgba-text" style="width: 97%;">
  <div class="box" style="width: 100%;height: 100%;margin-left: 3px !important;">
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="255" [text] [rg]="255" [value]="rgbaText?.r" (keyup.enter)="onAcceptColor($event)" (newValue)="onRedInput($event)" />
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="255" [text] [rg]="255" [value]="rgbaText?.g" (keyup.enter)="onAcceptColor($event)" (newValue)="onGreenInput($event)" />
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="255" [text] [rg]="255" [value]="rgbaText?.b" (keyup.enter)="onAcceptColor($event)" (newValue)="onBlueInput($event)" />
    <input style="height: inherit;" *ngIf="cpAlphaChannel!=='disabled'" type="number" pattern="[0-9]+([\.,][0-9]{1,2})?" min="0" max="1" step="0.1" [text] [rg]="1" [value]="rgbaText?.a" (keyup.enter)="onAcceptColor($event)" (newValue)="onAlphaInput($event)" />
  </div>

  <div class="box" style="width: 100%;height: 100%;margin-left: 0;">
    <div>R</div><div>G</div><div>B</div><div *ngIf="cpAlphaChannel!=='disabled'" >A</div>
  </div>
</div>

<div *ngIf="!cpDisableInput && (cpColorMode || 1) === 2" class="value-text">
  <div class="box" style="width: 100%;height: 100%;margin-left: 0;">
    <input style="height: inherit;" type="number" pattern="[0-9]*" min="0" max="100" [text] [rg]="100" [value]="hslaText?.l" (keyup.enter)="onAcceptColor($event)" (newValue)="onValueInput($event)" />
    <input style="height: inherit;" *ngIf="cpAlphaChannel!=='disabled'" type="number" pattern="[0-9]+([\.,][0-9]{1,2})?" min="0" max="1" step="0.1"  [text] [rg]="1" [value]="hslaText?.a" (keyup.enter)="onAcceptColor($event)" (newValue)="onAlphaInput($event)" />
  </div>

  <div class="box" style="width: 100%;height: 100%;margin-left: 0;">
    <div>V</div><div>A</div>
  </div>
</div>

<div class="hue-alpha box" style="width: 100%;height: 100%;margin-left: 0;padding: 0;">
  <div class="right" style="padding: 0;">
    <div *ngIf="cpAlphaChannel==='disabled'" style="height: 5px;"></div>
    <div #hueSlider class="hue" [slider] [rgX]="1" [style.display]="(cpColorMode || 1) === 1 ? 'block' : 'none'" (newValue)="onHueChange($event)" (dragStart)="onDragStart('hue')" (dragEnd)="onDragEnd('hue')">
      <div class="cursor" [style.left.px]="slider?.h"></div>
    </div>
    <div #valueSlider class="value" [slider] [rgX]="1" [style.display]="(cpColorMode || 1) === 2 ? 'block': 'none'" (newValue)="onValueChange($event)" (dragStart)="onDragStart('value')" (dragEnd)="onDragEnd('value')">
      <div class="cursor" [style.right.px]="slider?.v"></div>
    </div>
    <div #alphaSlider class="alpha" [slider] [rgX]="1" [style.display]="cpAlphaChannel === 'disabled' ? 'none' : 'block'" [style.background-color]="alphaSliderColor" (newValue)="onAlphaChange($event)" (dragStart)="onDragStart('alpha')" (dragEnd)="onDragEnd('alpha')">
      <div class="cursor" [style.left.px]="slider?.a"></div>
    </div>
  </div>
</div>
<div *ngIf="(cpColorMode || 1) === 1" class="saturation-lightness" [slider] [rgX]="1" [rgY]="1" [style.background-color]="hueSliderColor" (newValue)="onColorChange($event)" (dragStart)="onDragStart('saturation-lightness')" (dragEnd)="onDragEnd('saturation-lightness')">
  <div class="cursor" [style.top.px]="slider?.v" [style.left.px]="slider?.s"></div>
</div>

<div *ngIf="cpOKButton || cpCancelButton" class="button-area btn-a" style="margin-top: 7px;">
    <!-- cpCancelButtonText -->
    <!-- {{cpOKButtonText}} -->
    <button *ngIf="cpCancelButton" type="button" class="{{cpCancelButtonClass}} cbtn" (click)="onCancelColor($event)" style='font-size:20px;color:black;border: 1px solid black;height:25px;width:30px; margin-right: 8px;background: white;border-radius: 4px;'>&#10005;</button>

    <button *ngIf="cpOKButton" type="button" class="{{cpOKButtonClass}}" (click)="onAcceptColor($event)" style='font-size:20px;color:white; background: black;border: 1px solid black;height:25px;width:30px;border-radius: 4px;'>&#10003;</button>
</div>
</div>`;