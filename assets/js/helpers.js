/**
 * Helper functions
 */
window.AgencyTool = window.AgencyTool || {};

window.AgencyTool.Helpers = {
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },

    changeExtension(filename, newExt) {
        const pos = filename.lastIndexOf(".");
        return filename.substr(0, pos < 0 ? filename.length : pos) + "." + newExt;
    },

    isValidFileType(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (validTypes.includes(file.type)) return true;
        const ext = this.getFileExtension(file.name).toLowerCase();
        const validExts = ['jpg', 'jpeg', 'png', 'webp'];
        return validExts.includes(ext);
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
