const multer=require('multer')
const fs=require('fs')

// Return multer object

module.exports = {                                          //file uploader ini adalah sebuah method berisi objek
    uploader(destination, fileNamePrefix){                  // method ini menerima dua jenis parameter yaitu detination & fileNamePrefix
        let defaultPath = './public';                       //destination=folder tempat naruh file yang di upload
    
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const dir = defaultPath + destination;
                if (fs.existsSync(dir)) {
                    console.log(dir, "exists")
                    cb(null, dir);
                } else {
                    fs.mkdir(dir,{recursive:true}, err => cb(err, dir));
                    console.log(dir, "make")
                }
            },
            filename: (req, file, cb) => {
                let originalname = file.originalname;
                let ext = originalname.split('.');
                let filename = fileNamePrefix + Date.now() + '.' + ext[ext.length - 1];
                cb(null, filename);
            }
        });
    
        const imageFilter = (req, file, callback) => {
            const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx)$/;                      //jenis file yang boleh diupload, bisa ditambah/kurang formatnya
            if (!file.originalname.match(ext)) {
                return callback(new Error('Only selected file type are allowed'), false);
            }
            callback(null, true);
        };

        return multer({
            storage: storage,
            fileFilter: imageFilter
        });
    }
}