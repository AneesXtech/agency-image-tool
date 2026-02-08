/**
 * ZIP Export
 */
window.AgencyTool = window.AgencyTool || {};

window.AgencyTool.ZipExport = {
    async downloadZip(files) {
        // JSZip and saveAs are globals from CDN
        const zip = new JSZip();

        files.forEach(file => {
            zip.file(file.name, file.blob);
        });

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "agency_images.zip");
    }
};
