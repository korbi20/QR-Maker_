const getCanvas = () =>
    document.querySelector('#qr-display canvas');

let exportCount = 0;

function downloadPNG() {
    const canvas = getCanvas();

    if (!canvas) return;

    const link = document.createElement('a');

    link.download = `qr-maker_${exportCount++}.png`;
    link.href = canvas.toDataURL('image/png');

    link.click();
}

function downloadJPG() {
    const canvas = getCanvas();

    if (!canvas) return;

    const jpgCanvas = document.createElement('canvas');

    jpgCanvas.width = canvas.width;
    jpgCanvas.height = canvas.height;

    const ctx = jpgCanvas.getContext('2d');

    // JPG braucht Hintergrund
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);

    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');

    link.download = `qr-maker_${exportCount++}.jpg`;
    link.href = jpgCanvas.toDataURL('image/jpeg', 0.92);

    link.click();
}

function downloadSVG() {
    const canvas = getCanvas();

    if (!canvas) return;

    const size = canvas.width;

    const dataUrl = canvas.toDataURL('image/png');

    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${size}"
     height="${size}">
    <image
        href="${dataUrl}"
        width="${size}"
        height="${size}" />
</svg>
`;

    const blob = new Blob(
        [svgContent],
        {
            type: 'image/svg+xml;charset=utf-8'
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `qr-maker_${exportCount++}.svg`;

    link.click();

    URL.revokeObjectURL(url);
}

function downloadBase64() {
    const canvas = getCanvas();

    if (!canvas) return;

    const base64 = canvas.toDataURL('image/png');

    navigator.clipboard.writeText(base64);

    console.log('Base64 copied');
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

function setupShortcuts(modal) {
    window.addEventListener('keydown', (e) => {

        if (modal.style.display !== 'flex') return;

        switch (e.key) {

            case '1':
                downloadPNG();
                break;

            case '2':
                downloadSVG();
                break;

            case '3':
                downloadJPG();
                break;

            case '4':
                downloadBase64();
                break;

            case 'Escape':
                modal.style.display = 'none';
                break;
        }
    });
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