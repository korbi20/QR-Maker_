const getCanvas = () =>
    document.querySelector('#qr-display canvas');

let exportCount = 0;

function getExportColor() {
    // Wenn Modus 'dark', dann weißer QR-Code, sonst schwarzer QR-Code
    return currentMode === 'dark' ? '#ffffff' : '#000000';
}

function downloadPNG() {
    const canvas = getCanvas();
    if (!canvas || !qrObj) return;

    // 1. Farbe kurzzeitig für Export ändern
    const originalColor = qrObj.foreground;
    qrObj.set({ foreground: getExportColor() });

    // 2. Download ausführen
    const link = document.createElement('a');
    link.download = `qr-maker_${currentQRValue}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    // 3. Farbe zurücksetzen auf Vorschau-Farbe
    qrObj.set({ foreground: originalColor });
}

function downloadJPG() {
    const canvas = getCanvas();
    if (!canvas || !qrObj) return;

    const originalColor = qrObj.foreground;
    qrObj.set({ foreground: getExportColor() });

    const jpgCanvas = document.createElement('canvas');
    jpgCanvas.width = canvas.width;
    jpgCanvas.height = canvas.height;
    const ctx = jpgCanvas.getContext('2d');

    // JPG Hintergrund: Weiß bei Lightmode, Schwarz bei Darkmode? 
    // Meistens ist Weiß für QR besser lesbar:
    ctx.fillStyle = currentMode === 'dark' ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);

    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `qr-maker_${currentQRValue}.jpg`;
    link.href = jpgCanvas.toDataURL('image/jpeg', 0.92);
    link.click();

    qrObj.set({ foreground: originalColor });
}

function downloadBase64() {
    const canvas = getCanvas();
    if (!canvas || !qrObj) return;

    const originalColor = qrObj.foreground;
    qrObj.set({ foreground: getExportColor() });

    const base64 = canvas.toDataURL('image/png');
    navigator.clipboard.writeText(base64);
    
    qrObj.set({ foreground: originalColor });
    alert('Base64 in Dark/Light-Optik kopiert!');
}

function downloadSVG() {
    const canvas = getCanvas();
    if (!canvas || !qrObj) return;

    // 1. Farbe für den Export erzwingen (Logik A Status)
    const originalColor = qrObj.foreground;
    const exportColor = currentMode === 'dark' ? '#ffffff' : '#000000';
    qrObj.set({ foreground: exportColor });

    // 2. Jetzt erst den Snapshot für das SVG machen
    const size = canvas.width;
    const dataUrl = canvas.toDataURL('image/png');

    // Das SVG-Gerüst bauen
    const svgContent = `
<svg xmlns="http://w3.org" 
     width="${size}" 
     height="${size}" 
     viewBox="0 0 ${size} ${size}">
    <rect width="100%" height="100%" fill="${currentMode === 'dark' ? '#000000' : 'none'}" />
    <image href="${dataUrl}" width="${size}" height="${size}" />
</svg>
`;

    const blob = new Blob(
        [svgContent],
        { type: 'image/svg+xml;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-maker_${currentQRValue}.svg`;
    link.click();

    // 3. Wichtig: UI wieder auf die ursprüngliche Vorschau-Farbe zurücksetzen
    URL.revokeObjectURL(url);
    qrObj.set({ foreground: originalColor });
}


function openModal(modal, preview) {
    modal.style.display = 'flex';

    const currentCanvas = getCanvas();

    preview.innerHTML = '';

    if (currentCanvas) {
        const clone = currentCanvas.cloneNode(true);

        clone.style.opacity = '1';

        preview.appendChild(clone);
    }
}

function triggerModalClose() {
    const modal = document.getElementById('export-modal');
    modal.classList.add('fade-out');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fade-out');
    }, 300);
}

export function setupExport(triggerId, modalId, previewId) {

    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const preview = previewId ? document.getElementById(previewId) : null;
    window.downloadPNG = downloadPNG;
    window.downloadSVG = downloadSVG;
    window.downloadJPG = downloadJPG;
    window.downloadBase64 = downloadBase64;

    if (!trigger || !modal) {
        console.warn('Export setup failed');
        return;
    }

    trigger.addEventListener('click', () => {

        modal.style.display = 'flex';

        if (preview) {
            const currentCanvas = document.querySelector('#qr-display canvas');
            preview.innerHTML = '';

            if (currentCanvas) {
                const clone = currentCanvas.cloneNode(true);
                clone.style.opacity = '1';
                preview.appendChild(clone);
            }
        }
    });
}