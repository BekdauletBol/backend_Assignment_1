
const express = require('express');
const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true })); 


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Calculator</title>
            <link rel="stylesheet" href="/styles.css"> 
        </head>
        <body>
            <div class="container">
                <h1>Body Mass Index (BMI) Calculator</h1>
                
                <form action="/calculate-bmi" method="POST" class="bmi-form">
                    <label for="weight">Weight (kg):</label>
                    <input type="number" id="weight" name="weight" step="0.01" min="0.1" placeholder="Enter weight in kilograms" required>

                    <label for="height">Height (m):</label>
                    <input type="number" id="height" name="height" step="0.01" min="0.1" placeholder="Enter height in meters" required>

                    <button type="submit">Calculate BMI</button>
                </form>
            </div>
        </body>
        </html>
    `);
});


app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.send(`
            <script>
                alert("Error: Please enter valid positive numbers for weight and height.");
                window.location.href="/";
            </script>
        `);
    }

    // MARK: Не забыть про формулу!!! BMI = weight (kg) / height² (m)
    const bmi = weight / (height * height);

    let category = '';
    let colorClass = '';

    
    if (bmi < 18.5) {
        category = 'Underweight'; // BMI < 18.5 
        colorClass = 'underweight'; 
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight'; // 18.5 <= BMI < 24.9
        colorClass = 'normal-weight'; 
    } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight'; // 25 <= BMI < 29.9
        colorClass = 'overweight'; // 
    } else { // bmi >= 30
        category = 'Obese'; // BMI >= 30
        colorClass = 'obese'; 
    }

   
    const resultHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Result</title>
            <link rel="stylesheet" href="/styles.css"> 
        </head>
        <body>
            <div class="container">
                <h2>Your BMI Result</h2>
                <div class="result-box ${colorClass}">
                    <p>Your BMI value is: <strong>${bmi.toFixed(2)}</strong></p>
                    <p>Category: <strong>${category}</strong></p>
                </div>
                <a href="/" class="button-link">Calculate Again</a>
            </div>
        </body>
        </html>
    `;
    res.send(resultHTML);
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
