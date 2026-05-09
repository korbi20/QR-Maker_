// Hilfsfunktion: Findet den Canvas im Haupt-Display
const getCanvas = () => document.querySelector('#qr-display canvas');

function downloadPNG(count) {
    const canvas = getCanvas();
    if (canvas) {
        const link = document.createElement('a');
        link.download = `qr-maker_${count}.png`; 
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}

function downloadSVG(count) {
    const canvas = getCanvas();
    if (!canvas) return;
    const size = canvas.width;
    const dataUrl = canvas.toDataURL('image/png');
    
    const svgContent = `
        <svg xmlns="http://w3.org" width="${size}" height="${size}">
            <image href="${dataUrl}" width="${size}" height="${size}" />
        </svg>`;
    
    const blob = new Blob([svgContent], {type: 'image/svg+xml'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `qr-maker_${count}.svg`;
    link.click();
}

function copyBase64() {
    const canvas = getCanvas();
    if (canvas) {
        const base64 = canvas.toDataURL('image/png');
        navigator.clipboard.writeText(base64);
        console.log("Base64 kopiert!");
    }
}

export function setupExport(triggerId, modalId, previewId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const preview = document.getElementById(previewId);

    if (!trigger || !modal || !preview) return;

    // Funktionen an window hängen, damit onclick im HTML funktioniert
    window.downloadPNG = () => downloadPNG(window.count || 0);
    window.downloadSVG = () => downloadSVG(window.count || 0);
    window.copyBase64 = () => copyBase64();

    // Modal öffnen
    trigger.onclick = () => {
        modal.style.display = 'flex';
        const currentCanvas = getCanvas();
        preview.innerHTML = ''; 
        if (currentCanvas) {
            const clone = currentCanvas.cloneNode(true);
            clone.style.opacity = "1";
            preview.appendChild(clone);
        }
    };

    // Modal schließen bei Klick außerhalb
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}
// [ ]: Erstellung von SVG Export, sowie der üperprüfung der besthenden function und verknüpung zu index.html