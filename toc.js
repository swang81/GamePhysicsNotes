// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">前言</a></li><li class="chapter-item expanded affix "><li class="part-title">数学物理基础</li><li class="chapter-item expanded "><a href="gamePhysics/physics_math.html"><strong aria-hidden="true">1.</strong> 物理引擎中符号和单位</a></li><li class="chapter-item expanded affix "><li class="part-title">刚体动力学</li><li class="chapter-item expanded affix "><li class="part-title">碰撞检测</li><li class="chapter-item expanded "><a href="collision_detection.html"><strong aria-hidden="true">2.</strong> 碰撞检测</a></li><li class="chapter-item expanded affix "><li class="part-title">约束求解</li><li class="chapter-item expanded "><a href="dynamics_constraints.html"><strong aria-hidden="true">3.</strong> 动力学与约束求解</a></li><li class="chapter-item expanded "><a href="advanced_simulation.html"><strong aria-hidden="true">4.</strong> 高级物理模拟</a></li><li class="chapter-item expanded "><a href="physics_visualization.html"><strong aria-hidden="true">5.</strong> 物理可视化与调试</a></li><li class="chapter-item expanded affix "><li class="part-title">高级专题</li><li class="chapter-item expanded affix "><li class="part-title">游戏开发</li><li class="chapter-item expanded "><a href="gameDevelopment/MR_game_development/MRgame.html"><strong aria-hidden="true">6.</strong> MR游戏开发</a></li><li class="chapter-item expanded "><a href="gameDevelopment/UEC++/UEC++.html"><strong aria-hidden="true">7.</strong> UEC++概念总结</a></li><li class="chapter-item expanded "><a href="gameDevelopment/PBR_workflow/PBR_workflow.html"><strong aria-hidden="true">8.</strong> 基于PBR流程的游戏3D建模</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
