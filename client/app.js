// CrimeSceneSolver Frontend Application

class CrimeSceneSolver {
    constructor() {
        this.currentAnalysis = null;
        this.cases = [];
        this.crimeChartInstance = null;
        this.evidenceChartInstance = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCases();
        //this.updateDashboard();
    }

    setupEventListeners() {
        // Upload page functionality
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const clearBtn = document.getElementById('clearBtn');

        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadArea.addEventListener('drop', this.handleDrop.bind(this));
            fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', this.analyzeImage.bind(this));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', this.clearUpload.bind(this));
        }

        // Results page functionality
        const generateReportBtn = document.getElementById('generateReportBtn');
        const saveCaseBtn = document.getElementById('saveCaseBtn');
        const newAnalysisBtn = document.getElementById('newAnalysisBtn');

        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', this.generateReport.bind(this));
        }

        if (saveCaseBtn) {
            saveCaseBtn.addEventListener('click', this.saveCase.bind(this));
        }

        if (newAnalysisBtn) {
            newAnalysisBtn.addEventListener('click', () => {
                window.location.href = 'upload.html';
            });
        }

        // Cases page functionality
        const searchInput = document.getElementById('searchInput');
        const filterSelect = document.getElementById('filterSelect');

        if (searchInput) {
            searchInput.addEventListener('input', this.filterCases.bind(this));
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', this.filterCases.bind(this));
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.showPreview(e.target.result, file);
        };
        reader.readAsDataURL(file);
    }

    showPreview(imageSrc, file) {
        const uploadContent = document.getElementById('uploadContent');
        const previewArea = document.getElementById('previewArea');
        const previewImage = document.getElementById('previewImage');

        if (uploadContent) uploadContent.style.display = 'none';
        if (previewArea) {
            previewArea.classList.remove('hidden');
            previewImage.src = imageSrc;
        }

        this.currentFile = { src: imageSrc, name: file.name, file: file };
    }

    clearUpload() {
        const uploadContent = document.getElementById('uploadContent');
        const previewArea = document.getElementById('previewArea');
        const fileInput = document.getElementById('fileInput');

        if (uploadContent) uploadContent.style.display = 'block';
        if (previewArea) previewArea.classList.add('hidden');
        if (fileInput) fileInput.value = '';

        this.currentFile = null;
    }

    async analyzeImage() {
        if (!this.currentFile) return;

        const loadingArea = document.getElementById('loadingArea');
        const previewArea = document.getElementById('previewArea');

        if (loadingArea) loadingArea.classList.remove('hidden');
        if (previewArea) previewArea.classList.add('hidden');

        try {
            const formData = new FormData();
            formData.append('image', this.currentFile.file);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.currentAnalysis = {
                    ...result,
                    image: this.currentFile.src,
                    fileName: this.currentFile.name,
                    timestamp: new Date().toISOString()
                };
                this.showResults();
            } else {
                throw new Error(result.error || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Analysis failed: ' + error.message);
            this.clearUpload();
        }
    }

    showResults() {
        if (!this.currentAnalysis) return;

        // Store results for results page
        sessionStorage.setItem('analysisResults', JSON.stringify(this.currentAnalysis));
        window.location.href = 'results.html';
    }

    loadResults() {
        const results = sessionStorage.getItem('analysisResults');
        if (!results) {
            window.location.href = 'upload.html';
            return;
        }

        this.currentAnalysis = JSON.parse(results);
        this.displayResults();
    }

    displayResults() {
        if (!this.currentAnalysis) return;

        const resultImage = document.getElementById('resultImage');
        const analysisResults = document.getElementById('analysisResults');
        const crimeClassification = document.getElementById('crimeClassification');
        const detectedEvidence = document.getElementById('detectedEvidence');

        if (resultImage) resultImage.src = this.currentAnalysis.image;

        if (analysisResults) {
            analysisResults.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="text-gray-400">Case ID:</span>
                    <span class="font-mono">${this.generateCaseId()}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-400">Analysis Date:</span>
                    <span>${new Date(this.currentAnalysis.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-400">Status:</span>
                    <span class="status-badge status-completed">Completed</span>
                </div>
            `;
        }

        if (crimeClassification) {
            const confidence = this.currentAnalysis.confidence * 100;
            const confidenceClass = confidence > 70 ? 'confidence-high' : confidence > 50 ? 'confidence-medium' : 'confidence-low';
            
            crimeClassification.innerHTML = `
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400">Predicted Crime:</span>
                        <span class="crime-badge crime-${this.currentAnalysis.crime_prediction.replace(' ', '-')}">${this.currentAnalysis.crime_prediction.toUpperCase()}</span>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400">Confidence:</span>
                        <span class="${confidenceClass} font-bold">${confidence.toFixed(1)}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="confidence-bar bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style="width: ${confidence}%"></div>
                    </div>
                </div>
            `;
        }

        if (detectedEvidence) {
            const evidenceItems = this.currentAnalysis.detected_evidence.map(evidence => {
            const label = typeof evidence === "string" ? evidence : evidence.label;
            const confidence = evidence.confidence ? evidence.confidence + "%" : "";

            return `
                <div class="evidence-item">
                    <span class="evidence-tag">${label.toUpperCase()}</span>
                    <span class="text-gray-400">${confidence}</span>
                </div>
            `; 
        }).join('');

            detectedEvidence.innerHTML = evidenceItems || '<p class="text-gray-400">No evidence detected</p>';
        }
    }

    generateCaseId() {
        return 'CASE-' + Date.now().toString(36).toUpperCase();
    }

    async saveCase() {
        if (!this.currentAnalysis) return;

        try {
            const caseData = {
                caseId: this.generateCaseId(),
                images: [this.currentAnalysis.fileName],
                prediction: this.currentAnalysis.crime_prediction,
                confidence: this.currentAnalysis.confidence,
                evidenceDetected: this.currentAnalysis.detected_evidence,
                createdAt: this.currentAnalysis.timestamp
            };

            const response = await fetch('/api/cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(caseData)
            });

            if (response.ok) {
                alert('Case saved successfully!');
                this.loadCases();
            } else {
                throw new Error('Failed to save case');
            }
        } catch (error) {
            console.error('Save case error:', error);
            alert('Failed to save case: ' + error.message);
        }
    }

    async generateReport() {
        if (!this.currentAnalysis) return;

        try {
            const caseData = {
                caseId: this.generateCaseId(),
                images: [this.currentAnalysis.fileName],
                prediction: this.currentAnalysis.crime_prediction,
                confidence: this.currentAnalysis.confidence,
                evidenceDetected: this.currentAnalysis.detected_evidence,
                createdAt: this.currentAnalysis.timestamp
            };

            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(caseData)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `forensic-report-${Date.now()}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Failed to generate report');
            }
        } catch (error) {
            console.error('Report generation error:', error);
            alert('Failed to generate report: ' + error.message);
        }
    }

    async loadCases() {
        try {
            const response = await fetch('/api/cases');
            if (response.ok) {
                this.cases = await response.json();
                this.displayCases();
                this.updateDashboard();
            }
        } catch (error) {
            console.error('Load cases error:', error);
        }
    }

    displayCases() {
        const casesContainer = document.getElementById('casesContainer');
        const noCases = document.getElementById('noCases');

        if (!casesContainer) return;

        if (this.cases.length === 0) {
            casesContainer.innerHTML = '';
            if (noCases) noCases.classList.remove('hidden');
            return;
        }

        if (noCases) noCases.classList.add('hidden');

        const filteredCases = this.getFilteredCases();
        
        casesContainer.innerHTML = filteredCases.map(case_ => `
            <div class="case-card bg-gray-800 rounded-lg p-6 cursor-pointer" onclick="app.showCaseDetail('${case_.caseId}')">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold">${case_.caseId}</h3>
                        <p class="text-gray-400 text-sm">${new Date(case_.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span class="crime-badge">${case_.prediction.toUpperCase()}</span>
                </div>
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400 text-sm">Confidence:</span>
                        <span class="text-sm font-bold">${(case_.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-1">
                        <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full" style="width: ${case_.confidence * 100}%"></div>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${case_.evidenceDetected.map(evidence => `
                        <span class="evidence-tag text-xs bg-gray-700 px-2 py-1 rounded">${evidence}</span>
                    `).join('')}
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <span class="text-gray-400 text-sm">${case_.evidenceDetected.length} evidence items</span>
                    <button onclick="event.stopPropagation(); app.deleteCase('${case_.caseId}')" class="text-red-400 hover:text-red-300 text-sm">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFilteredCases() {
        const searchInput = document.getElementById('searchInput');
        const filterSelect = document.getElementById('filterSelect');
        
        let filtered = this.cases;

        if (searchInput && searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filtered = filtered.filter(case_ => 
                case_.caseId.toLowerCase().includes(searchTerm) ||
                case_.prediction.toLowerCase().includes(searchTerm) ||
                case_.evidenceDetected.some(e => e.toLowerCase().includes(searchTerm))
            );
        }

        if (filterSelect && filterSelect.value !== 'all') {
            filtered = filtered.filter(case_ => case_.prediction === filterSelect.value);
        }

        return filtered;
    }

    filterCases() {
        this.displayCases();
    }

    showCaseDetail(caseId) {
        const case_ = this.cases.find(c => c.caseId === caseId);
        if (!case_) return;

        const modal = document.getElementById('caseModal');
        const content = document.getElementById('caseDetailContent');

        if (content) {
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Case Information</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Case ID:</span>
                                <span>${case_.caseId}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Date Created:</span>
                                <span>${new Date(case_.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Crime Type:</span>
                                <span class="crime-badge">${case_.prediction.toUpperCase()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Confidence:</span>
                                <span>${(case_.confidence * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Detected Evidence</h3>
                        <div class="space-y-2">
                            ${case_.evidenceDetected.map(evidence => `
                                <div class="evidence-item">
                                    <svg class="evidence-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>${evidence.toUpperCase()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="mt-6 flex justify-end space-x-4">
                    <button onclick="app.generateReportForCase('${case_.caseId}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                        Generate Report
                    </button>
                    <button onclick="app.deleteCase('${case_.caseId}')" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                        Delete Case
                    </button>
                </div>
            `;
        }

        if (modal) modal.classList.remove('hidden');
    }

    closeCaseModal() {
        const modal = document.getElementById('caseModal');
        if (modal) modal.classList.add('hidden');
    }

    async deleteCase(caseId) {
        if (!confirm('Are you sure you want to delete this case?')) return;

        try {
            const response = await fetch(`/api/cases/${caseId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.cases = this.cases.filter(c => c.caseId !== caseId);
                this.displayCases();
                this.updateDashboard();
                this.closeCaseModal();
            } else {
                throw new Error('Failed to delete case');
            }
        } catch (error) {
            console.error('Delete case error:', error);
            alert('Failed to delete case: ' + error.message);
        }
    }

    async generateReportForCase(caseId) {
        const case_ = this.cases.find(c => c.caseId === caseId);
        if (!case_) return;

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(case_)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `forensic-report-${caseId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Failed to generate report');
            }
        } catch (error) {
            console.error('Report generation error:', error);
            alert('Failed to generate report: ' + error.message);
        }
    }

    updateDashboard() {
        const totalCasesEl = document.getElementById('totalCases');
        const todayCasesEl = document.getElementById('todayCases');
        const avgConfidenceEl = document.getElementById('avgConfidence');
        const totalEvidenceEl = document.getElementById('totalEvidence');

        if (totalCasesEl) totalCasesEl.textContent = this.cases.length;

        if (todayCasesEl) {
            const today = new Date().toDateString();
            const todayCases = this.cases.filter(c => new Date(c.createdAt).toDateString() === today);
            todayCasesEl.textContent = todayCases.length;
        }

        if (avgConfidenceEl && this.cases.length > 0) {
            const avgConf = this.cases.reduce((sum, c) => sum + c.confidence, 0) / this.cases.length;
            avgConfidenceEl.textContent = (avgConf * 100).toFixed(1) + '%';
        }

        if (totalEvidenceEl) {
            const totalEvidence = this.cases.reduce((sum, c) => sum + c.evidenceDetected.length, 0);
            totalEvidenceEl.textContent = totalEvidence;
        }

        this.updateCharts();
        //this.updateRecentCases();
    }

    updateCharts() {
        // Crime distribution chart
        const crimeChart = document.getElementById('crimeChart');
        const evidenceChart = document.getElementById('evidenceChart');
        if (!crimeChart || !evidenceChart) return;

        if (this.cases.length === 0) return;
        // Destroy existing charts
        if (this.crimeChartInstance) {
            this.crimeChartInstance.destroy();
        }

        if (this.evidenceChartInstance) {
            this.evidenceChartInstance.destroy();
        }
        // Crime Distribution Chart
        const crimeCounts = {};
        this.cases.forEach(c => {
            crimeCounts[c.prediction] = (crimeCounts[c.prediction] || 0) + 1;
        });
        
        this.crimeChartInstance = new Chart(crimeChart, {
            type: 'doughnut',
            data: {
                labels: Object.keys(crimeCounts),
                datasets: [{
                    data: Object.values(crimeCounts),
                    backgroundColor: ['#DC2626', '#D97706', '#7C3AED', '#0891B2', '#059669']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#fff' }
                        }
                    }
                }
            });
        

        // Evidence chart
        const evidenceCounts = {};
        //document.getElementById('evidenceChart');
        this.cases.forEach(c => {
            c.evidenceDetected.forEach(e => {
                evidenceCounts[e] = (evidenceCounts[e] || 0) + 1;
            });
        });
            
        this.evidenceChartInstance = new Chart(evidenceChart, {
            type: 'bar',
            data: {
                labels: Object.keys(evidenceCounts),
                datasets: [{
                    label: 'Evidence Count',
                    data: Object.values(evidenceCounts),
                    backgroundColor: '#3B82F6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff' },
                        grid: { color: '#374151' }
                    },
                    x: {
                        ticks: { color: '#fff' },
                        grid: { color: '#374151' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    }


    updateRecentCases() {
        const recentCasesEl = document.getElementById('recentCases');
        if (!recentCasesEl) return;

        const recentCases = this.cases
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (recentCases.length === 0) {
            recentCasesEl.innerHTML = '<p class="text-gray-400">No recent cases</p>';
            return;
        }

        recentCasesEl.innerHTML = recentCases.map(case_ => `
            <div class="flex justify-between items-center p-3 bg-gray-700 rounded">
                <div>
                    <p class="font-semibold">${case_.caseId}</p>
                    <p class="text-sm text-gray-400">${new Date(case_.createdAt).toLocaleDateString()}</p>
                </div>
                <span class="crime-badge text-xs">${case_.prediction.toUpperCase()}</span>
            </div>
        `).join('');
    }
}

// Initialize the application
if (!window.app) {
    window.app = new CrimeSceneSolver();
}

// Load results if on results page
if (window.location.pathname.includes('results.html')) {
    app.loadResults();
}

// Global function for modal
function closeCaseModal() {
    app.closeCaseModal();
}
