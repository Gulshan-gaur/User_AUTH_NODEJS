const sharp = require('sharp');
const uuidv4 = require('uuidv4');
const path = require('path');

class Resize{
    constructor(folder){
        this.folder= folder
    }
    async save(buffer){
        const filename = Resize.filename();
        const filepath = this.filepath(filename);
        await sharp(buffer)
            .resize(1600,1600,{
                fit: sharp.fit.inside,
                withoutEnlargement:true
            })
            .toFile(filepath);

            return filename;
        
    }
    static filename(){
        return `${uuidv4()}.jpg`;
    }
    filepath(filename){
        return path.resolve(`${this.folder}/${filename}`)
    }
}
module.exports = Resize;