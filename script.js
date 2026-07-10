// 블로그가 로드되면 실행
document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.querySelector('.main') || document.body; 
    
    // 1. 미국 고용 지표 그래프 박스 생성
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-container';
    chartWrapper.innerHTML = `
        <h3 style="margin-top:0; margin-bottom:15px; font-size:18px; color:#111;">미국 고용 지표 추이</h3>
        <canvas id="blsChart"></canvas>
    `;
    mainContent.insertBefore(chartWrapper, mainContent.firstChild);

    // 2. 모바일 하단 앱 스타일 고정 네비게이션 바(Bottom Tab Bar) 삽입
    createBottomNavigationBar();

    // 3. 미국 고용노동부 API 호출 및 그래프 그리기 실행
    fetchBLSData();
});

// 모바일 하단 고정 네비게이션 바 동적 삽입 함수
function createBottomNavigationBar() {
    const bottomNav = document.createElement('div');
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.innerHTML = `
        <a href="/" class="nav-item active">
            <img src="https://cdn.jsdelivr.net/gh/red9keep/alpha-flow@main/images/icons/home.svg" alt="홈" class="nav-icon" />
            <span class="nav-label">홈</span>
        </a>
        <a href="#dashboard" class="nav-item">
            <img src="https://cdn.jsdelivr.net/gh/red9keep/alpha-flow@main/images/icons/bar-chart.svg" alt="지표" class="nav-icon" />
            <span class="nav-label">지표</span>
        </a>
        <a href="#features" class="nav-item">
            <img src="https://cdn.jsdelivr.net/gh/red9keep/alpha-flow@main/images/icons/zap.svg" alt="추천" class="nav-icon" />
            <span class="nav-label">추천</span>
        </a>
        <a href="#notices" class="nav-item">
            <img src="https://cdn.jsdelivr.net/gh/red9keep/alpha-flow@main/images/icons/bell.svg" alt="알림" class="nav-icon" />
            <span class="nav-label">알림</span>
        </a>
        <a href="#settings" class="nav-item">
            <img src="https://cdn.jsdelivr.net/gh/red9keep/alpha-flow@main/images/icons/settings.svg" alt="설정" class="nav-icon" />
            <span class="nav-label">설정</span>
        </a>
    `;
    document.body.appendChild(bottomNav);

    // 하단 탭 클릭 시 활성화(Active) 변경 이벤트 추가
    const navItems = bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

async function fetchBLSData() {
    const apiUrl = 'https://api.bls.gov/publicAPI/v2/timeseries/data/LNS14000000'; // 미국 실업률 시리즈 ID
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // 데이터가 성공적으로 정상 수집되었을 경우
        if (data.status === "REQUEST_SUCCEEDED" && data.results && data.results.series && data.results.series[0]) {
            const seriesData = data.results.series[0].data;
            renderChart(seriesData);
        } else {
            // 한도 초과 오류 등이 났을 때, 자동으로 대체 예시 데이터(Mock Data) 활용
            console.warn("BLS API가 제한 한도를 넘었거나 비정상 응답을 하여 로컬 오프라인 데이터로 전환합니다.");
            useMockData();
        }
    } catch (error) {
        console.error("미국 노동부 API 호출 실패, 로컬 오프라인 데이터를 불러옵니다:", error);
        useMockData();
    }
}

// 가짜 실업률 대체 데이터로 렌더링을 안전하게 방어하는 함수
function useMockData() {
    const mockSeriesData = [
      { year: "2026", periodName: "June", value: "4.1" },
      { year: "2026", periodName: "May", value: "4.0" },
      { year: "2026", periodName: "April", value: "3.9" },
      { year: "2026", periodName: "March", value: "3.8" },
      { year: "2026", periodName: "February", value: "3.9" },
      { year: "2026", periodName: "January", value: "3.7" }
    ];
    renderChart(mockSeriesData);
}

// Chart.js를 이용해 꺾은선 그래프 생성하는 핵심 렌더러
function renderChart(seriesData) {
    // 최근 6개월 데이터 추출 및 정렬
    const recentData = seriesData.slice(0, 6).reverse();
    const labels = recentData.map(item => `${item.year}-${item.periodName}`);
    const values = recentData.map(item => parseFloat(item.value));
    
    const ctx = document.getElementById('blsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '미국 실업률 (%)',
                data: values,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.08)',
                borderWidth: 2.5,
                tension: 0.35,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, /* 상자 안에 가득 차게 반응형 제어 */
            scales: { 
                y: { 
                    beginAtZero: false,
                    grid: {
                        color: '#f3f4f6'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false /* 지저분한 범례 제거하고 미니멀화 */
                }
            }
        }
    });
}
