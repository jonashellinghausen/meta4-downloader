// Meta4 File Downloader Application
class Meta4Parser {
    constructor() {
        this.metalinkData = null;
        this.init();
    }

    init() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        // Click to select file
        dropZone.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFile(file);
            }
        });

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');

            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFile(file);
            }
        });
    }

    handleFile(file) {
        // Check file extension
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.meta4') && !fileName.endsWith('.metalink')) {
            alert('Bitte wählen Sie eine .meta4 oder .metalink Datei aus.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.parseMetalink(e.target.result);
            } catch (error) {
                console.error('Error parsing file:', error);
                alert('Fehler beim Parsen der Datei: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    parseMetalink(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('XML-Parsing-Fehler: Ungültige Meta4-Datei');
        }

        // Get metalink root element
        const metalink = xmlDoc.querySelector('metalink');
        if (!metalink) {
            throw new Error('Keine Metalink-Root-Element gefunden');
        }

        // Parse metalink data
        this.metalinkData = {
            generator: metalink.getAttribute('generator') || 'Unknown',
            published: metalink.querySelector('published')?.textContent || 'Unknown',
            updated: metalink.querySelector('updated')?.textContent || 'Unknown',
            files: []
        };

        // Parse files
        const files = xmlDoc.querySelectorAll('file');
        files.forEach(fileNode => {
            const fileData = this.parseFile(fileNode);
            this.metalinkData.files.push(fileData);
        });

        this.displayMetalink();
    }

    parseFile(fileNode) {
        const file = {
            name: fileNode.getAttribute('name') || 'Unknown',
            size: null,
            hashes: [],
            urls: [],
            language: null,
            os: null
        };

        // Size
        const sizeNode = fileNode.querySelector('size');
        if (sizeNode) {
            file.size = parseInt(sizeNode.textContent);
        }

        // Language
        const langNode = fileNode.querySelector('language');
        if (langNode) {
            file.language = langNode.textContent;
        }

        // OS
        const osNode = fileNode.querySelector('os');
        if (osNode) {
            file.os = osNode.textContent;
        }

        // Hashes
        const hashNodes = fileNode.querySelectorAll('hash');
        hashNodes.forEach(hashNode => {
            file.hashes.push({
                type: hashNode.getAttribute('type') || 'unknown',
                value: hashNode.textContent
            });
        });

        // URLs
        const urlNodes = fileNode.querySelectorAll('url');
        urlNodes.forEach(urlNode => {
            file.urls.push({
                url: urlNode.textContent,
                priority: urlNode.getAttribute('priority') || '1',
                location: urlNode.getAttribute('location') || 'Unknown'
            });
        });

        // Sort URLs by priority (lower number = higher priority)
        file.urls.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));

        return file;
    }

    displayMetalink() {
        // Show file info section
        const fileInfoSection = document.getElementById('fileInfoSection');
        const fileInfo = document.getElementById('fileInfo');
        fileInfoSection.classList.remove('hidden');

        // Display general metalink info
        fileInfo.innerHTML = `
            <div class="info-item">
                <span class="info-label">Generator:</span>
                <span class="info-value">${this.escapeHtml(this.metalinkData.generator)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Veröffentlicht:</span>
                <span class="info-value">${this.escapeHtml(this.metalinkData.published)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Aktualisiert:</span>
                <span class="info-value">${this.escapeHtml(this.metalinkData.updated)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Anzahl Dateien:</span>
                <span class="info-value">${this.metalinkData.files.length}</span>
            </div>
        `;

        // Show files section
        const filesSection = document.getElementById('filesSection');
        const filesList = document.getElementById('filesList');
        filesSection.classList.remove('hidden');

        // Display files
        filesList.innerHTML = this.metalinkData.files.map((file, index) =>
            this.createFileCard(file, index)
        ).join('');

        // Add event listeners for download buttons
        this.metalinkData.files.forEach((file, index) => {
            file.urls.forEach((urlData, urlIndex) => {
                const btn = document.getElementById(`download-${index}-${urlIndex}`);
                if (btn) {
                    btn.addEventListener('click', () => this.downloadFile(urlData.url, file.name));
                }
            });
        });
    }

    createFileCard(file, index) {
        const sizeFormatted = this.formatBytes(file.size);

        const hashesHtml = file.hashes.map(hash => `
            <div class="detail-item">
                <span class="detail-label">${this.escapeHtml(hash.type.toUpperCase())}:</span>
                <span class="detail-value">${this.escapeHtml(hash.value)}</span>
            </div>
        `).join('');

        const urlsHtml = file.urls.map((urlData, urlIndex) => `
            <div class="url-item">
                <span class="url-text">${this.escapeHtml(urlData.url)}</span>
                <span class="url-priority">Priorität: ${urlData.priority}</span>
                <button id="download-${index}-${urlIndex}" class="download-btn">Download</button>
            </div>
        `).join('');

        return `
            <div class="file-card">
                <div class="file-header">
                    <h3 class="file-name">${this.escapeHtml(file.name)}</h3>
                    ${file.size ? `<span class="file-size">${sizeFormatted}</span>` : ''}
                </div>

                <div class="file-details">
                    ${file.language ? `
                        <div class="detail-item">
                            <span class="detail-label">Sprache:</span>
                            <span class="detail-value">${this.escapeHtml(file.language)}</span>
                        </div>
                    ` : ''}
                    ${file.os ? `
                        <div class="detail-item">
                            <span class="detail-label">OS:</span>
                            <span class="detail-value">${this.escapeHtml(file.os)}</span>
                        </div>
                    ` : ''}
                    ${hashesHtml}
                </div>

                ${file.urls.length > 0 ? `
                    <div class="urls-section">
                        <h4 class="urls-title">Download-URLs (${file.urls.length})</h4>
                        ${urlsHtml}
                    </div>
                ` : '<p style="color: var(--danger-color);">Keine Download-URLs verfügbar</p>'}
            </div>
        `;
    }

    downloadFile(url, filename) {
        // Create a temporary link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        console.log(`Downloading: ${filename} from ${url}`);
    }

    formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Meta4Parser();
});
