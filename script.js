// Variabile globale per il grafico
let myChart;

function plotChart(values, theoretical, empirical) {
    // Distruggi il grafico esistente, se presente
    if (myChart) {
        myChart.destroy();
    }

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
                    data: empirical,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Theoretical Distribution',
                    data: theoretical,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Empirical vs Theoretical Distributions'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Probability'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Values'
                    }
                }
            }
        }
    });
}

// Event listener per il form
document.getElementById('dataForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Leggi i valori e le probabilità inseriti
    const values = document.getElementById('values').value.split(',').map(v => v.trim());
    const probabilities = document.getElementById('probabilities').value.split(',').map(p => parseFloat(p.trim()));

    // Calcola distribuzione empirica per un campione
    const sampleSize = parseInt(document.getElementById('sampleSize').value, 10);
    const empirical = probabilities.map(p => Math.round(p * sampleSize));

    // Passa i dati alla funzione plotChart
    plotChart(values, probabilities, empirical);
});


