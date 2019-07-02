/**
 * @description: 数组数据导出csv
 * @param {options} 
 * @param {array}  data 数据
 * @param {array} columns 表头
 * @return: void 下载文件
 */
const array2CsvString = options => {
    let arrData = options.data,
        columns = options.columns || [],
        csvString = '';

    if (columns.length) {
        csvString = columns.join(',') + '\r\n';
    }

    csvString += arrData.map(
        n => {
            for (let key in n) {
                return Object.values(n).join(',');
            }
        }
    ).join('\r\n');

    return '\ufeff' + csvString;
}

// value -> label
const value2LabelMap = (maps = [], value) => {
    let ret = {};
    for (let i = 0, len = maps.length; i < len; i++) {
        ret[maps[i].value] = maps[i].label;

    }
    return ret[value];
}


module.exports = {
    array2CsvString,
    value2LabelMap
};

