/**
 * Image Processor
 */
window.AgencyTool = window.AgencyTool || {};

window.AgencyTool.ImageProcessor = {
    async processImage(file, settings) {
        try {
            const { changeExtension } = window.AgencyTool.Helpers;

            // Options for browser-image-compression
            const options = {
                maxSizeMB: 100,
                maxWidthOrHeight: undefined,
                useWebWorker: true,
                initialQuality: settings.quality / 100,
            };

            // Handle Resize
            if (settings.resize) {
                if (settings.width && settings.height) {
                    options.maxWidthOrHeight = Math.max(settings.width, settings.height);
                } else if (settings.width) {
                    options.maxWidthOrHeight = settings.width;
                } else if (settings.height) {
                    options.maxWidthOrHeight = settings.height;
                }
            }

            // Handle Format Conversion
            if (settings.format && settings.format !== 'original') {
                options.fileType = settings.format;
            }

            // Compress
            // Note: imageCompression is global from CDN
            let compressedFile = await imageCompression(file, options);

            // If format conversion happened, ensure extension is correct
            let newName = file.name;
            if (settings.format && settings.format !== 'original') {
                const extMap = {
                    'image/jpeg': 'jpg',
                    'image/png': 'png',
                    'image/webp': 'webp'
                };
                const newExt = extMap[settings.format];
                if (newExt) {
                    newName = changeExtension(file.name, newExt);
                    compressedFile = new File([compressedFile], newName, { type: settings.format });
                }
            }

            return {
                originalName: file.name,
                name: newName,
                originalSize: file.size,
                newSize: compressedFile.size,
                blob: compressedFile,
                file: compressedFile
            };

        } catch (error) {
            console.error("Error processing image:", error);
            throw error;
        }
    }
};
