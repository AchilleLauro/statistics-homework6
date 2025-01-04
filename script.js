let myChart; // Variabile globale per il grafico

function plotChart(values, theoretical, empirical) {
    // Rimuovi il canvas esistente e creane uno nuovo
    const container = document.querySelector('.chart-container');
    container.innerHTML = '<canvas id="distributionChart"></canvas>';
    
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

