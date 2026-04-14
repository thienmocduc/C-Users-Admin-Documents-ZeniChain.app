# -*- coding: utf-8 -*-
import sys

with open("C:/Users/Admin/Documents/Zeni-Chain_AppWeb3/frontend-static/source.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Lines to remove (1-indexed): broken wrapper screen divs
remove_lines = {856, 956, 1083, 1241, 1540, 1613, 2008, 2069, 2216, 2301}

output = []
for i, line in enumerate(lines, 1):
    if i in remove_lines:
        continue

    if i == 2871:
        output.append("// TRANSLATIONS loaded from external js/translations.js\n")
        continue

    if i == 2872:
        continue

    # Inject new CSS before </style>
    if i == 404 and line.strip() == '</style>':
        output.append("\n/* === CARD HOVER === */\n")
        output.append(".card{transition:transform 0.2s ease,box-shadow 0.2s ease;}\n")
        output.append(".card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15);}\n")
        output.append("\n/* === HORIZONTAL ECOSYSTEM MENU === */\n")
        output.append(".horiz-menu{display:flex;gap:2px;padding:0 20px;height:36px;align-items:center;background:var(--bg2);border-bottom:1px solid var(--border);overflow-x:auto;}\n")
        output.append(".hmenu-item{position:relative;padding:6px 14px;font-size:12px;font-weight:500;color:var(--muted);cursor:pointer;border-radius:8px;transition:all 0.15s;white-space:nowrap;}\n")
        output.append(".hmenu-item:hover{background:rgba(107,33,240,0.1);color:var(--c6b);}\n")
        output.append(".hmenu-drop{display:none;position:absolute;top:100%;left:0;min-width:320px;background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:8px;z-index:9999;box-shadow:0 16px 48px rgba(0,0,0,0.5);backdrop-filter:blur(20px);}\n")
        output.append(".hmenu-item:hover .hmenu-drop{display:block;}\n")
        output.append(".hmenu-drop a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;font-size:12px;color:var(--muted);cursor:pointer;transition:all 0.15s;text-decoration:none;}\n")
        output.append(".hmenu-drop a:hover{background:rgba(107,33,240,0.1);color:var(--white);}\n")
        output.append(".eco-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}\n")
        output.append(".eco-badge{font-size:9px;padding:2px 8px;border-radius:8px;font-weight:600;margin-left:auto;}\n")
        output.append(".eco-badge.active{background:rgba(0,212,170,0.12);color:#00D4AA;}\n")
        output.append(".eco-badge.building{background:rgba(245,158,11,0.12);color:#F59E0B;}\n")
        output.append(".hmenu-footer{border-top:1px solid var(--border);margin-top:4px;padding-top:8px;}\n")
        output.append(".hmenu-footer a{color:var(--c6b);font-weight:600;}\n")
        output.append("body.light .horiz-menu{background:rgba(248,250,255,0.94);}\n")
        output.append("body.light .hmenu-drop{background:rgba(252,253,255,0.97);box-shadow:0 16px 48px rgba(0,0,0,0.1);}\n")
        output.append("@media(max-width:768px){.horiz-menu{display:none;}}\n\n")
        output.append(line)
        continue

    # Insert horizontal menu before content-area
    if i == 690 and '<div class="content-area">' in line:
        hmenu = """
    <!-- HORIZONTAL ECOSYSTEM MENU -->
    <div class="horiz-menu">
      <div class="hmenu-item" onmouseenter="showDrop('eco')" onmouseleave="hideDrop('eco')">
        H\u1ec7 sinh th\u00e1i \u25be
        <div class="hmenu-drop" id="drop-eco">
          <a href="https://app.animacare.global" target="_blank">
            <span class="eco-dot" style="background:#00D4AA"></span>
            ANIMA Care Global \u2014 Wellness Clinics \u00b7 KTV \u00b7 \u0110\u00e0o t\u1ea1o
            <span class="eco-badge active">Live</span>
          </a>
          <a href="#">
            <span class="eco-dot" style="background:#4A8DFF"></span>
            WellKOC \u2014 Social Commerce \u00b7 KOC Network \u00b7 Affiliate
            <span class="eco-badge active">Live</span>
          </a>
          <a href="#">
            <span class="eco-dot" style="background:#F59E0B"></span>
            Biotea84 \u2014 Supply Chain Tr\u00e0 \u00b7 Marketplace B2B
            <span class="eco-badge active">Live</span>
          </a>
          <a href="#">
            <span class="eco-dot" style="background:#8B45FF"></span>
            Zeni Digital \u2014 SaaS: ZeniOS \u00b7 ZeniERP \u00b7 ZeniPay
            <span class="eco-badge building">Building</span>
          </a>
          <a href="#">
            <span class="eco-dot" style="background:#EC4899"></span>
            NexBuild Holdings \u2014 Construction Tech \u00b7 BIM
            <span class="eco-badge building">Building</span>
          </a>
          <div class="hmenu-footer">
            <a onclick="goTo('community')">&#127760; Kh\u00e1m ph\u00e1 c\u1ed9ng \u0111\u1ed3ng to\u00e0n h\u1ec7 sinh th\u00e1i &#8594;</a>
          </div>
        </div>
      </div>
      <div class="hmenu-item" onmouseenter="showDrop('tai-san')" onmouseleave="hideDrop('tai-san')">
        T\u00e0i s\u1ea3n \u25be
        <div class="hmenu-drop" id="drop-tai-san">
          <a onclick="goTo('wallet')">&#128142; V\u00ed &amp; T\u00e0i s\u1ea3n</a>
          <a onclick="goTo('staking')">&#128274; Staking</a>
        </div>
      </div>
      <div class="hmenu-item" onmouseenter="showDrop('kd')" onmouseleave="hideDrop('kd')">
        Kinh doanh \u25be
        <div class="hmenu-drop" id="drop-kd">
          <a onclick="goTo('affiliate')">&#129309; Affiliate</a>
          <a onclick="goTo('voucher')">&#127903; NFT Voucher</a>
          <a onclick="goTo('pools')">&#127760; Pool \u0110\u1ea1i S\u1ee9</a>
        </div>
      </div>
      <div class="hmenu-item" onmouseenter="showDrop('bc')" onmouseleave="hideDrop('bc')">
        Blockchain \u25be
        <div class="hmenu-drop" id="drop-bc">
          <a onclick="goTo('onchain')">&#9939; On-Chain</a>
          <a onclick="goTo('nfts')">&#127941; NFT Badges</a>
          <a onclick="goTo('governance')">&#128499; Governance</a>
        </div>
      </div>
    </div>

"""
        output.append(hmenu)
        output.append(line)
        continue

    # Add demo user
    if i == 2746 and "'duc@zeni.holdings'" in line:
        output.append("  'doanhnhancaotuan@gmail.com': { pw: 'Tuan6868@', name: 'Thi\u00ean M\u1ed9c \u0110\u1ee9c', rank: '&#128142; Chairman', avatar: 'T' },\n")
        output.append(line)
        continue

    # Modify goTo signature
    if i == 2688 and 'function goTo(id)' in line:
        output.append("function goTo(id, skipPush) {\n")
        continue

    # Add URL push after settings check in goTo
    if i == 2706 and "settings" in line and "switchTab" in line:
        output.append(line)
        output.append("  if(!skipPush){var p='/'+id;if(location.pathname!==p)history.pushState({screen:id},'',p);document.title=(PAGE_TITLES[id]||'Zeni Chain')+' \\u00b7 Zeni Chain';}\n")
        continue

    # Add external translations script before <script>
    if i == 2679 and '<script>' in line:
        output.append('<script src="js/translations.js"></script>\n')
        output.append(line)
        continue

    # Before </script>, add dropdown helpers and routing
    if i == 2879 and '</script>' in line:
        extra = """
// == DROPDOWN HELPERS ==
function showDrop(id){var el=document.getElementById('drop-'+id);if(el)el.style.display='block';}
function hideDrop(id){var el=document.getElementById('drop-'+id);if(el)el.style.display='none';}

// == URL ROUTING ==
var _RT={dashboard:1,wallet:1,affiliate:1,voucher:1,pools:1,onchain:1,nfts:1,staking:1,governance:1,analytics:1,admin:1,settings:1};
function _hr(){var p=location.pathname.slice(1);if(!p)return;if(_RT[p]){var a=document.getElementById("app");if(!a||a.style.display!=="flex")enterApp({name:"Thi\u00ean M\u1ed9c \u0110\u1ee9c",rank:"&#128142; Chairman",avatar:"T"});goTo(p,true);}}
window.addEventListener("popstate",function(e){if(e.state&&e.state.screen)goTo(e.state.screen,true);else{document.getElementById("landing").style.display="";document.getElementById("app").style.display="none";}});
setTimeout(_hr,200);

"""
        output.append(extra)
        output.append(line)
        continue

    output.append(line)

with open("C:/Users/Admin/Documents/Zeni-Chain_AppWeb3/frontend-static/index.html", "w", encoding="utf-8") as f:
    f.writelines(output)

print("Done! Output lines:", len(output))
