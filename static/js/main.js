/**
 * Waste Segregation Web App - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewArea = document.getElementById('previewArea');
    const previewImage = document.getElementById('previewImage');
    const changeBtn = document.getElementById('changeBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsSection = document.getElementById('resultsSection');
    
    let selectedFile = null;
    
    // Browse button click
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
    
    // Upload area click
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Change button click
    changeBtn.addEventListener('click', () => {
        resetUpload();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    // Handle file selection
    function handleFile(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }
        
        // Validate file size (max 16MB)
        if (file.size > 16 * 1024 * 1024) {
            alert('File size must be less than 16MB');
            return;
        }
        
        selectedFile = file;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            uploadArea.style.display = 'none';
            previewArea.style.display = 'block';
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    // Reset upload
    function resetUpload() {
        selectedFile = null;
        fileInput.value = '';
        previewImage.src = '';
        uploadArea.style.display = 'block';
        previewArea.style.display = 'none';
        analyzeBtn.disabled = true;
        resultsSection.style.display = 'none';
    }
    
    // Analyze button click
    analyzeBtn.addEventListener('click', async () => {
        if (!selectedFile) return;
        
        // Show loading state
        const btnText = analyzeBtn.querySelector('.btn-text');
        const btnLoader = analyzeBtn.querySelector('.btn-loader');
        btnText.textContent = 'Analyzing...';
        btnLoader.style.display = 'inline-block';
        analyzeBtn.disabled = true;
        
        // Create form data
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.error) {
                alert('Error: ' + result.error);
                return;
            }
            
            // Display results
            displayResults(result);
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing the image');
        } finally {
            // Reset button state
            btnText.textContent = 'Analyze Waste';
            btnLoader.style.display = 'none';
            analyzeBtn.disabled = false;
        }
    });
    
    // Display results
    function displayResults(result) {
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Classification
        if (result.classification) {
            const wasteType = result.classification.waste_type;
            const confidence = result.classification.confidence;
            
            document.getElementById('wasteType').textContent = wasteType;
            document.getElementById('wasteType').style.color = getWasteColor(wasteType);
            document.getElementById('confidenceFill').style.width = (confidence * 100) + '%';
            document.getElementById('confidenceText').textContent = 
                `Confidence: ${(confidence * 100).toFixed(1)}%`;
            
            // Probability bars
            displayProbabilities(result.classification.all_probabilities);
        }
        
        // Disposal
        if (result.disposal) {
            document.getElementById('binIcon').textContent = result.disposal.icon;
            document.getElementById('binName').textContent = result.disposal.bin;
            document.getElementById('instructions').textContent = result.disposal.instructions;
            document.getElementById('examples').textContent = result.disposal.examples;
        }
        
        // Detection
        if (result.detection) {
            const detected = result.detection.detected;
            document.getElementById('detectionStatus').textContent = 
                detected ? '✅ Waste Detected' : '❌ No Waste Detected';
            document.getElementById('detectionConfidence').textContent = 
                detected ? `Confidence: ${(result.detection.confidence * 100).toFixed(1)}%` : '';
        }
        
        // Anomaly
        if (result.anomaly) {
            const isAnomaly = result.anomaly.is_anomaly;
            const anomalyStatus = document.getElementById('anomalyStatus');
            
            anomalyStatus.textContent = isAnomaly ? '⚠️ Unusual Item' : '✅ Normal Item';
            anomalyStatus.className = 'anomaly-status ' + (isAnomaly ? 'anomaly' : 'normal');
            
            document.getElementById('anomalyScore').textContent = 
                `Score: ${result.anomaly.score.toFixed(2)} (Threshold: 1.0)`;
        }
    }
    
    // Display probability bars
    function displayProbabilities(probabilities) {
        const container = document.getElementById('probabilityBars');
        container.innerHTML = '';
        
        const categories = ['recyclable', 'organic', 'e-waste', 'general'];
        
        categories.forEach(cat => {
            const prob = probabilities[cat] || 0;
            const percentage = (prob * 100).toFixed(1);
            
            const row = document.createElement('div');
            row.className = 'prob-row';
            row.innerHTML = `
                <span class="prob-label">${cat}</span>
                <div class="prob-bar-container">
                    <div class="prob-bar ${cat}" style="width: ${percentage}%"></div>
                </div>
                <span class="prob-value">${percentage}%</span>
            `;
            container.appendChild(row);
        });
    }
    
    // Get waste category color
    function getWasteColor(wasteType) {
        const colors = {
            'recyclable': '#2196F3',
            'organic': '#4CAF50',
            'e-waste': '#f44336',
            'general': '#424242'
        };
        return colors[wasteType] || '#424242';
    }
});
