/**
 * UI Logic
 */
window.AgencyTool = window.AgencyTool || {};

(function () {
    // DOM Elements (Cached)
    let dropZone, fileListContainer, fileGrid, fileInput, processBtn,
        settingsPanel, resultArea, resultGrid, progressBar, progressText, processingProgress;

    // We init DOM elements inside a function to ensure they exist (though script is at bottom of body)
    function getElements() {
        dropZone = document.getElementById('drop-zone');
        fileListContainer = document.getElementById('file-list-container');
        fileGrid = document.getElementById('file-grid');
        fileInput = document.getElementById('file-input');
        processBtn = document.getElementById('process-btn');
        settingsPanel = document.getElementById('settings-panel');
        resultArea = document.getElementById('result-area');
        resultGrid = document.getElementById('result-grid');
        progressBar = document.getElementById('progress-bar');
        progressText = document.getElementById('progress-text');
        processingProgress = document.getElementById('processing-progress');
    }

    const { formatBytes } = window.AgencyTool.Helpers;

    window.AgencyTool.UI = {
        initDropZone(onFilesDropped) {
            getElements();

            // Drag Over
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });

            // Drag Leave
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
            });

            // Drop
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                if (e.dataTransfer.files.length > 0) {
                    onFilesDropped(e.dataTransfer.files);
                }
            });

            // Click to upload (Make entire area clickable)
            dropZone.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                fileInput.click();
            });

            // Button specific click
            dropZone.querySelector('button').addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    onFilesDropped(e.target.files);
                    fileInput.value = '';
                }
            });

            // Add more files button
            document.getElementById('add-more-btn').addEventListener('click', () => {
                fileInput.click();
            });
        },

        showFileList() {
            dropZone.classList.add('hidden');
            fileListContainer.classList.remove('hidden');
            fileListContainer.classList.add('flex');
            processBtn.disabled = false;
        },

        resetUI() {
            dropZone.classList.remove('hidden');
            fileListContainer.classList.add('hidden');
            fileListContainer.classList.remove('flex');
            fileGrid.innerHTML = '';
            resultGrid.innerHTML = '';
            resultArea.classList.add('hidden');
            processBtn.disabled = true;
            processingProgress.classList.add('hidden');
            this.updateProgressBar(0);

            document.getElementById('quality-slider').value = 80;
            document.getElementById('quality-value').textContent = '80%';
        },

        renderFilePreview(file, index, onRemove) {
            const div = document.createElement('div');
            // DARK THEME: Glass card style
            div.className = 'relative group glass p-3 rounded-xl file-card fade-in';
            div.dataset.index = index;

            const formatBytesFunc = window.AgencyTool.Helpers.formatBytes;

            const imgUrl = URL.createObjectURL(file);

            // DARK THEME: Dark background for image container, white text
            div.innerHTML = `
                <div class="aspect-square rounded-lg overflow-hidden bg-slate-800/50 mb-3 relative border border-white/5">
                    <img src="${imgUrl}" class="w-full h-full object-cover" alt="${file.name}">
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span class="text-white text-xs font-bold px-2 py-1 bg-black/40 rounded-lg">${formatBytesFunc(file.size)}</span>
                    </div>
                </div>
                <div class="truncate text-xs font-semibold text-slate-300 px-1" title="${file.name}">${file.name}</div>
                <button type="button" class="remove-btn absolute -top-2 -right-2 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-full p-1.5 shadow-lg shadow-rose-500/30 opacity-0 transition-all transform hover:scale-110 group-hover:opacity-100" aria-label="Remove">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            `;

            div.querySelector('.remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                onRemove(index);
            });

            fileGrid.appendChild(div);
        },

        clearFileGrid() {
            fileGrid.innerHTML = '';
        },

        updateProgressBar(percent) {
            progressBar.style.width = `${percent}%`;
            progressText.textContent = `${Math.round(percent)}%`;
            if (percent > 0 && percent < 100) {
                processingProgress.classList.remove('hidden');
            }
        },

        setProcessingState(isProcessing) {
            processBtn.disabled = isProcessing;
            if (isProcessing) {
                processBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                `;
            } else {
                processBtn.innerHTML = `
                    <span class="group-hover:scale-105 transition-transform">Process Images</span>
                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                `;
                processingProgress.classList.add('hidden');
            }
        },

        showResults(results, totalOriginalSize, totalNewSize) {
            resultArea.classList.remove('hidden');
            resultGrid.innerHTML = '';

            resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

            const { formatBytes } = window.AgencyTool.Helpers;

            const savedBytes = totalOriginalSize - totalNewSize;
            const savedPercent = totalOriginalSize > 0 ? ((savedBytes / totalOriginalSize) * 100).toFixed(1) : 0;

            document.getElementById('total-saved').textContent = `${savedPercent}%`;
            document.getElementById('total-reduction').textContent = formatBytes(savedBytes);

            results.forEach(res => {
                const div = document.createElement('div');
                // DARK THEME: Glass card style
                div.className = 'glass rounded-xl p-3 fade-in hover:bg-white/5 transition-colors';

                const savedItemBytes = res.originalSize - res.newSize;
                const savedItemPercent = ((savedItemBytes / res.originalSize) * 100).toFixed(0);

                div.innerHTML = `
                    <div class="flex gap-4">
                        <div class="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                             <img src="${URL.createObjectURL(res.blob)}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-grow min-w-0 flex flex-col justify-center">
                            <h4 class="text-sm font-semibold text-white truncate" title="${res.name}">${res.name}</h4>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-xs text-slate-500 line-through">${formatBytes(res.originalSize)}</span>
                                <span class="text-xs font-bold text-emerald-400">${formatBytes(res.newSize)}</span>
                            </div>
                            <div class="text-xs text-emerald-500 font-medium mt-0.5">-${savedItemPercent}%</div>
                        </div>
                    </div>
                    <a href="${URL.createObjectURL(res.blob)}" download="${res.name}" class="mt-3 block w-full bg-white/5 hover:bg-white/10 text-white text-center text-sm font-medium py-2.5 rounded-lg transition-colors border border-white/5">
                        Download
                    </a>
                `;
                resultGrid.appendChild(div);
            });
        }
    };
})();
