import './style.less';
import TEMPLATE from './template';
const COLOR_RED = '#c0392b';

class CanvasToolkit {
    constructor (canvas, options) {
        this.canvas = canvas;
        this.options = options || {};
        this.$container = null;
        this.scale = this.options.scale || window.devicePixelRatio;
        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.toolType = 'pencil';
        this.randomColor = COLOR_RED;
        this.startPos = {x: 0, y: 0};
        this.input = null;

        this.renderMirrorCanvas(canvas);
        this.renderToolBar();
        this.renderInput();
        this.setPaintStyle();
        this.bindEvents();
        this.renderCursor();
    }

    bindEvents () {
        this.mirrorCanvas.onmousedown = e => {
            this.mousedownHandler(e);
        };
    }

    renderMirrorCanvas (canvas) {
        this.mirrorCanvas = document.createElement('canvas');
        this.mirrorCanvas.className = 'mirrorCanavs';
        this.mirrorCanvas.width = canvas.width;
        this.mirrorCanvas.height = canvas.height;
        this.mirrorCtx = this.mirrorCanvas.getContext('2d');
        canvas.parentNode.appendChild(this.mirrorCanvas);
    }

    renderInput () {
        let input = document.getElementById('CANVAS_TOOLBAR_INPUT');
        if (input) {
            this.input = input;
        } else {
            this.input = document.createElement('input');
            this.input.style.position = 'absolute';
            this.input.style.fontSize = '16px';
            this.input.style.width = '100px';
            this.input.style.outline = 'none';
            this.input.style.border = '1px dashed' + COLOR_RED;
            this.input.style.color = COLOR_RED;
            this.input.style.backgroundColor = 'transparent';
            this.input.setAttribute('placeholder', '按回车确定');
        }
        
        this.hideInput();

        document.body.appendChild(this.input);
        this.input.id = 'CANVAS_TOOLBAR_INPUT';

        this.mirrorCtx.font = '16px Arial';
        this.mirrorCtx.fillStyle = COLOR_RED;
    }

    hideInput () {
        this.input.style.left = '-9999px';
        this.input.style.top = '-9999px';
        this.input.value = '';
        setTimeout(() => {
            this.input.blur();
        }, 50);
    }

    showInput (e) {
        this.input.style.left = e.pageX + 'px';
        this.input.style.top = e.pageY - 10 + 'px';
        this.input.style.zIndex = '9999';
        setTimeout(() => {
            this.input.focus();
        }, 50);
    }

    setPaintStyle () {
        this.mirrorCtx.lineWidth = 2;
        this.mirrorCtx.lineCap = "round";
        this.mirrorCtx.lineJoin = "round";
        this.mirrorCtx.strokeStyle = COLOR_RED;
        this.mirrorCtx.shadowBlur = 0;
    }

    mousedownHandler (e) {
        this.startPos = this.getPos(e);
        
        this.mirrorCtx.beginPath();

        if (this.toolType == 'brush') {
            // 随机颜色
            this.randomColor = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
        }

        if (this.toolType == 'text') {
            this.drawText(e);
        }
        
        document.onmousemove = e => {
            this.mousemoveHandler(e)
        };

        document.onmouseup = () => {
            this.ctx.drawImage(this.mirrorCanvas, 0, 0);
            this.mirrorCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            document.onmousemove = null;
            document.onmouseu = null;
        };
    }

    mousemoveHandler (e) {
        this.mirrorCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        switch (this.toolType) {
            case 'pencil':
                this.drawPencil(e);
                break;
            case 'ellipse':
                this.drawEllipse(e);
                break;
            case 'rectangle':
                this.drawRectangle(e);
                break;
            case 'brush':
                this.drawBrush(e);
                break;
        }
    }

    drawPencil(e) {
        let pos = this.getPos(e);
        this.mirrorCtx.lineTo(pos.x, pos.y);
        this.mirrorCtx.stroke();
    }

    drawEllipse (e) {
        let pos = this.getPos(e),
            scaleX = (pos.x - this.startPos.x) / 2,
            scaleY = (pos.y - this.startPos.y) / 2,
            x = (this.startPos.x / scaleX) + 1,
            y = (this.startPos.y / scaleY) + 1;
        
        this.mirrorCtx.save();
        this.mirrorCtx.beginPath();
        this.mirrorCtx.scale(scaleX, scaleY);
        this.mirrorCtx.arc(x, y, 1, 0, 2 * Math.PI);
        this.mirrorCtx.restore();
        this.mirrorCtx.closePath();
        this.mirrorCtx.stroke();
    }

    drawRectangle (e) {
        let pos = this.getPos(e),
            width = pos.x - this.startPos.x,
            height = pos.y - this.startPos.y;
        
        this.mirrorCtx.strokeRect(this.startPos.x, this.startPos.y, width, height);
    }

    drawBrush (e) {
        this.mirrorCtx.lineWidth = 20;
        this.mirrorCtx.shadowBlur = 20;
        this.mirrorCtx.shadowColor = '#000';
        this.mirrorCtx.strokeStyle = this.randomColor;

        this.drawPencil(e)
    }

    drawText (e) {
        this.showInput(e);

        // this.input.onblur = ev => {
        //     _fillText(ev);
        // }

        this.input.onkeyup = ev => {
            if (ev.keyCode === 13) {
                _fillText(ev);
            }
        }

        const _fillText = ev => {
            let pos = this.getPos(e);
            this.mirrorCtx.fillText(ev.target.value, pos.x, pos.y);
            this.hideInput();
        }
    }

    getPos (e) {
        let canvasOffset = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - canvasOffset.left),
            y: (e.clientY - canvasOffset.top)
        }
    }

    renderCursor () {
        let cursor = '';
        switch (this.toolType) {
            case 'pencil':
                cursor = 'pencil';
                break;
            case 'ellipse':
            case 'rectangle':
                cursor = 'crosshair';
                break;
            case 'brush':
                cursor = 'brush';
                break;
            case 'text':
                cursor = 'text';
                break;
        }
        if(cursor) {
            this.mirrorCanvas.classList.remove('pencil', 'crosshair', 'brush', 'text');
            this.mirrorCanvas.classList.add(cursor);
        }
    }

    renderToolBar () {
        this.$container = this.options.toolBar;
        this.$container.innerHTML = TEMPLATE.toolbar;
        let $toolbar = this.$container.querySelector('.js-toolbar');
        
        $toolbar.addEventListener('click', e => {
            let $items = $toolbar.querySelectorAll('.js-item'),
                $target = e.target;
            $items.forEach($item => {
                $item.classList.remove('active');
            });
            $target.classList.add('active');

            this.toolType = $target.type;
            this.hideInput();
            this.renderCursor();
            this.setPaintStyle();
        });
    }
}

export default CanvasToolkit;