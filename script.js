// 블로그가 로드되면 실행
document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.querySelector('.main') || document.body; 
    
    // 1. 상단 롤링 뉴스 슬라이더 배너 자동 생성 및 삽입
    createRollingNewsBanner(mainContent);

    // 2. 모바일 하단 앱 스타일 고정 네비게이션 바(Bottom Tab Bar) 삽입
    createBottomNavigationBar();
});

// 상단 D-DAY 실적 롤링 뉴스 슬라이더 배너 생성 함수
function createRollingNewsBanner(container) {
    const bannerWrapper = document.createElement('div');
    bannerWrapper.className = 'rolling-banner-container';
    
    // 뉴스 슬라이더 내부 리스트 마크업 (실적 및 일정 배지 형태)
    bannerWrapper.innerHTML = `
        <div class="banner-slide-wrapper">
            <div class="banner-slide active">
                <div class="banner-content">
                    <span class="dday-badge">D-DAY</span>
                    <span class="banner-title">AVGO 브로드컴 실적 발표 및 분석 가이드</span>
                </div>
                <img src="https://cdn.jsdelivr.net/gh/red9keep/alpha-flow@main/images/icons/chevron-right.svg" class="banner-arrow" />
            </div>
            <div class="banner-slide">
                <div class="banner-content">
                    <span class="dday-badge info">D-3</span>
                    <span class="banner-title">TSMC 월간 매출 실적 속보 및 가동률 분석</span>
                </div>
                <img src="https://cdn.jsdelivr.net/gh/red9keep/alpha-flow@main/images/icons/chevron-right.svg" class="banner-arrow" />
            </div>
            <div class="banner-slide">
                <div class="banner-content">
                    <span class="dday-badge success">EVENT</span>
                    <span class="banner-title">미국 CPI 발표 일정 및 연준 금리 모니터링</span>
                </div>
                <img src="https://cdn.jsdelivr.net/gh/red9keep/alpha-flow@main/images/icons/chevron-right.svg" class="banner-arrow" />
            </div>
        </div>
        <div class="banner-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    
    // 최상단 콘텐츠 본문 위에 안전하게 삽입
    container.insertBefore(bannerWrapper, container.firstChild);

    // 롤링 뉴스 슬라이더 타이머 구동 시스템
    initBannerSlider(bannerWrapper);
}

// 배너 롤링 로직 시스템
function initBannerSlider(banner) {
    const slides = banner.querySelectorAll('.banner-slide');
    const dots = banner.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 4000; // 4초마다 롤링

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + 1) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // 주기적인 인터벌 타이머 실행
    setInterval(nextSlide, slideInterval);
}

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
