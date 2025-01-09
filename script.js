// Variabile globale per il grafico
let myChart;

// Funzione per generare campioni empirici da una distribuzione teorica
function generateEmpiricalData(values, probabilities, sampleSize) {
    const empiricalData = [];
    for (let i = 0; i < sampleSize; i++) {
        const random = Math.random();
        let cumulativeProbability = 0;
        for (let j = 0; j < probabilities.length; j++) {
            cumulativeProbability += probabilities[j];
            if (random <= cumulativeProbability) {
                empiricalData.push(values[j]);
                break;
            }
        }
    }
    return empiricalData;
}

function calculateEmpiricalStats(data) {
    let mean = 0;
    let variance = 0;
    const n = data.length;

    // Calcolo della media empirica
    data.forEach((value) => {
        mean += value;
    });
    mean /= n;

    // Calcolo della varianza empirica
    data.forEach((value) => {
        variance += Math.pow(value - mean, 2);
    });
    variance /= n;

    return { mean, variance };
}

// Funzione per calcolare la media teorica
function calculateTheoreticalMean(values, probabilities) {
    return values.reduce((sum, val, i) => sum + val * probabilities[i], 0);
}

// Funzione per calcolare la varianza teorica
function calculateTheoreticalVariance(values, probabilities, mean) {
    return values.reduce((sum, val, i) => sum + probabilities[i] * Math.pow(val - mean, 2), 0);
}

// Funzione principale per tracciare il grafico
function plotChart(values, theoretical, sampleSize) {
    // Genera i campioni empirici
    const empiricalData = generateEmpiricalData(values, theoretical, sampleSize);

    // Conta la frequenza dei valori empirici
    const empiricalCounts = values.map(value => empiricalData.filter(v => v === value).length);
    const totalEmpirical = empiricalCounts.reduce((sum, val) => sum + val, 0);
    const empiricalPercentages = empiricalCounts.map(val => (val / totalEmpirical) * 100);

    // Calcola le percentuali teoriche
    const totalTheoretical = theoretical.reduce((sum, val) => sum + val, 0);
    const normalizedTheoretical = theoretical.map(val => val / totalTheoretical);
    const theoreticalPercentages = normalizedTheoretical.map(val => val * 100);

    // Calcola statistiche empiriche
    const empiricalStats = calculateEmpiricalStats(empiricalData);
    const empiricalMean = empiricalStats.mean.toFixed(3);
    const empiricalVariance = empiricalStats.variance.toFixed(3);

    // Calcola statistiche teoriche
    const theoreticalMean = calculateTheoreticalMean(values, normalizedTheoretical).toFixed(3);
    const theoreticalVariance = calculateTheoreticalVariance(values, normalizedTheoretical, theoreticalMean).toFixed(3);

    // Mostra le statistiche nella UI
    document.getElementById('stats').innerHTML = `
        <strong>Statistics:</strong><br>
        <ul>
            <li>Empirical Mean: ${empiricalMean}</li>
            <li>Theoretical Mean: ${theoreticalMean}</li>
            <li>Empirical Variance: ${empiricalVariance}</li>
            <li>Theoretical Variance: ${theoreticalVariance}</li>
        </ul>
    `;

    const ctx = document.getElementById('distributionChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    // Crea un nuovo grafico
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: values,
            datasets: [
                {
                    label: 'Empirical Distribution (%)',
                    data: empiricalPercentages,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)', // Rosso per la distribuzione empirica
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Theoretical Distribution (%)',
                    data: theoreticalPercentages,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blu per la distribuzione teorica
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Empirical vs Theoretical Distributions (Percentage)'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value.toFixed(2) + '%',
                    font: {
                        weight: 'bold'
                    },
                    color: 'white' // Percentuale in bianco
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Outcomes'
                    }
                }
            }
        },
        plugins: [ChartDataLabels] // Plugin per mostrare le percentuali sopra le colonne
    });
}

// Event listener per il form
document.getElementById('dataForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const values = document.getElementById('values').value.split(',').map(v => parseFloat(v.trim()));
    const probabilities = document.getElementById('probabilities').value.split(',').map(p => parseFloat(p.trim()));

    const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
    if (Math.abs(totalProbability - 1) > 0.001) {
        alert('Le probabilità teoriche devono sommare a 1. Correggi i dati inseriti.');
        return;
    }

    const sampleSize = parseInt(document.getElementById('sampleSize').value, 10);

    plotChart(values, probabilities, sampleSize);
});
