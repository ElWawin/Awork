// Variables globales
let fileContent = null;
let history = [];

// Función para toggle del menú
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Configuración del drag and drop
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFile(files[0]);
});

fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = async (e) => {
        fileContent = e.target.result;
        // Aquí puedes agregar la lógica para procesar diferentes tipos de archivos
        showNotification('Archivo cargado correctamente');
    };

    if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
    } else {
        reader.readAsText(file);
    }
}

async function analyzeContent(type) {
    if (!fileContent) {
        showNotification('Por favor, carga un archivo primero', 'error');
        return;
    }

    // Aquí iría la integración con tu API de IA
    const result = await mockAIAnalysis(type);
    displayResult(result);
    addToHistory(type, result);
}

function mockAIAnalysis(type) {
    // Esta es una función simulada - reemplázala con tu API real
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                type: type,
                content: type === 'summary' ? 
                    'Este es un resumen de ejemplo...' : 
                    'Estas son las respuestas a tus preguntas...'
            });
        }, 1000);
    });
}

function displayResult(result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="result-card">
            <h3>${result.type === 'summary' ? 'Resumen' : 'Respuestas'}</h3>
            <p>${result.content}</p>
        </div>
    `;
}

function addToHistory(type, result) {
    history.unshift({
        timestamp: new Date(),
        type: type,
        result: result
    });
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = history.map(item => `
        <div class="history-item">
            <span class="timestamp">${item.timestamp.toLocaleString()}</span>
            <span class="type">${item.type === 'summary' ? 'Resumen' : 'Preguntas'}</span>
            <p>${item.result.content.substring(0, 100)}...</p>
        </div>
    `).join('');
}

function showNotification(message, type = 'success') {
    // Implementa tu sistema de notificaciones aquí
    alert(message);
}
