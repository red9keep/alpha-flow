// 블로그가 로드되면 실행
document.addEventListener("DOMContentLoaded", function () {
    console.log("AlphaFlow script.js DOMContentLoaded 트리거 완료!");

    // [테스트 단계] 구식 헤더를 무조건 0.1초(100ms) 뒤에 강제로 찾아서 지워보는 정밀 검증용 일시적 제거 테스트
    setTimeout(function() {
        const targetElements = document.querySelectorAll('.centered-top-container, .centered-top-placeholder, header, .header-widget, .blog-name');
        console.log("테스트 100ms 지연 타겟 탐색 결과 개수:", targetElements.length);
        targetElements.forEach(el => {
            console.log("대상 요소를 물리적으로 파괴합니다:", el);
            el.remove();
        });
    }, 100);

    const mainContent = document.querySelector('.main') || document.body; 
    
    // 1. 상단 롤링 뉴스 슬라이더 배너 자동 생성 및 삽입
    createRollingNewsBanner(mainContent);

    // 2. 본문 멀티 탭 메뉴 및 시황 배너 삽입 (Step 7)
    createDashboardTabs(mainContent);

    // 3. 모바일 하단 앱 스타일 고정 네비게이션 바(Bottom Tab Bar) 삽입
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

// 본문 3단 멀티 탭 및 시황 배너 시스템 생성 함수
function createDashboardTabs(container) {
    // 테마 간섭을 차단하기 위해, .main 또는 #page_body 컨테이너를 찾은 후 기존 구조 상단에 강제 삽입 시도합니다.
    const targetContainer = document.querySelector('#page_body') || document.querySelector('.main') || container;
    
    const tabSection = document.createElement('div');
    tabSection.className = 'dashboard-tab-section';
    tabSection.innerHTML = `
        <!-- 3단 본문 대시보드 탭 메뉴 -->
        <div class="dashboard-tabs">
            <button class="tab-btn" data-tab="alpha">알파종목</button>
            <button class="tab-btn active" data-tab="news">최신뉴스</button>
            <button class="tab-btn" data-tab="assets">보유자산</button>
        </div>

        <!-- 최신 뉴스 하위 2단계 서브 탭 메뉴 -->
        <div class="sub-tabs-bar" id="newsSubTabs">
            <button class="sub-tab active" data-sub="all">뉴스</button>
            <button class="sub-tab" data-sub="damjamsa">당잠사</button>
            <button class="sub-tab" data-sub="madmoney">매드머니</button>
            <button class="sub-tab" data-sub="video">영상뉴스</button>
        </div>

        <!-- 시황 안내 가이드 배너 -->
        <div class="guide-banner-card">
            <div class="guide-badge">시황 가이드</div>
            <div class="guide-content-wrapper">
                <div class="guide-title">보수 관망 권장</div>
                <div class="guide-desc">현재 시장은 정상 범위 내의 단기 조정장입니다. 추가 매수를 자제하고, 권장 비중(48%)에 맞춰 현금 자산을 쥔 채 보수적으로 관망하십시오. (1일 연속 상승 중)</div>
            </div>
        </div>
    `;

    // 롤링 배너 바로 다음에 주입되도록 설계하되, 컨테이너 안정성을 최우선으로 배치
    const rollingBanner = document.querySelector('.af-hero');
    if (rollingBanner) {
        rollingBanner.parentNode.insertBefore(tabSection, rollingBanner.nextSibling);
    } else {
        targetContainer.insertBefore(tabSection, targetContainer.firstChild);
    }

    // 본문 대시보드 탭 클릭 전환 처리 로직 연동
    initDashboardTabs(tabSection);
}

// 탭 클릭 제어 및 서브 탭 노출 토글 연동 로직
function initDashboardTabs(section) {
    const tabButtons = section.querySelectorAll('.tab-btn');
    const subTabsBar = section.querySelector('#newsSubTabs');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const selectedTab = this.getAttribute('data-tab');

            // '최신뉴스' 탭이 눌렸을 때만 2단계 하위 서브 탭 노출
            if (selectedTab === 'news') {
                subTabsBar.style.display = 'flex';
            } else {
                subTabsBar.style.display = 'none';
            }
        });
    });

    // 2단계 서브 탭 메뉴 하이라이트 이벤트
    const subTabs = section.querySelectorAll('.sub-tab');
    subTabs.forEach(sub => {
        sub.addEventListener('click', function() {
            subTabs.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        });
    });
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
