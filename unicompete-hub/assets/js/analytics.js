window.addEventListener('DOMContentLoaded', () => {
  const chartDataElement = document.getElementById('analytics-data');
  if (!chartDataElement || !window.Chart) return;

  const data = JSON.parse(chartDataElement.textContent);
  const colors = ['#6c63ff', '#00d4aa', '#ff4757', '#ffa502', '#2ed573', '#ff6b81', '#a4b0be'];

  new Chart(document.getElementById('registrationsBarChart'), {
    type: 'bar',
    data: {
      labels: data.bar.labels,
      datasets: [{
        label: 'Registrations',
        data: data.bar.values,
        backgroundColor: colors[0],
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#e8eaf0' } },
        y: { ticks: { color: '#e8eaf0' } },
      },
    },
  });

  new Chart(document.getElementById('registrationsLineChart'), {
    type: 'line',
    data: {
      labels: data.line.labels,
      datasets: [{
        label: 'Registrations',
        data: data.line.values,
        borderColor: colors[1],
        backgroundColor: 'rgba(0, 212, 170, 0.15)',
        tension: 0.35,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#e8eaf0' } },
        y: { ticks: { color: '#e8eaf0' } },
      },
    },
  });

  new Chart(document.getElementById('registrationsDoughnutChart'), {
    type: 'doughnut',
    data: {
      labels: data.doughnut.labels,
      datasets: [{
        data: data.doughnut.values,
        backgroundColor: colors,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#e8eaf0' } } },
    },
  });
});
