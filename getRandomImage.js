const fs = require('fs');
const path = require('path');

function getAllFilesInDirectory(dirPath) {
    return fs.readdirSync(dirPath);
}

function getRandomFile(files) {
    const randomIndex = Math.floor(Math.random() * files.length);
    return files[randomIndex];
}

function getRandomImagePath(imageDirectory) {
    const imageFiles = getAllFilesInDirectory(imageDirectory).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif';
    });

    const randomImageFile = getRandomFile(imageFiles);
    return path.join(imageDirectory, randomImageFile);
}

module.exports = getRandomImagePath;
