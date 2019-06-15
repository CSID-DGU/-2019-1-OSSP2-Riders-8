var file;
var oldName;
const flag = [
    'setInit', 'nextFile', 'noBuild'
];

module.exports.isBuild = function(content, name) {
    if (file == undefined) { 
        file = [content, name];
        return flag[0];
    } else if (file[1] !== name) { 
        file = null;
        file = [content, name];
        return flag[1];
    }
};

module.exports.setOldName = function(content, name) {
    file = null;
    file = [content, name];
}

export {
    flag
};