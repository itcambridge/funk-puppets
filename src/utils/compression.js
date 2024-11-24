const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');

(async () => {
    console.log('Starting GIF compression...');
    
    try {
        const files = await imagemin(['public/assets/gifs/*.gif'], {
            destination: 'public/assets/gifs/compressed',
            plugins: [
                imageminGifsicle({
                    optimizationLevel: 2,
                    interlaced: false,
                    colors: 128
                })
            ]
        });

        console.log('GIFs compressed successfully!');
        files.forEach(file => {
            console.log('Compressed:', file.destinationPath);
        });
    } catch (error) {
        console.error('Error compressing GIFs:', error);
    }
})(); 