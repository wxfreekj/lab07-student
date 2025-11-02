// --- FORM HANDLING AND EXPORT SCRIPT ---

function exportAnswers() {
    let output = '';
    output += 'ASSIGNMENT=Lab7_Air_Masses_And_Fronts\n';
    output += 'DATE=' + new Date().toISOString() + '\n';
    output += 'TOTAL_POINTS=30\n';
    output += '---BEGIN_ANSWERS---\n';

    // Question 1 (7 pts)
    output += 'Q1a=' + document.getElementById('q1a').value + '\n';
    output += 'Q1b=' + document.getElementById('q1b').value + '\n';
    output += 'Q1c=' + document.getElementById('q1c').value + '\n';
    output += 'Q1d=' + document.getElementById('q1d').value + '\n';
    output += 'Q1e=' + document.getElementById('q1e').value + '\n';
    output += 'Q1f=' + document.getElementById('q1f').value + '\n';
    output += 'Q1g=' + document.getElementById('q1g').value + '\n';

    // Questions 2-7 (16 pts)
    output += 'Q2_NOTE=Isobars and fronts drawing - see uploaded image\n';
    output += 'Q3=' + document.getElementById('q3').value + '\n';
    output += 'Q4_NOTE=Fronts drawing - see uploaded image\n';
    output += 'Q5a=' + document.getElementById('q5a').value + '\n';
    output += 'Q5b=' + document.getElementById('q5b').value + '\n';
    output += 'Q6=' + document.getElementById('q6').value + '\n';
    output += 'Q7=' + document.getElementById('q7').value + '\n';

    // Questions 8-12 (7 pts)
    output += 'Q8=' + document.getElementById('q8').value + '\n';
    output += 'Q9=' + document.getElementById('q9').value + '\n';
    output += 'Q10=' + document.getElementById('q10').value + '\n';
    output += 'Q11=' + document.getElementById('q11').value + '\n';
    output += 'Q12a=' + document.getElementById('q12a').value + '\n';
    output += 'Q12b=' + document.getElementById('q12b').value + '\n';
    output += 'Q12c=' + document.getElementById('q12c').value + '\n';

    output += '---END_ANSWERS---\n';

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lab7_Answers_' + Date.now() + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Answers exported successfully!\n\nFile: ' + a.download + '\n\nPlease submit this file AND your saved surface analysis image to Canvas.');
}

function clearForm() {
    if (confirm('⚠️ Are you sure you want to clear all answers? This cannot be undone.')) {
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], select, textarea');
        inputs.forEach(input => {
            input.value = '';
        });
        alert('✅ All answers have been cleared.');
    }
}


// --- INTERACTIVE DRAWING SCRIPT ---
(function() {
    const img = document.getElementById('bg-img');
    const canvas = document.getElementById('draw-canvas');
    const lineSelect = document.getElementById('line-select');

    if (!img || !canvas || !lineSelect) {
        console.error("Drawing tool elements not found. Script will not run.");
        return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });

    // --- STATE VARIABLES ---
    const DOT_RADIUS = 6;
    let lines = { 'isobar-1004': [], 'isobar-1008': [], 'isobar-1012': [], 'cold-front': [], 'warm-front': [] };
    let currentPoints = [];
    let currentLineType = 'isobar-1004';
    let draggingIdx = null;

    // --- CORE DRAWING FUNCTIONS ---
    function setExactPixelSize() {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (w === 0 || h === 0) return;
        
        const stage = img.parentElement;
        stage.style.width = w + 'px';
        stage.style.height = h + 'px';

        canvas.width = w;
        canvas.height = h;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        drawAll();
    }
    
    function drawAll() {
        if (!canvas.width || !canvas.height) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const type in lines) {
            lines[type].forEach(path => drawPath(ctx, path, type));
        }

        drawPath(ctx, currentPoints, currentLineType);
        drawHandles(ctx, currentPoints);
    }
    
    /* Replace the drawPath and drawIsobarLabel functions in web-components/lab07/script.js with the following updated implementations */

function drawPath(g, points, type) {
    if (points.length < 2) return;
    
    g.beginPath();
    g.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        g.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    g.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    g.lineCap = 'round';
    g.lineJoin = 'round';

    // Legacy string-key handling (if script still uses 'isobar-XXXX' keys)
    if (type === 'isobar-1004') {
        g.strokeStyle = '#00FF00';
        g.lineWidth = 3;
        g.stroke();
        drawIsobarLabel(g, points, type);
    } else if (type === 'isobar-1008') {
        g.strokeStyle = '#FF00FF';
        g.lineWidth = 3;
        g.stroke();
        drawIsobarLabel(g, points, type);
    } else if (type === 'isobar-1012') {
        g.strokeStyle = '#00FFFF';
        g.lineWidth = 3;
        g.stroke();
        drawIsobarLabel(g, points, type);
    } else if (type === 'cold-front') {
        g.strokeStyle = '#0000FF';
        g.lineWidth = 5;
        g.stroke();
    } else if (type === 'warm-front') {
        g.strokeStyle = '#FF0000';
        g.lineWidth = 5;
        g.stroke();
    } else if (type === 'clouds' || type === 'broken-clouds' || type === 'cloud-region') {
        g.strokeStyle = '#FF8C00';
        g.lineWidth = 4;
        g.stroke();
    } else {
        // Numeric keys (0..5) from the shared multi-line config
        const style = (typeof lineTypes !== 'undefined' && lineTypes[type]) ? lineTypes[type] : null;
        if (style) {
            if (style.dash && g.setLineDash) g.setLineDash(style.dash);
            else if (g.setLineDash) g.setLineDash([]);
            g.strokeStyle = style.color;
            g.lineWidth = style.width || 3;
            g.stroke();
            if (style.label && typeof drawIsobarLabel === 'function' && /^\d/.test(String(style.label))) {
                drawIsobarLabel(g, points, `isobar-${style.label}`);
            }
            if (g.setLineDash) g.setLineDash([]);
        }
    }
}

function drawIsobarLabel(g, points, type) {
    if (points.length < 1) return;
    const labelText = (typeof type === 'string' && type.indexOf('isobar-') === 0) ? type.split('-')[1] : String(type);

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    g.save();
    g.font = '9px Arial';
    g.fillStyle = '#000000ff';
    g.strokeStyle = 'white';
    g.lineWidth = 2;
    g.textAlign = 'center';
    g.textBaseline = 'bottom';

    g.strokeText(labelText, firstPoint.x, firstPoint.y - 10);
    g.fillText(labelText, firstPoint.x, firstPoint.y - 10);

    g.strokeText(labelText, lastPoint.x, lastPoint.y - 10);
    g.fillText(labelText, lastPoint.x, lastPoint.y - 10);
    
    g.restore();
}
    
    function drawHandles(g, points) {
        g.strokeStyle = '#ffffff';
        g.lineWidth = 2;
        for (const p of points) {
            g.beginPath();
            g.arc(p.x, p.y, DOT_RADIUS, 0, 2 * Math.PI);
            g.fillStyle = '#2c3e50';
            g.fill();
            g.stroke();
        }
    }
    
    // --- EVENT HANDLERS ---
    lineSelect.addEventListener('change', (e) => {
        if(currentPoints.length > 1) {
            lines[currentLineType].push([...currentPoints]);
        }
        currentPoints = [];
        currentLineType = e.target.value;
        draggingIdx = null;
        drawAll();
    });

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    canvas.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        const pos = getMousePos(e);

        // Check if dragging an existing point
        for (let i = 0; i < currentPoints.length; i++) {
            const p = currentPoints[i];
            if ((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2 < DOT_RADIUS ** 2 * 4) {
                draggingIdx = i;
                return;
            }
        }
        // Otherwise, add a new point
        currentPoints.push(pos);
        drawAll();
    });
    
    canvas.addEventListener('mousemove', e => {
        if (draggingIdx === null) return;
        currentPoints[draggingIdx] = getMousePos(e);
        drawAll();
    });

    function stopDragging() {
        draggingIdx = null;
    }
    canvas.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('mouseleave', stopDragging);
    
    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
        const pos = getMousePos(e);
        for (let i = currentPoints.length - 1; i >= 0; i--) {
            const p = currentPoints[i];
            if ((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2 < DOT_RADIUS ** 2 * 4) {
                currentPoints.splice(i, 1);
                drawAll();
                return;
            }
        }
    });

    document.getElementById('undo-last-btn').addEventListener('click', () => {
        if (currentPoints.length) {
            currentPoints.pop();
            drawAll();
        }
    });

    document.getElementById('undo-all-btn').addEventListener('click', () => {
        if(confirm(`Are you sure you want to clear all points for the current ${lineSelect.options[lineSelect.selectedIndex].text}?`)){
             currentPoints = [];
             drawAll();
        }
    });
    
    document.getElementById('save-btn').addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tctx = tempCanvas.getContext('2d');
        
        tctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        for (const type in lines) {
            lines[type].forEach(path => drawPath(tctx, path, type));
        }
        drawPath(tctx, currentPoints, currentLineType);
        
        const a = document.createElement('a');
        a.download = 'surface_analysis.png';
        a.href = tempCanvas.toDataURL('image/png');
        a.click();
    });

    // --- INITIALIZATION ---
    img.addEventListener('load', setExactPixelSize);
    if (img.complete) {
        setTimeout(setExactPixelSize, 100);
    }
    window.addEventListener('resize', () => setTimeout(setExactPixelSize, 100));

})();
