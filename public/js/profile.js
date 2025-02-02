const ctx = document.getElementById('chart1');

let data = [+document.getElementById('res-100').innerText,
            +document.getElementById('res-80').innerText,
            +document.getElementById('res-50').innerText,
            +document.getElementById('res-30').innerText,
            +document.getElementById('res-0').innerText];

data = data.sort();

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['100%', '<80%', '<50%', '<30%', '0'],
        datasets: [{
        label: '',
        data: data,
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        },
        plugins: {
        legend: {display: false},
        }
    }
});