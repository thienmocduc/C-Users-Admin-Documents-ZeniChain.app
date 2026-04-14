#!/usr/bin/env python3
"""
Build index.html from source.html with full i18n support.
Adds data-i18n attributes to all Vietnamese text elements.
"""
import re

with open('source.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ============================================================
# 1. Add <script src="js/translations.js"></script> before inline <script>
# ============================================================
html = html.replace(
    '<script>\n// ══ NAVIGATION ══',
    '<script src="js/translations.js"></script>\n<script>\n// ══ NAVIGATION ══'
)

# ============================================================
# 2. Replace the existing TRANSLATIONS block and applyLang with enhanced versions
# ============================================================

# Remove existing inline TRANSLATIONS object (it's all on a single line)
# We match from "const TRANSLATIONS" to the end of that line (no DOTALL, so . doesn't match \n)
html = re.sub(
    r'// ══ TRANSLATIONS ══\nconst TRANSLATIONS = \{[^\n]+\n',
    '// ══ TRANSLATIONS ══\n// Translations loaded from js/translations.js\n',
    html
)

# Fix truncated line from source (let CURRENT_L is a broken duplicate)
html = html.replace('\nlet CURRENT_L\n', '\n')

# Replace applyLang function with enhanced version
old_applyLang = """function applyLang(lang) {
  CURRENT_LANG = lang;
  if(window.TRANSLATIONS && TRANSLATIONS[lang]) {
    const info = TRANSLATIONS[lang];
    document.documentElement.setAttribute('dir', info.dir || 'ltr');
    document.body.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = info[key] || key;
      if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.textContent = val;
    });
  }
  document.getElementById('lang-btn-flag').textContent = LANG_FLAGS[lang] || '🌐';
  document.getElementById('lang-btn-text').textContent = LANG_SHORT[lang] || lang;
  document.querySelectorAll('.lang-opt[data-lc]').forEach(o => {
    const lc = o.getAttribute('data-lc');
    o.classList.toggle('active', lc === lang);
    const check = document.getElementById('lc-' + lc);
    if(check) check.style.display = (lc === lang) ? '' : 'none';
  });
  try { localStorage.setItem('zeni_lang', lang); } catch(e) {}
}"""

new_applyLang = """function applyLang(lang) {
  CURRENT_LANG = lang;
  if(window.TRANSLATIONS && TRANSLATIONS[lang]) {
    const info = TRANSLATIONS[lang];
    const dir = info.dir || 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang.toLowerCase());
    document.body.setAttribute('data-lang', lang);
    // Translate all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = info[key];
      if(!val) return;
      if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });
    // Translate data-i18n-placeholder attributes (inputs with visible labels)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = info[key];
      if(val) el.placeholder = val;
    });
    // Translate data-i18n-title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = info[key];
      if(val) el.title = val;
    });
    // Update page titles map for current language
    if(info.nav_dashboard) PAGE_TITLES.dashboard = info.nav_dashboard;
    if(info.nav_wallet) PAGE_TITLES.wallet = info.nav_wallet;
    if(info.nav_affiliate) PAGE_TITLES.affiliate = info.nav_affiliate;
    if(info.nav_voucher) PAGE_TITLES.voucher = info.nav_voucher;
    if(info.nav_pools) PAGE_TITLES.pools = info.nav_pools;
    if(info.nav_onchain) PAGE_TITLES.onchain = info.nav_onchain;
    if(info.nav_nfts) PAGE_TITLES.nfts = info.nav_nfts;
    if(info.nav_admin) PAGE_TITLES.admin = info.nav_admin;
    if(info.nav_settings) PAGE_TITLES.settings = info.nav_settings;
    if(info.nav_staking) PAGE_TITLES.staking = info.nav_staking;
    if(info.nav_governance) PAGE_TITLES.governance = info.nav_governance;
    if(info.nav_analytics) PAGE_TITLES.analytics = info.nav_analytics;
    // Re-apply current page title
    const activeScreen = document.querySelector('.screen.active');
    if(activeScreen) {
      const id = activeScreen.id.replace('screen-','');
      const titleEl = document.getElementById('topbar-title');
      if(titleEl && PAGE_TITLES[id]) titleEl.textContent = PAGE_TITLES[id];
    }
  }
  // Update lang switcher UI
  document.getElementById('lang-btn-flag').textContent = LANG_FLAGS[lang] || '\\u{1F310}';
  document.getElementById('lang-btn-text').textContent = LANG_SHORT[lang] || lang;
  document.querySelectorAll('.lang-opt[data-lc]').forEach(o => {
    const lc = o.getAttribute('data-lc');
    o.classList.toggle('active', lc === lang);
    const check = document.getElementById('lc-' + lc);
    if(check) check.style.display = (lc === lang) ? '' : 'none';
  });
  // Update settings lang select if present
  const langSelect = document.getElementById('lang-select-prefs');
  if(langSelect) langSelect.value = lang;
  try { localStorage.setItem('zeni_lang', lang); } catch(e) {}
}"""

html = html.replace(old_applyLang, new_applyLang)

# ============================================================
# 3. Add data-i18n attributes to all Vietnamese text elements
#    We do targeted replacements to preserve exact HTML structure
# ============================================================

replacements = [
    # === LANDING PAGE NAV ===
    ('<a class="land-nav-link" onclick="scrollTo(\'why\')">Điểm mạnh</a>',
     '<a class="land-nav-link" onclick="scrollTo(\'why\')" data-i18n="land_nav_strengths">Điểm mạnh</a>'),
    ('<a class="land-nav-link" onclick="scrollTo(\'zenid\')">Zeni ID</a>',
     '<a class="land-nav-link" onclick="scrollTo(\'zenid\')" data-i18n="land_nav_zenid">Zeni ID</a>'),
    ('<a class="land-nav-link" onclick="scrollTo(\'eco\')">Hệ sinh thái</a>',
     '<a class="land-nav-link" onclick="scrollTo(\'eco\')" data-i18n="land_nav_ecosystem">Hệ sinh thái</a>'),
    ('<a class="land-nav-link" onclick="scrollTo(\'token\')">Tokenomics</a>',
     '<a class="land-nav-link" onclick="scrollTo(\'token\')" data-i18n="land_nav_tokenomics">Tokenomics</a>'),
    ('<button class="btn-login" onclick="showLogin()">Đăng nhập</button>',
     '<button class="btn-login" onclick="showLogin()" data-i18n="land_btn_login">Đăng nhập</button>'),
    ('<button class="btn-signup" onclick="showRegister()">Đăng ký ngay</button>',
     '<button class="btn-signup" onclick="showRegister()" data-i18n="land_btn_signup">Đăng ký ngay</button>'),

    # === HERO ===
    ('<div class="hero-badge"><div class="hero-badge-dot"></div>Polygon CDK · ASEAN Wellness Web3</div>',
     '<div class="hero-badge"><div class="hero-badge-dot"></div><span data-i18n="hero_badge">Polygon CDK · ASEAN Wellness Web3</span></div>'),
    ('<h1 class="hero-title">Blockchain dành cho<br><span class="grad">Wellness & Commerce</span><br>ASEAN</h1>',
     '<h1 class="hero-title"><span data-i18n="hero_title_1">Blockchain dành cho</span><br><span class="grad" data-i18n="hero_title_2">Wellness & Commerce</span><br><span data-i18n="hero_title_3">ASEAN</span></h1>'),
    ('<p class="hero-sub">Zeni Chain là nền tảng Web3 duy nhất có real utility từ hệ sinh thái wellness thật — không đầu cơ, không farming. Kiếm $Zeni từ doanh số thật, đổi XP lấy dịch vụ thật.</p>',
     '<p class="hero-sub" data-i18n="hero_sub">Zeni Chain là nền tảng Web3 duy nhất có real utility từ hệ sinh thái wellness thật — không đầu cơ, không farming. Kiếm $Zeni từ doanh số thật, đổi XP lấy dịch vụ thật.</p>'),
    ('<button class="hero-btn-primary" onclick="showRegister()">🚀 Bắt đầu miễn phí</button>',
     '<button class="hero-btn-primary" onclick="showRegister()" data-i18n="hero_btn_start">🚀 Bắt đầu miễn phí</button>'),
    ('<button class="hero-btn-secondary" onclick="enterDemo()">Xem Demo →</button>',
     '<button class="hero-btn-secondary" onclick="enterDemo()" data-i18n="hero_btn_demo">Xem Demo →</button>'),
    # Hero stats
    ('<div class="hero-stat-lbl">$Zeni Staked</div>',
     '<div class="hero-stat-lbl" data-i18n="hero_stat_staked">$Zeni Staked</div>'),
    ('<div class="hero-stat-lbl">KOC Network</div>',
     '<div class="hero-stat-lbl" data-i18n="hero_stat_koc">KOC Network</div>'),
    ('<div class="hero-stat-lbl">GMV / Tháng</div>',
     '<div class="hero-stat-lbl" data-i18n="hero_stat_gmv">GMV / Tháng</div>'),
    ('<div class="hero-stat-lbl">Gas Fee ($Zeni)</div>',
     '<div class="hero-stat-lbl" data-i18n="hero_stat_gas">Gas Fee ($Zeni)</div>'),

    # === WHY ZENI CHAIN SECTION ===
    ('<h2 class="land-section-title">Tại sao Zeni Chain?</h2>',
     '<h2 class="land-section-title" data-i18n="why_title">Tại sao Zeni Chain?</h2>'),
    ('<p class="land-section-sub">Những điểm khác biệt mà không chain nào có được</p>',
     '<p class="land-section-sub" data-i18n="why_sub">Những điểm khác biệt mà không chain nào có được</p>'),
    ('<div class="why-title">Real Utility — Không đầu cơ</div>',
     '<div class="why-title" data-i18n="why_card1_title">Real Utility — Không đầu cơ</div>'),
    ('<div class="why-sub">$Zeni được earn từ doanh số thật (ANIMA Care, WellKOC, Biotea84), không phải farming ảo. Token có demand thật từ voucher dịch vụ, gas fee, governance.</div>',
     '<div class="why-sub" data-i18n="why_card1_sub">$Zeni được earn từ doanh số thật (ANIMA Care, WellKOC, Biotea84), không phải farming ảo. Token có demand thật từ voucher dịch vụ, gas fee, governance.</div>'),
    ('<div class="why-tag" style="background:rgba(0,212,170,0.1);color:#00D4AA;">Không có chain nào làm được</div>',
     '<div class="why-tag" style="background:rgba(0,212,170,0.1);color:#00D4AA;" data-i18n="why_card1_tag">Không có chain nào làm được</div>'),
    ('<div class="why-title">KOC Network On-Chain</div>',
     '<div class="why-title" data-i18n="why_card2_title">KOC Network On-Chain</div>'),
    ('<div class="why-sub">30% hoa hồng F1 + Revenue sharing nhóm on-chain. Escrow tự động 7 ngày, clawback smart contract. Affiliate không thể gian lận, minh bạch 100% trên blockchain.</div>',
     '<div class="why-sub" data-i18n="why_card2_sub">30% hoa hồng F1 + Revenue sharing nhóm on-chain. Escrow tự động 7 ngày, clawback smart contract. Affiliate không thể gian lận, minh bạch 100% trên blockchain.</div>'),
    ('<div class="why-title">Zeni ID — 1 tài khoản toàn hệ sinh thái</div>',
     '<div class="why-title" data-i18n="why_card3_title">Zeni ID — 1 tài khoản toàn hệ sinh thái</div>'),
    ('<div class="why-sub">Như Google Account: đăng ký 1 lần, KYC 1 lần, dùng được toàn bộ 5 platform trong hệ sinh thái Zeni. Không cần tạo tài khoản riêng cho từng app.</div>',
     '<div class="why-sub" data-i18n="why_card3_sub">Như Google Account: đăng ký 1 lần, KYC 1 lần, dùng được toàn bộ 5 platform trong hệ sinh thái Zeni. Không cần tạo tài khoản riêng cho từng app.</div>'),
    ('<div class="why-title">NFT Voucher — Đổi XP lấy dịch vụ thật</div>',
     '<div class="why-title" data-i18n="why_card4_title">NFT Voucher — Đổi XP lấy dịch vụ thật</div>'),
    ('<div class="why-sub">XP earn từ mỗi đơn hàng → Mint NFT Voucher → Đổi lấy dịch vụ ANIMA Care (khám bệnh, sản phẩm 119, đào tạo KTV). Không có chain nào có wellness voucher thật.</div>',
     '<div class="why-sub" data-i18n="why_card4_sub">XP earn từ mỗi đơn hàng → Mint NFT Voucher → Đổi lấy dịch vụ ANIMA Care (khám bệnh, sản phẩm 119, đào tạo KTV). Không có chain nào có wellness voucher thật.</div>'),
    ('<div class="why-title">Polygon CDK + AggLayer</div>',
     '<div class="why-title" data-i18n="why_card5_title">Polygon CDK + AggLayer</div>'),
    ('<div class="why-sub">Gas fee dưới 0.001 $Zeni. Finality dưới 2 giây. Settlement về Ethereum L1. ~2,400 TPS. Không cần tự build security — kế thừa từ Polygon ecosystem.</div>',
     '<div class="why-sub" data-i18n="why_card5_sub">Gas fee dưới 0.001 $Zeni. Finality dưới 2 giây. Settlement về Ethereum L1. ~2,400 TPS. Không cần tự build security — kế thừa từ Polygon ecosystem.</div>'),
    ('<div class="why-title">ASEAN-Native · 12 Ngôn ngữ</div>',
     '<div class="why-title" data-i18n="why_card6_title">ASEAN-Native · 12 Ngôn ngữ</div>'),
    ('<div class="why-sub">VI · EN · ZH · JA · KO · TH · ID · MS · HI · AR · KM · LO. Giao diện, pháp lý, và cộng đồng được thiết kế cho Đông Nam Á và SGX IPO 2031.</div>',
     '<div class="why-sub" data-i18n="why_card6_sub">VI · EN · ZH · JA · KO · TH · ID · MS · HI · AR · KM · LO. Giao diện, pháp lý, và cộng đồng được thiết kế cho Đông Nam Á và SGX IPO 2031.</div>'),

    # === ZENI ID SECTION ===
    ('>1 tài khoản.<br>Toàn bộ hệ sinh thái.</',
     ' data-i18n="zenid_title">1 tài khoản. Toàn bộ hệ sinh thái.</'),
    # Fix: the h2 has inline style, let's be more precise
]

# Apply simple replacements
for old, new in replacements:
    if old in html:
        html = html.replace(old, new, 1)

# Now do more targeted replacements using line-based approach
lines = html.split('\n')
new_lines = []

# Track context for smarter replacements
i = 0
while i < len(lines):
    line = lines[i]

    # === ZENI ID SECTION title ===
    if 'font-weight:800;color:#F0F4FF;margin-bottom:16px;">1 tài khoản.<br>Toàn bộ hệ sinh thái.</h2>' in line:
        line = line.replace(
            '>1 tài khoản.<br>Toàn bộ hệ sinh thái.</h2>',
            ' data-i18n="zenid_title">1 tài khoản. Toàn bộ hệ sinh thái.</h2>'
        )

    # Zeni ID description paragraph
    if 'Như Google Account — bạn có 1 tài khoản Google' in line:
        line = line.replace(
            'color:rgba(240,244,255,0.55);line-height:1.8;margin-bottom:24px;">Như Google Account',
            'color:rgba(240,244,255,0.55);line-height:1.8;margin-bottom:24px;" data-i18n="zenid_desc">Như Google Account'
        )

    # Zeni ID features
    if 'Đăng ký <strong>1 lần</strong> — dùng được toàn bộ 5 platform' in line:
        line = line.replace(
            '>Đăng ký <strong>1 lần</strong> — dùng được toàn bộ 5 platform</div>',
            ' data-i18n="zenid_feat1">Đăng ký 1 lần — dùng được toàn bộ 5 platform</div>'
        )
    if 'KYC <strong>1 lần</strong> — chính chủ' in line:
        line = line.replace(
            '>KYC <strong>1 lần</strong> — chính chủ, không thể có 2 tài khoản</div>',
            ' data-i18n="zenid_feat2">KYC 1 lần — chính chủ, không thể có 2 tài khoản</div>'
        )
    if 'Phí riêng theo platform — trả phí Pro trên platform nào' in line:
        line = line.replace(
            '>Phí riêng theo platform — trả phí Pro trên platform nào thì dùng platform đó</div>',
            ' data-i18n="zenid_feat3">Phí riêng theo platform — trả phí Pro trên platform nào thì dùng platform đó</div>'
        )
    if '$Zeni token và XP chảy xuyên suốt toàn bộ hệ sinh thái' in line:
        line = line.replace(
            '>$Zeni token và XP chảy xuyên suốt toàn bộ hệ sinh thái</div>',
            ' data-i18n="zenid_feat4">$Zeni token và XP chảy xuyên suốt toàn bộ hệ sinh thái</div>'
        )

    # Zeni ID CTA button
    if 'onclick="showRegister()"' in line and 'Tạo Zeni ID ngay →' in line:
        line = line.replace(
            '>Tạo Zeni ID ngay →</button>',
            ' data-i18n="zenid_cta">Tạo Zeni ID ngay →</button>'
        )

    # Zeni ID platform tags
    if 'zenid-platform-tag' in line:
        if 'Wellness · Miễn phí' in line:
            line = line.replace('>Wellness · Miễn phí<', ' data-i18n="zenid_plat_anima_tag">Wellness · Miễn phí<')
        if 'Commerce · Pro 19$/th' in line:
            line = line.replace('>Commerce · Pro 19$/th<', ' data-i18n="zenid_plat_wellkoc_tag">Commerce · Pro 19$/th<')
        if 'Marketplace · Free' in line:
            line = line.replace('>Marketplace · Free<', ' data-i18n="zenid_plat_biotea_tag">Marketplace · Free<')
        if 'SaaS · Theo gói' in line:
            line = line.replace('>SaaS · Theo gói<', ' data-i18n="zenid_plat_digital_tag">SaaS · Theo gói<')
        if 'Construction · Pro' in line:
            line = line.replace('>Construction · Pro<', ' data-i18n="zenid_plat_nexbuild_tag">Construction · Pro<')

    if '1 Zeni ID · KYC 1 lần · Bảo mật AES-256' in line:
        line = line.replace(
            '>🔒 1 Zeni ID · KYC 1 lần · Bảo mật AES-256<',
            ' data-i18n="zenid_footer">🔒 1 Zeni ID · KYC 1 lần · Bảo mật AES-256<'
        )

    # === ECOSYSTEM SECTION ===
    if '>Hệ sinh thái Zeni Holdings</h2>' in line:
        line = line.replace('>Hệ sinh thái Zeni Holdings</h2>', ' data-i18n="eco_title">Hệ sinh thái Zeni Holdings</h2>')
    if '>5 platform, 1 infrastructure, 1 token, 1 tài khoản</p>' in line:
        line = line.replace('>5 platform, 1 infrastructure, 1 token, 1 tài khoản</p>', ' data-i18n="eco_sub">5 platform, 1 infrastructure, 1 token, 1 tài khoản</p>')

    # Ecosystem card descriptions
    if 'eco-desc' in line:
        if 'Chuỗi Wellness' in line:
            line = line.replace('>Chuỗi Wellness: Clinics · KTV · ANIMA 119 · Đào tạo<', ' data-i18n="eco_anima_desc">Chuỗi Wellness: Clinics · KTV · ANIMA 119 · Đào tạo<')
        if 'Social Commerce' in line:
            line = line.replace('>Social Commerce: KOC Network · Live · Affiliate · NFT<', ' data-i18n="eco_wellkoc_desc">Social Commerce: KOC Network · Live · Affiliate · NFT<')
        if 'Supply Chain Trà' in line:
            line = line.replace('>Supply Chain Trà: Vùng nguyên liệu → Marketplace B2B<', ' data-i18n="eco_biotea_desc">Supply Chain Trà: Vùng nguyên liệu → Marketplace B2B<')
        if 'SaaS: ZeniOS' in line:
            line = line.replace('>SaaS: ZeniOS · ZeniERP · ZeniPay · Zeni Studio · Media<', ' data-i18n="eco_digital_desc">SaaS: ZeniOS · ZeniERP · ZeniPay · Zeni Studio · Media<')
        if 'Construction Tech' in line:
            line = line.replace('>Construction Tech: 11 modules · BIM · Digital Twin<', ' data-i18n="eco_nexbuild_desc">Construction Tech: 11 modules · BIM · Digital Twin<')

    # === TOKENOMICS ===
    if '>Tokenomics $Zeni</h2>' in line:
        line = line.replace('>Tokenomics $Zeni</h2>', ' data-i18n="token_title">Tokenomics $Zeni</h2>')
    if '>1 tỷ hard cap · Polygon Chain · Real demand từ hệ sinh thái</p>' in line:
        line = line.replace('>1 tỷ hard cap · Polygon Chain · Real demand từ hệ sinh thái</p>', ' data-i18n="token_sub">1 tỷ hard cap · Polygon Chain · Real demand từ hệ sinh thái</p>')
    if '>Hard Cap · Không vượt<' in line:
        line = line.replace('>Hard Cap · Không vượt<', ' data-i18n="token_hardcap">Hard Cap · Không vượt<')
    if '>Founder · Dual 10x vote<' in line:
        line = line.replace('>Founder · Dual 10x vote<', ' data-i18n="token_founder">Founder · Dual 10x vote<')

    # === CTA SECTION ===
    if '>Tham gia ngay hôm nay</h2>' in line:
        line = line.replace('>Tham gia ngay hôm nay</h2>', ' data-i18n="cta_title">Tham gia ngay hôm nay</h2>')
    if 'Tạo Zeni ID miễn phí. KYC 1 lần. Dùng được toàn bộ hệ sinh thái Zeni Holdings.' in line and '<p' in line:
        line = line.replace(
            '>Tạo Zeni ID miễn phí. KYC 1 lần. Dùng được toàn bộ hệ sinh thái Zeni Holdings.</p>',
            ' data-i18n="cta_sub">Tạo Zeni ID miễn phí. KYC 1 lần. Dùng được toàn bộ hệ sinh thái Zeni Holdings.</p>'
        )
    if 'onclick="showRegister()">🚀 Tạo Zeni ID miễn phí</button>' in line:
        line = line.replace(
            '>🚀 Tạo Zeni ID miễn phí</button>',
            ' data-i18n="cta_btn_create">🚀 Tạo Zeni ID miễn phí</button>'
        )
    if 'onclick="enterDemo()">Xem Demo App →</button>' in line:
        line = line.replace(
            '>Xem Demo App →</button>',
            ' data-i18n="cta_btn_demo">Xem Demo App →</button>'
        )

    # Footer
    if 'land-footer' in line and 'Zeni Chain · Polygon CDK' in line:
        line = line.replace(
            '>Zeni Chain · Polygon CDK · chain.zeni.holdings · © 2026 Zeni Holdings. SGX IPO Target 2031.</footer>',
            ' data-i18n="footer_text">Zeni Chain · Polygon CDK · chain.zeni.holdings · © 2026 Zeni Holdings. SGX IPO Target 2031.</footer>'
        )

    # === AUTH MODAL ===
    if 'id="auth-title"' in line and 'Đăng nhập' in line:
        line = line.replace('>Đăng nhập</div>', ' data-i18n="auth_login_title">Đăng nhập</div>')
    if 'input-label">Email / Số điện thoại' in line:
        line = line.replace('>Email / Số điện thoại</label>', ' data-i18n="auth_email_label">Email / Số điện thoại</label>')
    if 'input-label">Mật khẩu</label>' in line and 'form-login' not in line:
        line = line.replace('>Mật khẩu</label>', ' data-i18n="auth_password_label">Mật khẩu</label>')
    if 'onclick="doLogin()">Đăng nhập →</button>' in line:
        line = line.replace('>Đăng nhập →</button>', ' data-i18n="auth_login_btn">Đăng nhập →</button>')
    if 'Chưa có tài khoản?' in line:
        line = line.replace(
            '>Chưa có tài khoản? <span',
            ' data-i18n="auth_no_account">Chưa có tài khoản? <span'
        )
    if 'onclick="switchToRegister()">Đăng ký ngay</span>' in line:
        line = line.replace('>Đăng ký ngay</span>', ' data-i18n="auth_signup_link">Đăng ký ngay</span>')
    if 'Demo: duc@zeni.holdings / Zeni@2026' in line:
        line = line.replace('>Demo: duc@zeni.holdings / Zeni@2026</div>', ' data-i18n="auth_demo_hint">Demo: duc@zeni.holdings / Zeni@2026</div>')

    # Register form
    if 'input-label">Họ và tên</label>' in line:
        line = line.replace('>Họ và tên</label>', ' data-i18n="auth_fullname">Họ và tên</label>')
    if 'input-label">Số điện thoại</label>' in line:
        line = line.replace('>Số điện thoại</label>', ' data-i18n="auth_phone">Số điện thoại</label>')
    if '✓ Tạo Zeni ID — dùng được toàn bộ hệ sinh thái Zeni Holdings' in line:
        line = line.replace(
            '>✓ Tạo Zeni ID — dùng được toàn bộ hệ sinh thái Zeni Holdings</div>',
            ' data-i18n="auth_register_note">✓ Tạo Zeni ID — dùng được toàn bộ hệ sinh thái Zeni Holdings</div>'
        )
    if 'onclick="enterDemo()">Tạo tài khoản →</button>' in line:
        line = line.replace('>Tạo tài khoản →</button>', ' data-i18n="auth_register_btn">Tạo tài khoản →</button>')
    if 'Đã có tài khoản?' in line:
        line = line.replace('>Đã có tài khoản? <span', ' data-i18n="auth_has_account">Đã có tài khoản? <span')
    if 'onclick="switchToLogin()">Đăng nhập</span>' in line:
        line = line.replace('>Đăng nhập</span>', ' data-i18n="auth_login_link">Đăng nhập</span>')

    # === SIDEBAR NAV ===
    if 'nav-label' in line:
        if '>Tổng quan<' in line:
            line = line.replace('>Tổng quan</div>', ' data-i18n="nav_overview">Tổng quan</div>')
        if '>Tài sản<' in line:
            line = line.replace('>Tài sản</div>', ' data-i18n="nav_assets">Tài sản</div>')
        if '>Kinh doanh<' in line:
            line = line.replace('>Kinh doanh</div>', ' data-i18n="nav_business">Kinh doanh</div>')
        if '>Blockchain<' in line:
            line = line.replace('>Blockchain</div>', ' data-i18n="nav_blockchain">Blockchain</div>')
        if '>Tăng trưởng<' in line:
            line = line.replace('>Tăng trưởng</div>', ' data-i18n="nav_growth">Tăng trưởng</div>')
        if '>Hệ thống<' in line:
            line = line.replace('>Hệ thống</div>', ' data-i18n="nav_system">Hệ thống</div>')

    if 'nav-text' in line:
        if '>Dashboard<' in line:
            line = line.replace('>Dashboard</div>', ' data-i18n="nav_dashboard">Dashboard</div>')
        if '>Ví & Tài sản<' in line:
            line = line.replace('>Ví & Tài sản</div>', ' data-i18n="nav_wallet">Ví & Tài sản</div>')
        if '>Affiliate<' in line:
            line = line.replace('>Affiliate</div>', ' data-i18n="nav_affiliate">Affiliate</div>')
        if '>NFT Voucher<' in line:
            line = line.replace('>NFT Voucher</div>', ' data-i18n="nav_voucher">NFT Voucher</div>')
        if '>Pool Đại Sứ<' in line:
            line = line.replace('>Pool Đại Sứ</div>', ' data-i18n="nav_pools">Pool Đại Sứ</div>')
        if '>On-Chain<' in line:
            line = line.replace('>On-Chain</div>', ' data-i18n="nav_onchain">On-Chain</div>')
        if '>NFT Badges<' in line:
            line = line.replace('>NFT Badges</div>', ' data-i18n="nav_nfts">NFT Badges</div>')
        if '>Staking<' in line:
            line = line.replace('>Staking</div>', ' data-i18n="nav_staking">Staking</div>')
        if '>Governance<' in line:
            line = line.replace('>Governance</div>', ' data-i18n="nav_governance">Governance</div>')
        if '>Analytics<' in line:
            line = line.replace('>Analytics</div>', ' data-i18n="nav_analytics">Analytics</div>')
        if '>Admin Panel<' in line:
            line = line.replace('>Admin Panel</div>', ' data-i18n="nav_admin">Admin Panel</div>')
        if '>Tài khoản<' in line:
            line = line.replace('>Tài khoản</div>', ' data-i18n="nav_settings">Tài khoản</div>')

    # === DASHBOARD ===
    # Balance hero already has data-i18n="total_assets"
    if '>≈ 14,351,250 VND · ≈ $573 USD<' in line and 'balance-vnd' in line:
        line = line.replace('>≈ 14,351,250 VND · ≈ $573 USD<', ' data-i18n="dash_balance_vnd">≈ 14,351,250 VND · ≈ $573 USD<')
    if '>↑ +5.2% · 7 ngày qua<' in line:
        line = line.replace('>↑ +5.2% · 7 ngày qua<', ' data-i18n="dash_balance_change">↑ +5.2% · 7 ngày qua<')
    if '>→ Gửi $Zeni<' in line:
        line = line.replace('>→ Gửi $Zeni<', ' data-i18n="dash_btn_send">→ Gửi $Zeni<')

    # Quick stats labels
    if 'stat-mini-label' in line:
        if '>ANIMA XP On-Chain<' in line:
            line = line.replace('>ANIMA XP On-Chain<', ' data-i18n="dash_xp_label">ANIMA XP On-Chain<')
        if '>Hoa hồng tháng<' in line:
            line = line.replace('>Hoa hồng tháng<', ' data-i18n="dash_commission_label">Hoa hồng tháng<')
        if '>Escrow<' in line and 'data-i18n' not in line:
            line = line.replace('>Escrow<', ' data-i18n="dash_escrow_label">Escrow<')
        if '>NFT Voucher<' in line and 'stat-mini-label' in line:
            line = line.replace('>NFT Voucher<', ' data-i18n="dash_voucher_label">NFT Voucher<')
        if '>GMV tích lũy<' in line:
            line = line.replace('>GMV tích lũy<', ' data-i18n="dash_gmv_label">GMV tích lũy<')

    if 'stat-mini-sub' in line:
        if '>+350 hôm nay · ERC-1155<' in line:
            line = line.replace('>+350 hôm nay · ERC-1155<', ' data-i18n="dash_xp_sub">+350 hôm nay · ERC-1155<')
        if '>7 ngày<' in line and 'gold' in line:
            line = line.replace('>7 ngày<', ' data-i18n="dash_escrow_sub">7 ngày<')

    # Recent transactions section title
    if 'section-title' in line and '>Giao dịch gần đây' in line and 'section-title' in line:
        line = line.replace(
            'Giao dịch gần đây',
            '<span data-i18n="dash_recent_tx">Giao dịch gần đây</span>'
        )

    # Dashboard rank card
    if 'card-title">Rank hiện tại<' in line:
        line = line.replace('>Rank hiện tại<', ' data-i18n="dash_rank_title">Rank hiện tại<')
    if '>Hết hạn 11/05/2026<' in line:
        line = line.replace('>Hết hạn 11/05/2026<', ' data-i18n="dash_rank_expire">Hết hạn 11/05/2026<')
    if 'card-title">Tiến độ Đại Sứ<' in line:
        line = line.replace('>Tiến độ Đại Sứ<', ' data-i18n="dash_progress_title">Tiến độ Đại Sứ<')
    if '>Còn 70tr nữa<' in line:
        line = line.replace('>Còn 70tr nữa<', ' data-i18n="dash_prog_a_remain">Còn 70tr nữa<')
    if '>Còn 155tr nữa<' in line:
        line = line.replace('>Còn 155tr nữa<', ' data-i18n="dash_prog_b_remain">Còn 155tr nữa<')

    # === WALLET SCREEN ===
    if 'card-title">Thông tin ví<' in line:
        line = line.replace('>Thông tin ví<', ' data-i18n="wallet_info">Thông tin ví<')
    if 'cir-key">Địa chỉ ví<' in line:
        line = line.replace('>Địa chỉ ví<', ' data-i18n="wallet_address">Địa chỉ ví<')
    if 'card-title">Lịch sử giao dịch ví<' in line:
        line = line.replace('>Lịch sử giao dịch ví<', ' data-i18n="wallet_tx_history">Lịch sử giao dịch ví<')
    if '>🌉 Mở AggLayer Bridge →<' in line:
        line = line.replace('>🌉 Mở AggLayer Bridge →<', ' data-i18n="wallet_open_bridge">🌉 Mở AggLayer Bridge →<')

    # === AFFILIATE SCREEN ===
    if '>Trả phí 19$/tháng · Hết hạn 11/05/2026<' in line:
        line = line.replace('>Trả phí 19$/tháng · Hết hạn 11/05/2026<', ' data-i18n="aff_rank_sub">Trả phí 19$/tháng · Hết hạn 11/05/2026<')
    if 'card-title">Đội nhóm<' in line:
        line = line.replace('>Đội nhóm<', ' data-i18n="aff_team">Đội nhóm<')
    if '>Tổng F1<' in line and 'stat-mini-label' in line:
        line = line.replace('>Tổng F1<', ' data-i18n="aff_total_f1">Tổng F1<')
    if '>Chuỗi streak<' in line:
        line = line.replace('>Chuỗi streak<', ' data-i18n="aff_streak">Chuỗi streak<')
    if '>Còn 70tr → Đại Sứ<' in line:
        line = line.replace('>Còn 70tr → Đại Sứ<', ' data-i18n="aff_prog_a">Còn 70tr → Đại Sứ<')
    if '>Còn 155tr → Đại Sứ<' in line:
        line = line.replace('>Còn 155tr → Đại Sứ<', ' data-i18n="aff_prog_b">Còn 155tr → Đại Sứ<')

    # Escrow banner
    if '>2,100,000đ đang trong escrow<' in line:
        line = line.replace('>2,100,000đ đang trong escrow<', ' data-i18n="aff_escrow_title">2,100,000đ đang trong escrow<')

    # Income section
    if '>Thu nhập tháng 04/2026' in line:
        line = line.replace('>Thu nhập tháng 04/2026', ' data-i18n="aff_income_title">Thu nhập tháng 04/2026')
    if '>F1 Trực tiếp (30% trên đơn hàng)<' in line:
        line = line.replace('>F1 Trực tiếp (30% trên đơn hàng)<', ' data-i18n="aff_income_f1">F1 Trực tiếp (30% trên đơn hàng)<')
    if '>Revenue sharing nhóm (20% × thu nhập F1)<' in line:
        line = line.replace('>Revenue sharing nhóm (20% × thu nhập F1)<', ' data-i18n="aff_income_group">Revenue sharing nhóm (20% × thu nhập F1)<')
    if '>Giới thiệu phí Pro (15% × phí tháng)<' in line:
        line = line.replace('>Giới thiệu phí Pro (15% × phí tháng)<', ' data-i18n="aff_income_pro">Giới thiệu phí Pro (15% × phí tháng)<')
    if '>Giới thiệu học phí KTV (15% × học phí)<' in line:
        line = line.replace('>Giới thiệu học phí KTV (15% × học phí)<', ' data-i18n="aff_income_ktv">Giới thiệu học phí KTV (15% × học phí)<')
    if '>Pool Đại Sứ toàn cầu (2% GMV hệ thống)<' in line:
        line = line.replace('>Pool Đại Sứ toàn cầu (2% GMV hệ thống)<', ' data-i18n="aff_income_pool">Pool Đại Sứ toàn cầu (2% GMV hệ thống)<')
    if '>Chưa đạt rank<' in line:
        line = line.replace('>Chưa đạt rank<', ' data-i18n="aff_not_ranked">Chưa đạt rank<')

    if 'section-title">Lịch sử hoa hồng<' in line:
        line = line.replace('>Lịch sử hoa hồng<', ' data-i18n="aff_commission_history">Lịch sử hoa hồng<')

    # Filter chips
    if 'filter-chip active">Tất cả<' in line:
        line = line.replace('>Tất cả<', ' data-i18n="common_all">Tất cả<')
    if 'filter-chip">Nhóm<' in line:
        line = line.replace('>Nhóm<', ' data-i18n="common_group">Nhóm<')

    # === VOUCHER SCREEN ===
    if 'card-title" style="margin-bottom:0;">Đổi XP lấy NFT Voucher<' in line:
        line = line.replace('>Đổi XP lấy NFT Voucher<', ' data-i18n="voucher_redeem_title">Đổi XP lấy NFT Voucher<')
    if 'card-title">NFT Voucher đang giữ<' in line:
        line = line.replace('>NFT Voucher đang giữ<', ' data-i18n="voucher_holding">NFT Voucher đang giữ<')
    if '>Còn lại<' in line and 'prog-label' in line:
        line = line.replace('>Còn lại<', ' data-i18n="voucher_remaining">Còn lại<')
    if 'filter-chip">Sản phẩm<' in line:
        line = line.replace('>Sản phẩm<', ' data-i18n="voucher_filter_product">Sản phẩm<')
    if 'filter-chip">Đào tạo<' in line:
        line = line.replace('>Đào tạo<', ' data-i18n="voucher_filter_training">Đào tạo<')
    if 'filter-chip">Ăn uống<' in line:
        line = line.replace('>Ăn uống<', ' data-i18n="voucher_filter_food">Ăn uống<')

    # XP Earn Guide
    if 'card-title">XP Earn Guide<' in line:
        line = line.replace('>XP Earn Guide<', ' data-i18n="voucher_xp_guide">XP Earn Guide<')
    if '>🛒 Mỗi đơn hàng<' in line:
        line = line.replace('>🛒 Mỗi đơn hàng<', ' data-i18n="voucher_xp_order">🛒 Mỗi đơn hàng<')
    if '>💰 Mỗi 1tr GMV<' in line:
        line = line.replace('>💰 Mỗi 1tr GMV<', ' data-i18n="voucher_xp_gmv">💰 Mỗi 1tr GMV<')
    if '>🎓 Hoàn thành KTV<' in line:
        line = line.replace('>🎓 Hoàn thành KTV<', ' data-i18n="voucher_xp_ktv">🎓 Hoàn thành KTV<')
    if '>🤝 Giới thiệu Pro<' in line:
        line = line.replace('>🤝 Giới thiệu Pro<', ' data-i18n="voucher_xp_pro">🤝 Giới thiệu Pro<')
    if '>🏅 Lên rank mới<' in line:
        line = line.replace('>🏅 Lên rank mới<', ' data-i18n="voucher_xp_rank">🏅 Lên rank mới<')

    # === POOLS SCREEN ===
    if 'card-title">Quỹ Đại Sứ Toàn Cầu' in line:
        line = line.replace('>Quỹ Đại Sứ Toàn Cầu — 12% GMV hệ thống · 6 Pool × 2%<', ' data-i18n="pools_global_title">Quỹ Đại Sứ Toàn Cầu — 12% GMV hệ thống · 6 Pool × 2%<')
    if 'pool-name">Đại Sứ<' in line:
        line = line.replace('>Đại Sứ<', ' data-i18n="pools_ambassador">Đại Sứ<')
    if 'pool-name">Phượng Hoàng<' in line:
        line = line.replace('>Phượng Hoàng<', ' data-i18n="pools_phoenix">Phượng Hoàng<')
    if 'pool-name">Thiên Long<' in line:
        line = line.replace('>Thiên Long<', ' data-i18n="pools_dragon">Thiên Long<')

    # Career fund
    if 'card-title">Quỹ Cống Hiến Sự Nghiệp — Dành cho Diamond+<' in line:
        line = line.replace('>Quỹ Cống Hiến Sự Nghiệp — Dành cho Diamond+<', ' data-i18n="pools_career_title">Quỹ Cống Hiến Sự Nghiệp — Dành cho Diamond+<')
    if '>Quỹ Nhà<' in line:
        line = line.replace('>Quỹ Nhà<', ' data-i18n="pools_house_fund">Quỹ Nhà<')
    if '>Quỹ Xe<' in line:
        line = line.replace('>Quỹ Xe<', ' data-i18n="pools_car_fund">Quỹ Xe<')
    if '>Du Lịch<' in line and 'stat-mini-label' in line:
        line = line.replace('>Du Lịch<', ' data-i18n="pools_travel_fund">Du Lịch<')

    if 'card-title">Quỹ Thưởng Hiệu Suất (Admin bật/tắt)<' in line:
        line = line.replace('>Quỹ Thưởng Hiệu Suất (Admin bật/tắt)<', ' data-i18n="pools_performance_title">Quỹ Thưởng Hiệu Suất (Admin bật/tắt)<')

    # === ON-CHAIN SCREEN ===
    if 'card-title">SBT On-Chain của tôi<' in line:
        line = line.replace('>SBT On-Chain của tôi<', ' data-i18n="onchain_my_sbt">SBT On-Chain của tôi<')
    if 'section-title">Lịch sử giao dịch On-Chain' in line:
        line = line.replace('>Lịch sử giao dịch On-Chain', ' data-i18n="onchain_tx_history">Lịch sử giao dịch On-Chain')

    # === NFT BADGES ===
    if 'card-title">NFT Rank Badges' in line:
        line = line.replace('>NFT Rank Badges — Soul-bound Token (SBT) · Không thể mua bán · On-chain Polygon<', ' data-i18n="badges_title">NFT Rank Badges — Soul-bound Token (SBT) · Không thể mua bán · On-chain Polygon<')
    if 'card-title">Milestone SBT — Mốc thành tích<' in line:
        line = line.replace('>Milestone SBT — Mốc thành tích<', ' data-i18n="badges_milestone_title">Milestone SBT — Mốc thành tích<')
    if 'card-title">Streak System — Bonus F1<' in line:
        line = line.replace('>Streak System — Bonus F1<', ' data-i18n="badges_streak_title">Streak System — Bonus F1<')
    if '>Streak hiện tại<' in line:
        line = line.replace('>Streak hiện tại<', ' data-i18n="badges_streak_current">Streak hiện tại<')

    # === STAKING SCREEN ===
    if '>Đang stake<' in line:
        line = line.replace('>Đang stake<', ' data-i18n="staking_staked">Đang stake<')
    if '>Phần thưởng tích lũy<' in line:
        line = line.replace('>Phần thưởng tích lũy<', ' data-i18n="staking_rewards">Phần thưởng tích lũy<')
    if '>APY đang hưởng<' in line:
        line = line.replace('>APY đang hưởng<', ' data-i18n="staking_apy_label">APY đang hưởng<')
    if '>🔒 Stake thêm<' in line:
        line = line.replace('>🔒 Stake thêm<', ' data-i18n="staking_btn_stake">🔒 Stake thêm<')
    if '>🔓 Unstake<' in line and 'btn btn-secondary' in line:
        line = line.replace('>🔓 Unstake<', ' data-i18n="staking_btn_unstake">🔓 Unstake<')
    if 'section-title">Chọn Pool Staking<' in line:
        line = line.replace('>Chọn Pool Staking<', ' data-i18n="staking_choose_pool">Chọn Pool Staking<')
    if '>Rút bất kỳ lúc nào<' in line:
        line = line.replace('>Rút bất kỳ lúc nào<', ' data-i18n="staking_flex_sub">Rút bất kỳ lúc nào<')
    if 'section-title">Lịch sử stake<' in line:
        line = line.replace('>Lịch sử stake<', ' data-i18n="staking_history">Lịch sử stake<')
    if '>Số lượng<' in line and 'font-weight:500' in line:
        line = line.replace('>Số lượng<', ' data-i18n="staking_th_amount">Số lượng<')
    if '>Reward<' in line and 'font-weight:500' in line:
        line = line.replace('>Reward<', ' data-i18n="staking_th_reward">Reward<')
    if '>Unlock<' in line and 'font-weight:500' in line:
        line = line.replace('>Unlock<', ' data-i18n="staking_th_unlock">Unlock<')
    if '>Bất kỳ<' in line:
        line = line.replace('>Bất kỳ<', ' data-i18n="staking_anytime">Bất kỳ<')
    if 'card-title">TỔNG QUAN POOL<' in line:
        line = line.replace('>TỔNG QUAN POOL<', ' data-i18n="staking_pool_overview">TỔNG QUAN POOL<')
    if 'card-title">TÍNH TOÁN LỢI NHUẬN<' in line:
        line = line.replace('>TÍNH TOÁN LỢI NHUẬN<', ' data-i18n="staking_calculator">TÍNH TOÁN LỢI NHUẬN<')
    if '>Số lượng stake<' in line and 'input-label' in line:
        line = line.replace('>Số lượng stake<', ' data-i18n="staking_calc_amount">Số lượng stake<')
    if '>Ước tính / năm<' in line:
        line = line.replace('>Ước tính / năm<', ' data-i18n="staking_calc_yearly">Ước tính / năm<')
    if '>🔥 Phổ biến nhất<' in line:
        line = line.replace('>🔥 Phổ biến nhất<', ' data-i18n="staking_popular">🔥 Phổ biến nhất<')

    # === GOVERNANCE SCREEN ===
    if '>Quyền bỏ phiếu<' in line:
        line = line.replace('>Quyền bỏ phiếu<', ' data-i18n="gov_voting_power">Quyền bỏ phiếu<')
    if '>Đã bỏ phiếu<' in line:
        line = line.replace('>Đã bỏ phiếu<', ' data-i18n="gov_voted">Đã bỏ phiếu<')
    if '>Đang mở<' in line and 'font-size:10px' in line:
        line = line.replace('>Đang mở<', ' data-i18n="gov_open">Đang mở<')
    if 'section-title">Đề xuất đang bỏ phiếu' in line:
        line = line.replace('>Đề xuất đang bỏ phiếu', ' data-i18n="gov_proposals_active">Đề xuất đang bỏ phiếu')
    if '>🟢 Đang bỏ phiếu<' in line:
        line = line.replace('>🟢 Đang bỏ phiếu<', ' data-i18n="gov_status_voting">🟢 Đang bỏ phiếu<')
    if '>🟣 Đang bỏ phiếu<' in line:
        line = line.replace('>🟣 Đang bỏ phiếu<', ' data-i18n="gov_status_voting_purple">🟣 Đang bỏ phiếu<')
    if '>Còn 7 ngày<' in line:
        line = line.replace('>Còn 7 ngày<', ' data-i18n="gov_7days_left">Còn 7 ngày<')
    if '>Còn 10 ngày<' in line:
        line = line.replace('>Còn 10 ngày<', ' data-i18n="gov_10days_left">Còn 10 ngày<')
    if '>Tăng APY Flexible Pool từ 12% lên 15%<' in line:
        line = line.replace('>Tăng APY Flexible Pool từ 12% lên 15%<', ' data-i18n="gov_proposal_8_title">Tăng APY Flexible Pool từ 12% lên 15%<')
    if '>Mở rộng thị trường Ấn Độ — Hindi + 600M users<' in line:
        line = line.replace('>Mở rộng thị trường Ấn Độ — Hindi + 600M users<', ' data-i18n="gov_proposal_9_title">Mở rộng thị trường Ấn Độ — Hindi + 600M users<')
    if '>✅ Đồng ý<' in line:
        line = line.replace('>✅ Đồng ý<', ' data-i18n="gov_agree">✅ Đồng ý<')
    if '>❌ Phản đối<' in line:
        line = line.replace('>❌ Phản đối<', ' data-i18n="gov_disagree">❌ Phản đối<')
    if 'section-title">Đề xuất đã thông qua<' in line:
        line = line.replace('>Đề xuất đã thông qua<', ' data-i18n="gov_proposals_passed">Đề xuất đã thông qua<')
    if 'card-title">TẠO ĐỀ XUẤT<' in line:
        line = line.replace('>TẠO ĐỀ XUẤT<', ' data-i18n="gov_create_proposal">TẠO ĐỀ XUẤT<')
    if '>Cần 10,000 Zeni để tạo proposal' in line:
        line = line.replace('>Cần 10,000 Zeni để tạo proposal. Bạn đang có 2,100.<', ' data-i18n="gov_need_zeni">Cần 10,000 Zeni để tạo proposal. Bạn đang có 2,100.<')
    if '>📝 Tạo đề xuất (locked)<' in line:
        line = line.replace('>📝 Tạo đề xuất (locked)<', ' data-i18n="gov_create_locked">📝 Tạo đề xuất (locked)<')
    if 'card-title">THỐNG KÊ DAO<' in line:
        line = line.replace('>THỐNG KÊ DAO<', ' data-i18n="gov_dao_stats">THỐNG KÊ DAO<')

    # === ANALYTICS SCREEN ===
    if '>GMV tháng<' in line:
        line = line.replace('>GMV tháng<', ' data-i18n="analytics_gmv_month">GMV tháng<')
    if '>Hoa hồng<' in line and 'uppercase' in line:
        line = line.replace('>Hoa hồng<', ' data-i18n="analytics_commission">Hoa hồng<')
    if 'section-title" style="margin-bottom:0;">GMV & Hoa hồng 6 tháng<' in line:
        line = line.replace('>GMV & Hoa hồng 6 tháng<', ' data-i18n="analytics_chart_title">GMV & Hoa hồng 6 tháng<')
    if 'card-title">DOANH THU THEO SP<' in line:
        line = line.replace('>DOANH THU THEO SP<', ' data-i18n="analytics_revenue_product">DOANH THU THEO SP<')
    if 'card-title">MỤC TIÊU THÁNG<' in line:
        line = line.replace('>MỤC TIÊU THÁNG<', ' data-i18n="analytics_monthly_target">MỤC TIÊU THÁNG<')
    if 'card-title">XUẤT BÁO CÁO<' in line:
        line = line.replace('>XUẤT BÁO CÁO<', ' data-i18n="analytics_export">XUẤT BÁO CÁO<')
    if '>📊 Báo cáo tháng (PDF)<' in line:
        line = line.replace('>📊 Báo cáo tháng (PDF)<', ' data-i18n="analytics_export_monthly">📊 Báo cáo tháng (PDF)<')
    if '>📋 GMV theo ngày (CSV)<' in line:
        line = line.replace('>📋 GMV theo ngày (CSV)<', ' data-i18n="analytics_export_gmv">📋 GMV theo ngày (CSV)<')
    if '>💰 Hoa hồng chi tiết (CSV)<' in line:
        line = line.replace('>💰 Hoa hồng chi tiết (CSV)<', ' data-i18n="analytics_export_commission">💰 Hoa hồng chi tiết (CSV)<')
    if '>🧾 Báo cáo thuế TNCN<' in line:
        line = line.replace('>🧾 Báo cáo thuế TNCN<', ' data-i18n="analytics_export_tax">🧾 Báo cáo thuế TNCN<')

    # === ADMIN SCREEN ===
    if '>Quỹ Thưởng Hiệu Suất — Phần 2<' in line:
        line = line.replace('>Quỹ Thưởng Hiệu Suất — Phần 2<', ' data-i18n="admin_perf_title">Quỹ Thưởng Hiệu Suất — Phần 2<')
    if '>Flash Challenge Creator<' in line:
        line = line.replace('>Flash Challenge Creator<', ' data-i18n="admin_flash_title">Flash Challenge Creator<')
    if '>🚀 Deploy Challenge on-chain<' in line:
        line = line.replace('>🚀 Deploy Challenge on-chain<', ' data-i18n="admin_deploy_challenge">🚀 Deploy Challenge on-chain<')
    if '>Quỹ Tài Sản — Diamond+<' in line:
        line = line.replace('>Quỹ Tài Sản — Diamond+<', ' data-i18n="admin_asset_fund">Quỹ Tài Sản — Diamond+<')
    if '>💾 Lưu cấu hình<' in line:
        line = line.replace('>💾 Lưu cấu hình<', ' data-i18n="admin_save_config">💾 Lưu cấu hình<')
    if '>Clawback Tool<' in line:
        line = line.replace('>Clawback Tool<', ' data-i18n="admin_clawback">Clawback Tool<')
    if '>⚠️ Xác nhận Clawback<' in line:
        line = line.replace('>⚠️ Xác nhận Clawback<', ' data-i18n="admin_confirm_clawback">⚠️ Xác nhận Clawback<')

    # === SETTINGS SCREEN ===
    if 'stab active" id="stab-profile"' in line and '>👤 Hồ sơ<' in line:
        line = line.replace('>👤 Hồ sơ</button>', ' data-i18n="settings_tab_profile">👤 Hồ sơ</button>')
    if 'id="stab-kyc"' in line and '>🪪 KYC<' in line:
        line = line.replace('>🪪 KYC</button>', ' data-i18n="settings_tab_kyc">🪪 KYC</button>')
    if 'id="stab-security"' in line and '>🔐 Bảo mật<' in line:
        line = line.replace('>🔐 Bảo mật</button>', ' data-i18n="settings_tab_security">🔐 Bảo mật</button>')
    if 'id="stab-wallet"' in line and '>⛓ Ví<' in line:
        line = line.replace('>⛓ Ví</button>', ' data-i18n="settings_tab_wallet">⛓ Ví</button>')
    if 'id="stab-prefs"' in line and '>⚙️ Tuỳ chỉnh<' in line:
        line = line.replace('>⚙️ Tuỳ chỉnh</button>', ' data-i18n="settings_tab_prefs">⚙️ Tuỳ chỉnh</button>')

    # Profile section
    if 'section-title">Thông tin cá nhân<' in line:
        line = line.replace('>Thông tin cá nhân<', ' data-i18n="settings_personal_info">Thông tin cá nhân<')
    if '>📷 Đổi ảnh<' in line:
        line = line.replace('>📷 Đổi ảnh</button>', ' data-i18n="settings_change_photo">📷 Đổi ảnh</button>')
    if 'card-title">Zeni ID · Hệ sinh thái<' in line:
        line = line.replace('>Zeni ID · Hệ sinh thái<', ' data-i18n="settings_zeni_ecosystem">Zeni ID · Hệ sinh thái<')
    if '>Chưa kích hoạt<' in line:
        line = line.replace('>Chưa kích hoạt<', ' data-i18n="settings_not_activated">Chưa kích hoạt<')
    if 'input-label">Họ và tên<' in line and 'settings' not in line:
        pass  # already handled in auth
    if 'section-title">Mạng xã hội<' in line:
        line = line.replace('>Mạng xã hội<', ' data-i18n="settings_social">Mạng xã hội<')
    if '>💾 Lưu thay đổi<' in line:
        line = line.replace('>💾 Lưu thay đổi</button>', ' data-i18n="settings_save_changes">💾 Lưu thay đổi</button>')
    if '>↩ Huỷ<' in line:
        line = line.replace('>↩ Huỷ</button>', ' data-i18n="settings_cancel">↩ Huỷ</button>')

    # KYC
    if '>Chờ xác minh<' in line and 'font-weight:600' in line:
        line = line.replace('>Chờ xác minh<', ' data-i18n="settings_kyc_pending">Chờ xác minh<')
    if 'section-title">Xác minh danh tính<' in line:
        line = line.replace('>Xác minh danh tính<', ' data-i18n="settings_kyc_verify">Xác minh danh tính<')
    if 'card-title">Quyền lợi KYC<' in line:
        line = line.replace('>Quyền lợi KYC<', ' data-i18n="settings_kyc_benefits">Quyền lợi KYC<')

    # Security
    if 'section-title">Đổi mật khẩu<' in line:
        line = line.replace('>Đổi mật khẩu<', ' data-i18n="settings_change_pw">Đổi mật khẩu<')
    if 'section-title">PIN giao dịch 6 số<' in line:
        line = line.replace('>PIN giao dịch 6 số<', ' data-i18n="settings_pin_title">PIN giao dịch 6 số<')
    if '>Bắt buộc khi xác nhận giao dịch on-chain<' in line:
        line = line.replace('>Bắt buộc khi xác nhận giao dịch on-chain<', ' data-i18n="settings_pin_sub">Bắt buộc khi xác nhận giao dịch on-chain<')
    if '>🔑 Cập nhật<' in line:
        line = line.replace('>🔑 Cập nhật</button>', ' data-i18n="settings_update_pw">🔑 Cập nhật</button>')
    if '>🔒 Đặt PIN mới<' in line:
        line = line.replace('>🔒 Đặt PIN mới</button>', ' data-i18n="settings_new_pin">🔒 Đặt PIN mới</button>')
    if 'section-title">Xác thực 2 yếu tố (2FA)<' in line:
        line = line.replace('>Xác thực 2 yếu tố (2FA)<', ' data-i18n="settings_2fa_title">Xác thực 2 yếu tố (2FA)<')
    if 'section-title">Phiên đăng nhập<' in line:
        line = line.replace('>Phiên đăng nhập<', ' data-i18n="settings_sessions">Phiên đăng nhập<')
    if '>🚫 Đăng xuất tất cả thiết bị khác<' in line:
        line = line.replace('>🚫 Đăng xuất tất cả thiết bị khác</button>', ' data-i18n="settings_logout_all">🚫 Đăng xuất tất cả thiết bị khác</button>')

    # Prefs
    if 'section-title">Ngôn ngữ & Khu vực<' in line:
        line = line.replace('>Ngôn ngữ & Khu vực<', ' data-i18n="settings_lang_region">Ngôn ngữ & Khu vực<')
    if 'section-title">Giao diện<' in line:
        line = line.replace('>Giao diện<', ' data-i18n="settings_appearance">Giao diện<')
    if 'section-title">Thông báo<' in line:
        line = line.replace('>Thông báo<', ' data-i18n="settings_notifications">Thông báo<')
    if 'section-title">Xuất dữ liệu<' in line:
        line = line.replace('>Xuất dữ liệu<', ' data-i18n="settings_export_data">Xuất dữ liệu<')
    if '>⚠️ Vùng nguy hiểm<' in line:
        line = line.replace('>⚠️ Vùng nguy hiểm<', ' data-i18n="settings_danger_zone">⚠️ Vùng nguy hiểm<')
    if '>🚫 Đình chỉ tài khoản<' in line:
        line = line.replace('>🚫 Đình chỉ tài khoản</button>', ' data-i18n="settings_suspend">🚫 Đình chỉ tài khoản</button>')

    # Settings wallet tab
    if 'section-title">Giới hạn rút tiền<' in line:
        line = line.replace('>Giới hạn rút tiền<', ' data-i18n="settings_withdraw_limit">Giới hạn rút tiền<')
    if 'section-title">Kết nối ví ngoài<' in line:
        line = line.replace('>Kết nối ví ngoài<', ' data-i18n="settings_connect_wallet">Kết nối ví ngoài<')
    if '>Chưa kết nối<' in line:
        line = line.replace('>Chưa kết nối<', ' data-i18n="settings_not_connected">Chưa kết nối<')

    # Toggle labels
    if 'toggle-label">🌙 Chế độ tối<' in line:
        line = line.replace('>🌙 Chế độ tối<', ' data-i18n="settings_dark_mode">🌙 Chế độ tối<')
    if 'toggle-label">✨ Hiệu ứng chakra<' in line:
        line = line.replace('>✨ Hiệu ứng chakra<', ' data-i18n="settings_chakra_fx">✨ Hiệu ứng chakra<')
    if 'toggle-label">🔢 Hiển thị số dư<' in line:
        line = line.replace('>🔢 Hiển thị số dư<', ' data-i18n="settings_show_balance">🔢 Hiển thị số dư<')
    if 'toggle-label">💰 Hoa hồng released<' in line:
        line = line.replace('>💰 Hoa hồng released<', ' data-i18n="settings_notif_commission">💰 Hoa hồng released<')
    if 'toggle-label">⛓ Giao dịch on-chain<' in line:
        line = line.replace('>⛓ Giao dịch on-chain<', ' data-i18n="settings_notif_onchain">⛓ Giao dịch on-chain<')
    if 'toggle-label">🏅 Rank thay đổi<' in line:
        line = line.replace('>🏅 Rank thay đổi<', ' data-i18n="settings_notif_rank">🏅 Rank thay đổi<')
    if 'toggle-label">📢 Tin tức Zeni<' in line:
        line = line.replace('>📢 Tin tức Zeni<', ' data-i18n="settings_notif_news">📢 Tin tức Zeni<')

    # Bottom nav
    if 'bnav-label">Home<' in line:
        line = line.replace('>Home<', ' data-i18n="bnav_home">Home<')
    if 'bnav-label">Affiliate<' in line:
        line = line.replace('>Affiliate<', ' data-i18n="bnav_affiliate">Affiliate<')
    if 'bnav-label">Voucher<' in line:
        line = line.replace('>Voucher<', ' data-i18n="bnav_voucher">Voucher<')
    if 'bnav-label">Staking<' in line:
        line = line.replace('>Staking<', ' data-i18n="bnav_staking">Staking<')
    if 'bnav-label">Tài khoản<' in line:
        line = line.replace('>Tài khoản<', ' data-i18n="bnav_account">Tài khoản<')

    # Staking modal
    if '>🔒 Stake $Zeni<' in line:
        line = line.replace('>🔒 Stake $Zeni<', ' data-i18n="staking_modal_title">🔒 Stake $Zeni<')
    if '>✅ Xác nhận<' in line and 'stake-modal' in lines[max(0,i-5):i+1].__repr__():
        line = line.replace('>✅ Xác nhận<', ' data-i18n="staking_confirm">✅ Xác nhận<')
    if '>Huỷ<' in line and 'btn btn-ghost' in line:
        line = line.replace('>Huỷ<', ' data-i18n="common_cancel">Huỷ<')
    if '>⚠️ Xác nhận Unstake<' in line:
        line = line.replace('>⚠️ Xác nhận Unstake<', ' data-i18n="staking_confirm_unstake">⚠️ Xác nhận Unstake<')

    # Admin input labels
    if 'input-label">Tên Challenge<' in line:
        line = line.replace('>Tên Challenge<', ' data-i18n="admin_challenge_name">Tên Challenge<')
    if 'input-label">Bắt đầu<' in line:
        line = line.replace('>Bắt đầu<', ' data-i18n="admin_start">Bắt đầu<')
    if 'input-label">Kết thúc<' in line:
        line = line.replace('>Kết thúc<', ' data-i18n="admin_end">Kết thúc<')
    if 'input-label">Ngôn ngữ hiển thị<' in line:
        line = line.replace('>Ngôn ngữ hiển thị<', ' data-i18n="settings_display_lang">Ngôn ngữ hiển thị<')
    if 'input-label">Đơn vị tiền tệ<' in line:
        line = line.replace('>Đơn vị tiền tệ<', ' data-i18n="settings_currency">Đơn vị tiền tệ<')
    if 'input-label">Múi giờ<' in line:
        line = line.replace('>Múi giờ<', ' data-i18n="settings_timezone">Múi giờ<')

    # Mint NFT buttons
    if '>Mint NFT →<' in line:
        line = line.replace('>Mint NFT →<', ' data-i18n="voucher_mint">Mint NFT →<')

    # Voucher "Dùng" buttons
    if '>Dùng<' in line and 'btn btn-secondary' in line:
        line = line.replace('>Dùng<', ' data-i18n="voucher_use">Dùng<')

    new_lines.append(line)
    i += 1

html = '\n'.join(new_lines)

# ============================================================
# 4. Restore lang init at bottom of script
# ============================================================
# Add lang restoration from localStorage after the closeLangDropdown block
old_init = """try {
  const saved = localStorage.getItem('zeni_lang');
  if(saved && saved !== 'VI') applyLang(saved);
} catch(e) {}"""

# Check if it exists, if not add it
if 'zeni_lang' in html and 'getItem' in html:
    pass  # already exists
else:
    html = html.replace(
        '</script>\n</body>',
        '\n// Restore saved language\ntry { const saved = localStorage.getItem(\'zeni_lang\'); if(saved && saved !== \'VI\') applyLang(saved); } catch(e) {}\n</script>\n</body>'
    )

# Write the final file
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Count data-i18n attributes
import re
count = len(re.findall(r'data-i18n=', html))
print(f"Done! Written index.html with {count} data-i18n attributes.")
print(f"File size: {len(html)} bytes")
