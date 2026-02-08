/**
 * Main App
 */
window.AgencyTool = window.AgencyTool || {};

(function () {
    const { UI, ImageProcessor, ZipExport, Helpers } = window.AgencyTool;

    class App {
        constructor() {
            this.files = [];
            this.isProcessing = false;
            this.results = [];
            this.init();
        }

        init() {
            // Initialize UI Events
            UI.initDropZone((fileList) => this.handleFiles(fileList));

            // Settings Listeners
            this.bindSettingsEvents();

            // Global Buttons
            document.getElementById('process-btn').addEventListener('click', () => this.processImages());
            document.getElementById('download-zip').addEventListener('click', () => this.downloadAll());
            document.getElementById('reset-btn').addEventListener('click', () => this.reset());
            document.getElementById('clear-all-btn').addEventListener('click', () => this.reset());

            // Nav Buttons
            const navBtns = document.querySelectorAll('.nav-btn');
            navBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    navBtns.forEach(b => b.classList.remove('active', 'text-slate-900', 'bg-white', 'shadow-sm'));
                    navBtns.forEach(b => b.classList.add('text-slate-600'));

                    e.target.classList.add('active');
                    e.target.classList.remove('text-slate-600');

                    const tool = e.target.dataset.tool;
                    this.updateToolView(tool);
                });
            });
        }

        updateToolView(tool) {
            const title = document.getElementById('tool-title');
            const desc = document.getElementById('tool-desc');

            if (tool === 'compress') {
                title.textContent = 'Compress Images';
                desc.textContent = 'Reduce file size while maintaining the best quality.';
                document.getElementById('settings-compress').scrollIntoView({ behavior: 'smooth' });
            } else if (tool === 'convert') {
                title.textContent = 'Convert Images';
                desc.textContent = 'Convert your images to JPG, PNG, or WebP.';
            } else if (tool === 'resize') {
                title.textContent = 'Resize Images';
                desc.textContent = 'Resize images by defining pixels or percentage.';
                const resizeCheck = document.getElementById('resize-enable');
                if (!resizeCheck.checked) resizeCheck.click();
            }
        }

        bindSettingsEvents() {
            const qualitySlider = document.getElementById('quality-slider');
            const qualityValue = document.getElementById('quality-value');
            if (qualitySlider) {
                qualitySlider.addEventListener('input', (e) => {
                    qualityValue.textContent = `${e.target.value}%`;
                });
            }

            const resizeEnable = document.getElementById('resize-enable');
            const resizeOptions = document.getElementById('resize-options');
            if (resizeEnable) {
                resizeEnable.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        resizeOptions.classList.remove('opacity-50', 'pointer-events-none');
                    } else {
                        resizeOptions.classList.add('opacity-50', 'pointer-events-none');
                    }
                });
            }

            const resizePreset = document.getElementById('resize-preset');
            const resizeWidth = document.getElementById('resize-width');
            const resizeHeight = document.getElementById('resize-height');

            if (resizePreset) {
                resizePreset.addEventListener('change', (e) => {
                    const val = e.target.value;
                    if (val !== 'custom') {
                        resizeWidth.value = val;
                        resizeHeight.value = '';
                    }
                });
            }
        }

        handleFiles(fileList) {
            const newFiles = Array.from(fileList).filter(file => Helpers.isValidFileType(file));

            if (newFiles.length === 0) {
                alert('Please upload valid image files (JPG, PNG, WebP).');
                return;
            }

            this.files = [...this.files, ...newFiles];

            if (this.files.length > 0) {
                UI.showFileList();
                UI.clearFileGrid();
                this.files.forEach((file, index) => {
                    UI.renderFilePreview(file, index, (idx) => this.removeFile(idx));
                });
            }
        }

        removeFile(index) {
            this.files.splice(index, 1);
            UI.clearFileGrid();

            if (this.files.length === 0) {
                UI.resetUI();
            } else {
                this.files.forEach((file, idx) => {
                    UI.renderFilePreview(file, idx, (i) => this.removeFile(i));
                });
            }
        }

        async processImages() {
            if (this.files.length === 0 || this.isProcessing) return;

            this.isProcessing = true;
            UI.setProcessingState(true);
            this.results = [];

            const settings = {
                quality: parseInt(document.getElementById('quality-slider').value),
                resize: document.getElementById('resize-enable').checked,
                width: document.getElementById('resize-width').value ? parseInt(document.getElementById('resize-width').value) : undefined,
                height: document.getElementById('resize-height').value ? parseInt(document.getElementById('resize-height').value) : undefined,
                format: document.getElementById('convert-format').value
            };

            let processedCount = 0;
            let totalOriginalSize = 0;
            let totalNewSize = 0;

            for (const file of this.files) {
                try {
                    const result = await ImageProcessor.processImage(file, settings);
                    this.results.push(result);

                    totalOriginalSize += result.originalSize;
                    totalNewSize += result.newSize;
                } catch (err) {
                    console.error(`Failed to process ${file.name}`, err);
                }

                processedCount++;
                const percent = (processedCount / this.files.length) * 100;
                UI.updateProgressBar(percent);
            }

            UI.setProcessingState(false);
            UI.showResults(this.results, totalOriginalSize, totalNewSize);
        }

        downloadAll() {
            if (this.results.length === 0) return;
            ZipExport.downloadZip(this.results);
        }

        reset() {
            this.files = [];
            this.results = [];
            this.isProcessing = false;
            UI.resetUI();
        }
    }

    // Start App
    new App();
})();
