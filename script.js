document.querySelector(".cta-button").addEventListener("click", function() {
    alert("Stay tuned! AI Editing features coming soon.");
let selectedFile = null;

// File Input Handler
document.getElementById('mediaInput').addEventListener('change', function(e) {
    selectedFile = e.target.files[0];
    showPreview(selectedFile);
});

// Preview Original Media
function showPreview(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        if(file.type.startsWith('image')) {
            document.getElementById('originalPreview').src = e.target.result;
            document.getElementById('originalPreview').style.display = 'block';
            document.getElementById('originalVideo').style.display = 'none';
        } else if(file.type.startsWith('video')) {
            document.getElementById('originalVideo').src = e.target.result;
            document.getElementById('originalVideo').style.display = 'block';
            document.getElementById('originalPreview').style.display = 'none';
        }
    }
    
    reader.readAsDataURL(file);
}

// Process Media
async function processMedia() {
    if(!selectedFile) {
        alert('Please select a file first!');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('options', JSON.stringify({
        bgRemove: document.getElementById('bgRemove').checked,
        colorCorrection: document.getElementById('colorCorrection').checked,
        videoStabilize: document.getElementById('videoStabilize').checked,
        filter: document.getElementById('filterSelect').value
    }));

    try {
        // यहां आपको अपने Python बैकेंड API का endpoint डालना होगा
        const response = await fetch('http://localhost:5000/process', {
            method: 'POST',
            body: formData
        });

        const result = await response.blob();
        showProcessedResult(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Show Processed Result
function showProcessedResult(processedBlob) {
    const url = URL.createObjectURL(processedBlob);
    
    if(selectedFile.type.startsWith('image')) {
        document.getElementById('processedPreview').src = url;
        document.getElementById('processedPreview').style.display = 'block';
        document.getElementById('processedVideo').style.display = 'none';
    } else {
        document.getElementById('processedVideo').src = url;
        document.getElementById('processedVideo').style.display = 'block';
        document.getElementById('processedPreview').style.display = 'none';
    }
}async function enhanceImage() {
    let fileInput = document.getElementById('image-input');
    let outputImage = document.getElementById('output-image');

    if (fileInput.files.length === 0) {
        alert("Please select an image!");
        return;
    }

    let formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
        let response = await fetch("https://api.deepai.org/api/image-editor", {
            method: "POST",
            headers: { "api-key": "YOUR_DEEPAI_API_KEY" },
            body: formData,
        });

        let data = await response.json();
        if (data.output_url) {
            outputImage.src = data.output_url;
            outputImage.style.display = "block";
        } else {
            alert("AI Enhancement failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
    }
}