// Variabile globale per il grafico
let myChart;

// Funzione per tracciare il grafico
function plotChart(values, theoretical, empirical) {
    // Distruggi il grafico esistente, se presente
    if (myChart) {
        myChart.destroy();
    }

    // Normalizza le probabilità teoriche
    const totalTheoretical = theoretical.reduce((sum, val) => sum + val, 0);
    const normalizedTheoretical = theoretical.map(val => val / totalTheoretical);

    // Converti i dati empirici e teorici in percentuali
    const totalEmpirical = empirical.reduce((sum, val) => sum + val, 0);
    const empiricalPercentages = empirical.map(val => (val / totalEmpirical) * 100);
    const theoreticalPercentages = normalizedTheoretical.map(val => val * 100);

    // Ottieni il contesto del canvas
    const ctx = document.getElementById('distributionChart').getContext('2d');

    // Crea un nuovo grafico
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: values,
            datasets: [
                {
                    label: 'Empirical Distribution',
                    data: empiricalPercentages,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Theoretical Distribution',
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
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
                        }
                    }
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
        }
    });

    // Calcola la media e la varianza
    const empiricalMean = calculateMean(values, empirical, totalEmpirical).toFixed(3);
    const theoreticalMean = calculateMean(values, normalizedTheoretical, 1).toFixed(3);
    const empiricalVariance = calculateVariance(values, empirical, empiricalMean).toFixed(3);
    const theoreticalVariance = calculateVariance(values, normalizedTheoretical, theoreticalMean).toFixed(3);

    // Mostra le statistiche sotto il grafico
    document.getElementById('stats').innerHTML = `
        Empirical mean: ${empiricalMean} vs Theoretical mean: ${theoreticalMean}<br>
        Empirical variance: ${empiricalVariance} vs Theoretical variance: ${theoreticalVariance}
    `;
}

// Funzione per calcolare la media
function calculateMean(values, distribution, total) {
    return values.reduce((sum, val, i) => sum + val * distribution[i], 0) / total;
}

// Funzione per calcolare la varianza
function calculateVariance(values, distribution, mean) {
    const total = distribution.reduce((sum, val) => sum + val, 0);
    return values.reduce((variance, val, i) => variance + distribution[i] * Math.pow(val - mean, 2), 0) / total;
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

    // Calcola distribuzione empirica per un campione
    const sampleSize = parseInt(document.getElementById('sampleSize').value, 10);
    const empirical = probabilities.map(p => Math.round(p * sampleSize));

    // Passa i dati alla funzione plotChart
    plotChart(values, probabilities, empirical);
});

