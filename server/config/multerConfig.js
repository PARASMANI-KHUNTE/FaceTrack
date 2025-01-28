// const multer = require('multer');
// const path = require('path');

// // Multer storage configuration
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//     // Accept only specific file types (images)
//     const fileTypes = /jpeg|jpg|png|gif/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'), false);
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
// });

// module.exports = upload;
