var file;
const flag = [
    'setInit', 'nextFile', 'goBuild'
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

export {
    flag
};