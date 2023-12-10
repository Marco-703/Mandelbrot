// Get the canvas element
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

// Get the zoom selector dropdown
const zoomSelect = document.getElementById('zoomSelect');

// Get the mandelbrot parameter slider
const iterationSlider = document.getElementById('iterationSlider');
const absoluteSlider = document.getElementById('absoluteSlider');

// Get buttons
const resetButton = document.getElementById('resetButton');
const applyIterationButton = document.getElementById('applyIterationInput');
const applyAbsoluteButton = document.getElementById('applyAbsoluteInput');


// pixel count
const pixelCount = 800;

// canvas size
const canvasSize = 800;

// pixel size
const pixelSize = canvasSize / pixelCount;

//size, offset in complex numbers
const complexSize = 2.0;
const defaultComplexOffsetX = 1.0;
const defaultComplexOffsetY = 0.0;

let complexOffsetX = defaultComplexOffsetX;
let complexOffsetY = defaultComplexOffsetY;

//zoom
let zoom = 1;
let zoomFactor = parseFloat(zoomSelect.value);



//Mandelbrot iterations
let mandelbrotIterations = parseInt(iterationSlider.value);
let mandelbrotAbsolute = parseInt(absoluteSlider.value);



// Function to draw pixels on the canvas
function drawPixels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    console.log(zoom);
    for (let y = 0; y < pixelCount; y++) {
        for (let x = 0; x < pixelCount; x++) {
            const complexNumber = getComplexNumber(x, y);

            let isCenter = false;
            if (Math.abs(complexNumber.cX) < 1e-3) { isCenter = true; }
            if (Math.abs(complexNumber.cY) < 1e-3) { isCenter = true; }
            isCenter = false;


            let color = "red";

            if (isCenter) {
                color = '#303030';
            } else {
                //color = '#101010';
                color = getMandelbrot(complexNumber.cX, complexNumber.cY);
            }

            ctx.fillStyle = color;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
}

function getMandelbrot(x, y) {
    let cReal = 0.0;
    let cComplex = 0.0;

    let normedValue = 0.0;

    let length = 0.0;


    for (let i = 0; i < mandelbrotIterations; i++) {
        const aa = cReal * cReal;
        const bb = -1 * cComplex * cComplex;
        const abi = 2 * cReal * cComplex;

        cReal = (aa + bb + x);
        cComplex = (abi + y);

        length = Math.sqrt(cReal * cReal + cComplex * cComplex);
        if (length > mandelbrotAbsolute) {
            // console.log("high");
            break;
        } else {
            normedValue += 1.0 / mandelbrotIterations;
        }
    }

    if (normedValue > 1) {
        normedValue = 1;
    }

    const red = 0; // Red component
    const green = 120 - mapValue(length, 0, mandelbrotAbsolute, 0, 120); // Green component
    const blue = Math.round(255 * normedValue); // Blue component

    // Construct the RGB color string
    let col = `rgb(${red}, ${green}, ${blue})`;

    let hueDegrees = 250 + Math.round(90 * normedValue);
    let saturation = 100; //- mapValue(length, 0, mandelbrotAbsolute, 0, 10);
    let lightness = 50 - mapValue(length, 0, mandelbrotAbsolute, 0, 10);;
    // Create a color using HSL representation in CSS
    col = `hsl(${hueDegrees}, ${saturation}%, ${lightness}%)`;



    return col;
}




function getComplexNumber(x, y) {
    let cX = mapValue(x, 0, pixelCount, (-1) * complexSize, complexSize);
    let cY = mapValue(y, 0, pixelCount, complexSize, (-1) * complexSize);


    cX = cX / zoom;
    cY = cY / zoom;

    cX -= complexOffsetX;
    cY -= complexOffsetY;

    return { cX: cX, cY: cY };
}

function mapValue(value, fromMin, fromMax, toMin, toMax) {
    const ratio = (value - fromMin) / (fromMax - fromMin);
    return toMin + ratio * (toMax - toMin);
}





function handleClick(event) {
    const rect = canvas.getBoundingClientRect(); // Get the position of the canvas element
    const x = event.clientX - rect.left; // Calculate the x-coordinate relative to the canvas
    const y = event.clientY - rect.top; // Calculate the y-coordinate relative to the canvas

    const complexPosition = getComplexNumber(x, y);

    // Log the clicked position
    console.log(`Clicked at position: (${x}, ${y})`);
    console.log(`Complex Position: (${complexPosition.cX}, ${complexPosition.cY})`);

    complexOffsetX = (-1) * complexPosition.cX;
    complexOffsetY = (-1) * complexPosition.cY;

    zoom *= zoomFactor;

    if (zoomFactor > 1.1) {
        mandelbrotIterations *= (0.2 * zoomFactor);
    }
    else if (zoomFactor < 0.9) {
        mandelbrotIterations /= (20 * zoomFactor);
    }
    document.getElementById('iterationValue').textContent = mandelbrotIterations;

    drawPixels();
}

// Reset pixel size function
function resetZoom() {
    console.log("reset");

    mandelbrotIterations = parseInt(iterationSlider.value);
    document.getElementById('iterationValue').textContent = mandelbrotIterations;
    zoom = 1.0;
    complexOffsetX = defaultComplexOffsetX;
    complexOffsetY = defaultComplexOffsetY;
    //document.getElementById('pixelSizeSelect').value = defaultPixelSize.toString();
    drawPixels(); // Redraw pixels with default size
}

function changeZoom() {
    zoomFactor = parseFloat(zoomSelect.value);
}

function setIterationsFromTextInput() {
    // Get the input value
    const inputValue = document.getElementById('iterationInput').value;

    // Convert the input value to a number
    const numberValue = parseFloat(inputValue);

    // Check if the conversion was successful
    if (!isNaN(numberValue)) {
        // Use the numberValue as a number
        console.log('Number entered:', numberValue);
        mandelbrotIterations = numberValue;
        document.getElementById('iterationValue').textContent = mandelbrotIterations;
        drawPixels(); // Redraw pixels when the slider value changes

        // Perform operations or use the numberValue as needed
        // For instance, you can use it in calculations or assign it to a variable
    } else {
        console.log('Please enter a valid number.');
    }
}

function setAbsoluteFromTextInput() {
    // Get the input value
    const inputValue = document.getElementById('absoluteInput').value;

    // Convert the input value to a number
    const numberValue = parseFloat(inputValue);

    // Check if the conversion was successful
    if (!isNaN(numberValue)) {
        // Use the numberValue as a number
        console.log('Number entered:', numberValue);
        mandelbrotAbsolute = numberValue;
        document.getElementById('absoluteValue').textContent = mandelbrotAbsolute;
        drawPixels(); // Redraw pixels when the slider value changes

        // Perform operations or use the numberValue as needed
        // For instance, you can use it in calculations or assign it to a variable
    } else {
        console.log('Please enter a valid number.');
    }
}


// Event listener for selector change
zoomSelect.addEventListener('change', changeZoom);
canvas.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetZoom);
applyIterationButton.addEventListener('click', setIterationsFromTextInput);
applyAbsoluteButton.addEventListener('click', setAbsoluteFromTextInput);


// Event listener for slider change
iterationSlider.addEventListener('input', function () {
    mandelbrotIterations = parseInt(iterationSlider.value);
    document.getElementById('iterationValue').textContent = mandelbrotIterations;
    drawPixels(); // Redraw pixels when the slider value changes
});

// Event listener for slider change
absoluteSlider.addEventListener('input', function () {
    mandelbrotAbsolute = parseInt(absoluteSlider.value);
    document.getElementById('absoluteValue').textContent = mandelbrotAbsolute;
    drawPixels(); // Redraw pixels when the slider value changes
});


// Initial draw of pixels
document.getElementById('iterationValue').textContent = mandelbrotIterations;
document.getElementById('absoluteValue').textContent = mandelbrotAbsolute;

drawPixels();