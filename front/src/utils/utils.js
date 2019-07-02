function paddingZero(num) {
    return num < 10 ? '0' + num : num;
}

/**
* @description: 文本内容保存为文件并下载
* @param { String } content 文本字符串
* @param { String } filename 下载的文件名 + 后缀名
* @return 
*/
export function downloadFile (content, filename) {
    let link = document.createElement('a');
    link.download = filename || 'file';
    link.style.display = 'none';
    let blob = new Blob([content]);
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
* @description: 
* @param { Object } file 二进制文件
* @param { cb } file 读取后回调
* @return 
*/    
export function readTextFile (file, cb) {
    let reader = new FileReader();
    reader.onload = function (e) {
        let result = JSON.parse(e.target.result);
        cb(result);
    };
    reader.readAsText(file);
}

/**
* @description: transform seconds to format like 'HH:mm:ss'
* @param {Number} secs
* @return: String
*/
export function formatTime (secs) {
    let minutes = 0,
        seconds = 0;
    if (secs > 60) {
        minutes = Math.floor(secs / 60);
        seconds = secs - minutes * 60;
    } else {
        seconds = secs;
    }
    return paddingZero(minutes) + ':' + paddingZero(seconds)
}

/**
* @description: 为canvas设置画笔
* @param {canvasElement} canvas节点
* @param {Number} number  canvas缩放比例，与html2canvas的参数scale一致
* @return: 
*/
export function initCanvasDrawing(canvas, scale) {
    scale = scale || window.devicePixelRatio;
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = 'red';

    canvas.onmousedown = function (e) {
        let offset = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo((e.clientX - offset.left) * scale, (e.clientY - offset.top) * scale);
        
        document.onmousemove = function (e) {
            ctx.lineTo((e.clientX - offset.left) * scale, (e.clientY - offset.top) * scale);
            ctx.stroke();
        }
        document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
            ctx.closePath();
        }

    }
}

export function serialize (params) {
    return Object.entries(params).map(item => { return `${item[0]}=${item[1]}` }).join('&');
}