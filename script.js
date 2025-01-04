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

// Funzione per calcolare media e varianza dai dati simulati
function calculateEmpiricalStats(data) {
    let mean = 0;
    let variance = 0;
    const n = data.length;

    // Calcolo della media
    data.forEach((value) => {
        mean += value;
    });
    mean /= n;

    // Calcolo della varianza
    data.forEach((value) => {
        variance += Math.pow(value - mean, 2);
    });
    variance /= n;

    return { mean, variance };
}

// Funzione per calcolare la media teorica
function calculateMean(values, distribution, total) {
    return values.reduce((sum, val, i) => sum + val * distribution[i], 0) / total;
}

// Funzione per calcolare la varianza teorica
function calculateVariance(values, distribution, mean) {
    const total = distribution.reduce((sum, val) => sum + val, 0);
    return values.reduce((variance, val, i) => variance + distribution[i] * Math.pow(val - mean, 2), 0) / total;
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
    const theoreticalMean = calculateMean(values, normalizedTheoretical, 1).toFixed(3);
    const theoreticalVariance = calculateVariance(values, normalizedTheoretical, theoreticalMean).toFixed(3);

    // Mostra le statistiche nella UI
    document.getElementById('stats').innerHTML = `
        <strong>Statistics:</strong><br>
        Empirical Mean: ${empiricalMean} vs Theoretical Mean: ${theoreticalMean}<br>
        Empirical Variance: ${empiricalVariance} vs Theoretical Variance: ${theoreticalVariance}
    `;

    // Ottieni il contesto del canvas
    const ctx = document.getElementById('distributionChart').getContext('2d');

    // Distruggi il grafico precedente, se esiste
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
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Theoretical Distribution (%)',
                    data: theoreticalPercentages,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
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
                    color: 'black'
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

    // Leggi i valori e le probabilità inseriti
    const values = document.getElementById('values').value.split(',').map(v => parseFloat(v.trim()));
    const probabilities = document.getElementById('probabilities').value.split(',').map(p => parseFloat(p.trim()));

    // Controlla che le probabilità siano valide
    const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
    if (Math.abs(totalProbability - 1) > 0.001) {
        alert('Le probabilità teoriche devono sommare a 1. Correggi i dati inseriti.');
        return;
    }

    // Leggi il sample size
    const sampleSize = parseInt(document.getElementById('sampleSize').value, 10);

    // Passa i dati alla funzione plotChart
    plotChart(values, probabilities, sampleSize);
});

