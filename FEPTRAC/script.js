// Elements from the DOM
const qrVideo = document.getElementById('qr-video');
const studentName = document.getElementById('student-name');
const studentId = document.getElementById('student-id');
const status = document.getElementById('status');

// Mock student database
const studentDatabase = {
    "123456": { name: "Djames So pogi", email: "parent1@example.com" },
    "789012": { name: "Jane Smith", email: "parent2@example.com" },
    "6969696969": { name: "Djames So Pogi", email: "djames@example.com" } // New student
};

// QRScanner instance
let qrScanner;

// Function to start scanning
function startScanning() {
    console.log('Initializing QR Scanner...');
    status.textContent = "Status: Initializing scanner...";
    status.style.color = "blue";

    qrScanner = new QrScanner(
        qrVideo,
        result => handleQRCode(result),
        {
            highlightScanRegion: true, // Optional: highlights the scan area
            highlightCodeOutline: true // Optional: highlights the detected QR code
        }
    );

    qrScanner.start().then(() => {
        console.log('QR Scanner started');
        status.textContent = "Status: Scanning for QR code... Please show your QR code to the camera.";
        status.style.color = "blue";
        // Add a text indicator that the scanner is working
        const scanningIndicator = document.createElement('p');
        scanningIndicator.id = 'scanning-indicator';
        scanningIndicator.textContent = "Scanner is working... Please show your QR code to the camera.";
        scanningIndicator.style.color = "blue";
        status.appendChild(scanningIndicator);
    }).catch(err => {
        console.error('Error starting QR scanner:', err);
        status.textContent = "Status: Error accessing camera.";
        status.style.color = "red";
    });
}

// Function to handle QR code result
function handleQRCode(result) {
    console.log('QR Code detected:', result);
    const scannedId = result;
    if (studentDatabase[scannedId]) {
        const student = studentDatabase[scannedId];
        studentName.textContent = `Name: ${student.name}`;
        studentId.textContent = `ID: ${scannedId}`;
        status.textContent = "Status: QR code scanned successfully!";
        status.style.color = "green";
        qrScanner.stop(); // Stop scanning after successful scan
        // Remove the scanning indicator
        const scanningIndicator = document.getElementById('scanning-indicator');
        if (scanningIndicator) {
            scanningIndicator.remove();
        }
    } else {
        status.textContent = "Status: Student not found!";
        status.style.color = "red";
        // Remove the scanning indicator
        const scanningIndicator = document.getElementById('scanning-indicator');
        if (scanningIndicator) {
            scanningIndicator.remove();
        }
    }
}

// Automatically start scanning when the page loads
window.addEventListener('load', startScanning);

// Test camera access
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        qrVideo.srcObject = stream;
        qrVideo.play();
        console.log('Camera access granted');
    })
    .catch(err => {
        console.error('Error accessing camera:', err);
        status.textContent = "Status: Error accessing camera.";
        status.style.color = "red";
    });
