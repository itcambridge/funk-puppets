import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    console.log('Starting PNG compression...');
    
    try {
        const files = await imagemin(['public/assets/images/*.png'], {
            destination: 'public/assets/images/compressed',
            plugins: [
                imageminPngquant({
                    quality: [0.6, 0.8],
                    speed: 4,
                    strip: true
                })
            ]
        });

        console.log('PNGs compressed successfully!');
        files.forEach(file => {
            console.log('Compressed:', file.destinationPath);
        });
    } catch (error) {
        console.error('Error compressing PNGs:', error);
    }
})(); 