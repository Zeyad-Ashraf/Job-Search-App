import multer from 'multer';

export const fileTypes = {
    image: ['image/png', 'image/jpeg', 'image/jpg'],
    video: ['video/mp4'],
    audio: ['audio/mpeg'],
    pdf: ['application/pdf']
}

export const multerCloudinary = (customValidation = []) => {
    const storage = multer.diskStorage({});

    function fileFilter (req, file, cb) {
        if (!customValidation.includes(file.mimetype))
            return cb(new Error("invalid file type"), false);

        return cb(null, true);
    }

    const upload = multer({ storage, fileFilter });
    
    return upload;
}