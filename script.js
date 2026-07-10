// 블로그가 로드되면 실행
document.addEventListener("DOMContentLoaded", function () {
    // 1. 블로그 본문이나 사이드바에 그래프를 그릴 도화지(Canvas) 자동 생성
    const mainContent = document.querySelector('.main') || document.body; 
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-container';
    chartWrapper.innerHTML = `
        <h3 style="margin-top:0; margin-bottom:15px; font-size:18px; color:#111;">미국 고용 지표 추이</h3>
        <canvas id="blsChart"></canvas>
    `;
    // 원하는 위치에 배치 (여기서는 콘텐츠 최상단에 예시로 삽입)
    mainContent.insertBefore(chartWrapper, mainContent.firstChild);

    // 2. 미국 고용노동부 API 호출 및 그래프 그리기 실행
    fetchBLSData();
});

async function fetchBLSData() {
    // ※ 주의: 실제 대량 호출시 BLS에서 등록한 정식 API Key가 필요할 수 있습니다.
    const apiUrl = 'https://api.bls.gov/publicAPI/v2/timeseries/data/LNS14000000'; // 미국 실업률 시리즈 ID 예시
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status === "REQUEST_SUCCEEDED") {
            const seriesData = data.results.series[0].data;
            
            // 최근 6개월 데이터 추출 및 정렬
            const recentData = seriesData.slice(0, 6).reverse();
            const labels = recentData.map(item => `${item.year}-${item.periodName}`);
            const values = recentData.map(item => parseFloat(item.value));
            
            // 3. Chart.js를 이용해 꺾은선 그래프 생성
            const ctx = document.getElementById('blsChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '미국 실업률 (%)',
                        data: values,
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderWidth: 2,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: false } }
                }
            });
        }
    } catch (error) {
        console.error("미국 노동부 API 호출 실패:", error);
    }
}
