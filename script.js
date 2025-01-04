  function generateSamples(size, values, probabilities) {
            const samples = [];
            for (let i = 0; i < size; i++) {
                let r = Math.random();
                let cumulative = 0;
                for (let j = 0; j < values.length; j++) {
                    cumulative += probabilities[j];
                    if (r < cumulative) {
                        samples.push(values[j]);
                        break;
                    }
                }
            }
            return samples;
        }

        // Calculate empirical probabilities
        function calculateEmpiricalProbabilities(samples, values) {
            const counts = values.map(val => samples.filter(x => x === val).length);
            const total = samples.length;
            return counts.map(count => count / total);
        }

        // Plot the chart using Chart.js
        function plotChart(values, theoretical, empirical) {
            const ctx = document.getElementById('distributionChart').getContext('2d');
            new Chart(ctx, {
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

        // Handle form submission
        document.getElementById('dataForm').addEventListener('submit', function(event) {
            event.preventDefault();

            // Get user inputs
            const values = document.getElementById('values').value.split(',').map(Number);
            const probabilities = document.getElementById('probabilities').value.split(',').map(Number);
            const sampleSize = parseInt(document.getElementById('sampleSize').value, 10);

            // Validate probabilities
            const sumProbabilities = probabilities.reduce((a, b) => a + b, 0);
            if (Math.abs(sumProbabilities - 1) > 0.001) {
                alert('Probabilities must sum to 1.');
                return;
            }

            // Generate samples and calculate empirical probabilities
            const samples = generateSamples(sampleSize, values, probabilities);
            const empiricalProbabilities = calculateEmpiricalProbabilities(samples, values);

            // Plot the chart
            plotChart(values, probabilities, empiricalProbabilities);
        });
