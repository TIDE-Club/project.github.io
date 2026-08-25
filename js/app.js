
(function () {
  const DATA = window.TIDE_DATA || { club: {}, domains: [] };
  const app = document.getElementById('app');

  const APPLY_LINK_DEFAULT = 'https://tideclub26.feishu.cn/share/base/form/shrcnYVMC76jFL0oD5ChfRJbBff';
  const APPLY_LINK_YUHONG = 'https://tideclub26.feishu.cn/share/base/form/shrcnlmjpcnAIq55M84kT2YtrTe';
  const STUDY_GROUP_LINK = 'https://tide-club.github.io/studygroup.github.io/';
  const PROJECT_DETAIL_LINK = 'https://tide-club.github.io/joinprojects.github.io/';
  const RA_DETAIL_LINK = 'https://tide-club.github.io/ResearchAssistantRecruit.github.io/';
  const INTERNSHIP_DETAIL_LINK = 'https://tide-club.github.io/internship.github.io/';
  const DEADLINE = new Date('2026-06-14T12:00:00+08:00').getTime();

  const raSamples = [
    {
      title: '智能系统研究助理',
      direction: '大语言模型、智能体与知识增强',
      work: '文献调研、实验复现、数据分析与原型验证',
      audience: '对科研感兴趣并具备基础编程能力的学生'
    },
    {
      title: '数据与社会计算研究助理',
      direction: '数据科学、社会计算与交叉研究',
      work: '数据整理、研究设计、模型评估与结果汇报',
      audience: '愿意持续投入研究训练并具备数据分析基础的学生'
    }
  ];

  const internshipSamples = [
    {
      title: 'AI 应用开发实习生',
      direction: '企业 AI 应用、智能体与自动化工作流',
      work: '需求分析、应用原型开发、测试迭代与项目交付',
      audience: '具备编程基础并希望参与真实业务项目的学生'
    },
    {
      title: '数据分析与产品研究实习生',
      direction: '业务数据分析、产品研究与行业洞察',
      work: '数据处理、用户调研、方案整理与成果展示',
      audience: '对数据、产品或行业研究感兴趣的学生'
    }
  ];

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function paragraphs(text) {
    return String(text || '')
      .split(/\n+/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `<p>${esc(s)}</p>`)
      .join('');
  }

  function btn(href, label, variant = 'primary', extra = '') {
    const external = /^https?:\/\//.test(href);
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a class="btn btn-${variant} ${extra}" href="${esc(href)}"${target}>${esc(label)} <span aria-hidden="true">→</span></a>`;
  }

  function list(items) {
    if (!items || !items.length) return '';
    return `<ul class="clean">${items.map(item => `<li><span>${esc(item)}</span></li>`).join('')}</ul>`;
  }

  function getAllProjects() {
    return (DATA.domains || []).flatMap(domain => (domain.projects || []).map(project => ({ ...project, domain })));
  }

  function findProject(projectId) {
    return getAllProjects().find(project => project.id === projectId);
  }

  function findSubProject(projectId, subId) {
    const project = findProject(projectId);
    if (!project || !project.subProjects) return null;
    const sub = project.subProjects.find(item => item.id === subId);
    return sub ? { ...sub, parent: project } : null;
  }

  function applyLink(project) {
    return project && project.id === 'yuhong-agent-main' ? APPLY_LINK_YUHONG : APPLY_LINK_DEFAULT;
  }

  function statusBadge(progress) {
    const text = progress || '进行中';
    const cls = /招募中|开放|进行/.test(text) ? 'success' : /截止|结束/.test(text) ? 'warning' : 'primary';
    return `<span class="badge ${cls}">${esc(text)}</span>`;
  }

  function renderCountdown() {
    const left = DEADLINE - Date.now();
    if (left <= 0) return `<div class="countdown">⏱ 部分项目报名已截止</div>`;
    const d = Math.floor(left / 86400000);
    const h = Math.floor((left % 86400000) / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    return `<div class="countdown">⏱ 距离项目截止报名还剩：${d} 天 ${h} 时 ${m} 分</div>`;
  }

  function projectCard(project, showDomain = true) {
    const domainName = project.domain?.name || '';
    const textForSearch = [project.name, project.description, domainName, project.partner, project.leader].join(' ').toLowerCase();
    return `<article class="card card-pad project-card" data-project-card data-domain="${esc(project.domain?.id || '')}" data-search="${esc(textForSearch)}">
      <div>
        <div class="pill-row" style="margin-bottom:14px;">
          ${showDomain ? `<span class="badge primary">${esc(domainName)}</span>` : ''}
          ${statusBadge(project.progress)}
        </div>
        <h3>${esc(project.name)}</h3>
        <p class="muted small" style="margin-top:12px;">${esc(project.description || '').slice(0, 168)}${(project.description || '').length > 168 ? '...' : ''}</p>
      </div>
      <div class="project-meta">
        <span>📅 <b>${esc(project.period || '待定')}</b></span>
        <span>👥 ${esc(project.members || '待定')}</span>
        <span>🤝 ${esc(project.partner || 'TIDE Club')}</span>
      </div>
      <div class="pill-row">
        ${btn(`#/projects/${project.id}`, '查看详情', 'primary', 'btn-sm')}
      </div>
    </article>`;
  }

  function sampleOpportunityCard(item, type) {
    return `<article class="sample-opportunity">
      <div class="sample-card-head">
        <span class="badge primary">展示样例</span>
        <span class="sample-type">${esc(type)}</span>
      </div>
      <h3>${esc(item.title)}</h3>
      <dl class="sample-details">
        <div><dt>方向</dt><dd>${esc(item.direction)}</dd></div>
        <div><dt>工作内容</dt><dd>${esc(item.work)}</dd></div>
        <div><dt>适合人群</dt><dd>${esc(item.audience)}</dd></div>
      </dl>
      <span class="btn btn-disabled btn-sm" aria-disabled="true">报名功能开发中</span>
    </article>`;
  }

  function portalPoints(items) {
    return `<div class="learning-points">${items.map((item, index) => `<div><span>0${index + 1}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div>`).join('')}</div>`;
  }

  function renderHome() {
    const club = DATA.club || {};
    const missions = club.missions || [];

    return `<div class="fade-in">
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="container hero-inner">
          <div class="hero-copy">
            <h1>${esc(club.name || 'TIDE Club')}</h1>
            <p class="hero-slogan">${esc(club.slogan || 'A Community for Tech, Innovation, Design and Education')}</p>
            <div class="hero-description">${paragraphs(club.description)}</div>
          </div>
          <aside class="hero-panel">
            <h2>TIDE 俱乐部行动纲领</h2>
            <div class="mission-mini-grid">
              ${missions.map((mission, index) => {
                const parts = String(mission).split('：');
                const title = parts.shift() || mission;
                const description = parts.join('：');
                return `<div class="mission-mini"><span class="icon-bubble">${index + 1}</span><div><h3>${esc(title)}</h3>${description ? `<p class="muted small">${esc(description)}</p>` : ''}</div></div>`;
              }).join('')}
            </div>
          </aside>
        </div>
      </section>

      <section class="section portal-section">
        <div class="container learning-layout">
          <div class="portal-copy">
            <p class="section-index">01 · PROJECTS</p>
            <h2>项目招募</h2>
            <p class="lead">浏览 TIDE Club 当前展示的实践项目，了解项目方向、合作单位、岗位要求、预期产出与报名方式。你也可以通过项目详情页找到适合自己的真实实践机会。</p>
            <div class="portal-actions">${btn(PROJECT_DETAIL_LINK, '进入项目详情', 'primary')}</div>
          </div>
          ${portalPoints([
            { title: '真实议题', description: '围绕技术、产业与社会场景开展项目实践。' },
            { title: '协作成长', description: '与不同背景的伙伴共同推进调研、设计、开发与展示。' },
            { title: '成果沉淀', description: '形成可展示、可复用的项目成果与实践经验。' }
          ])}
        </div>
      </section>

      <section class="section portal-section learning-section">
        <div class="container learning-layout">
          <div class="portal-copy">
            <p class="section-index">02 · LEARNING GROUPS</p>
            <h2>学习小组</h2>
            <p class="lead">学习小组由同学自主发起，围绕 AI 工具、编程基础、论文阅读和行业主题开展持续共学。TIDE 为各小组提供组队、资料、交流与成果沉淀支持。</p>
            <div class="portal-actions">${btn(STUDY_GROUP_LINK, '进入学习小组', 'primary')}</div>
          </div>
          ${portalPoints([
            { title: '主题共学', description: '围绕清晰主题制定学习计划，在持续投入中建立知识框架。' },
            { title: '同伴交流', description: '通过讨论、分享和互助，让个人探索成为共同成长的过程。' },
            { title: '成果沉淀', description: '将笔记、工具、案例与实践结果整理为可复用的学习成果。' }
          ])}
        </div>
      </section>

      <section class="section portal-section ra-section">
        <div class="container learning-layout">
          <div class="portal-copy">
            <p class="section-index">03 · RESEARCH ASSISTANT</p>
            <h2>RA 招募</h2>
            <p class="lead">面向未来教授与研究团队的研究助理岗位发布平台。这里将集中呈现研究方向、工作内容、能力要求与申请渠道。</p>
            <div class="portal-actions">${btn(RA_DETAIL_LINK, '查看 RA 招募详情', 'primary')}</div>
          </div>
          ${portalPoints([
            { title: '研究方向', description: '了解不同课题组关注的问题、方法与研究场景。' },
            { title: '岗位信息', description: '查看研究任务、能力要求与预期投入。' },
            { title: '持续更新', description: '功能正在开发，真实岗位将陆续在详情页发布。' }
          ])}
        </div>
      </section>

      <section class="section portal-section internship-section">
        <div class="container learning-layout">
          <div class="portal-copy">
            <p class="section-index">04 · INTERNSHIPS</p>
            <h2>企业实习生招募</h2>
            <p class="lead">面向合作企业的实习岗位展示平台。未来将提供岗位职责、技能要求、工作安排与学生报名入口，帮助同学连接真实行业实践。</p>
            <div class="portal-actions">${btn(INTERNSHIP_DETAIL_LINK, '查看实习招募详情', 'primary')}</div>
          </div>
          ${portalPoints([
            { title: '企业机会', description: '聚合合作企业面向学生开放的实习与实践岗位。' },
            { title: '岗位匹配', description: '清晰呈现职责、要求和适合的能力背景。' },
            { title: '开发中', description: '岗位信息正在筹备，详情页将展示发布样例。' }
          ])}
        </div>
      </section>
    </div>`;
  }

  function renderProjectsPage() {
    const projects = getAllProjects();
    const domains = DATA.domains || [];
    return `<div class="fade-in">
      <section class="section-tight">
        <div class="container">
          <div class="breadcrumb"><a href="#/">首页</a><span>/</span><span>项目列表</span></div>
          <div class="page-title">
            <h1 style="font-size:clamp(34px,4vw,52px);">TIDE 项目列表</h1>
            <p class="lead" style="margin-top:14px;">查找正在展示和招募的项目，进入项目详情页查看岗位、目标、产出与报名入口。</p>
          </div>
          <div class="card search-panel">
            <input class="search-input" id="project-search" type="search" placeholder="搜索项目、合作方、负责人或关键词..." />
            <div class="filter-row" id="domain-filters">
              <button class="filter-btn active" data-domain-filter="all">全部方向</button>
              ${domains.map(domain => `<button class="filter-btn" data-domain-filter="${esc(domain.id)}">${esc(domain.name)}</button>`).join('')}
            </div>
          </div>
          <div class="grid project-list-grid" id="project-grid">${projects.map(project => projectCard(project)).join('')}</div>
          <div class="empty-state no-results" id="no-results"><h2>没有找到匹配项目</h2><p class="muted">可以换一个关键词，或切换到“全部方向”。</p></div>
        </div>
      </section>
    </div>`;
  }

  function metaBox(label, value) {
    if (!value) return '';
    return `<div class="meta-box"><div class="meta-label">${esc(label)}</div><div class="meta-value">${esc(value)}</div></div>`;
  }

  function renderObjectives(items) {
    if (!items || !items.length) return '';
    return `<section class="section-tight"><div class="container"><div class="section-header"><h2>核心目标</h2></div><div class="grid grid-2">${items.map((item, index) => `<article class="card objective-card"><span class="number">${index + 1}</span><h3>${esc(item.title || `目标 ${index + 1}`)}</h3><p class="muted small">${esc(item.content || item.description || '')}</p></article>`).join('')}</div></div></section>`;
  }

  function renderRecruitment(project) {
    const r = project.recruitment;
    if (!r) return '';
    const groups = [
      ['技能要求', r.skillRequirements],
      ['时间投入', r.timeRequirements],
      ['能力素质', r.qualityRequirements],
      ['预期收获', r.expectedGains]
    ];
    return `<section class="section-tight"><div class="container">
      <div class="section-header"><h2>开放招募岗位</h2><p class="lead">加入真实项目，积累产学研实战经验。</p></div>
      <div class="grid grid-3" style="margin-bottom:20px;">
        ${metaBox('招募人数', r.count)}
        ${metaBox('招聘岗位', r.position)}
        ${metaBox('报名通信', r.contact)}
      </div>
      ${r.positionDescription ? `<div class="card card-pad" style="margin-bottom:20px;"><p class="muted">${esc(r.positionDescription)}</p></div>` : ''}
      ${r.roles && r.roles.length ? `<div class="card card-pad" style="margin-bottom:20px;"><h3>招募角色</h3><div class="grid grid-3" style="margin-top:16px;">${r.roles.map(role => `<div class="meta-box"><div class="meta-label">${esc(role.count || '')}</div><div class="meta-value">${esc(role.name || '')}</div><p class="muted small" style="margin-top:8px;">${esc(role.description || '')}</p></div>`).join('')}</div></div>` : ''}
      <div class="recruitment-grid">
        ${groups.filter(([, items]) => items && items.length).map(([title, items]) => `<article class="card card-pad"><h3>${esc(title)}</h3><div style="margin-top:14px;">${list(items)}</div></article>`).join('')}
      </div>
      ${project.priorityConditions && project.priorityConditions.length ? `<div class="card card-pad" style="margin-top:20px;"><h3>优先条件</h3><div style="margin-top:14px;">${list(project.priorityConditions)}</div></div>` : ''}
    </div></section>`;
  }

  function renderSpecialSections(project) {
    let html = '';
    if (project.jobResponsibilities && project.jobResponsibilities.length) {
      html += `<section class="section-tight"><div class="container"><div class="section-header"><h2>工作职责</h2></div><div class="content-list">${project.jobResponsibilities.map(group => `<article class="responsibility"><h3>${esc(group.category)}</h3>${list(group.items || [])}</article>`).join('')}</div></div></section>`;
    }
    if (project.researchGroups && project.researchGroups.length) {
      html += `<section class="section-tight"><div class="container"><div class="section-header"><h2>研究分组</h2></div><div class="grid grid-2">${project.researchGroups.map(group => `<article class="card card-pad"><span class="badge primary">${esc(group.name)}</span><h3 style="margin-top:12px;">${esc(group.direction)}</h3><p class="muted small" style="margin-top:10px;">${esc(group.tasks)}</p></article>`).join('')}</div></div></section>`;
    }
    return html;
  }

  function renderSubProjects(project) {
    if (!project.subProjects || !project.subProjects.length) return '';
    return `<section class="section-tight"><div class="container"><div class="section-header"><h2>专项子项目</h2><p class="lead">按方向进入专项详情，查看更具体的任务与产出。</p></div><div class="grid grid-3">${project.subProjects.map(sub => `<article class="card card-pad project-card"><div><span class="badge primary">专项方向</span><h3 style="margin-top:12px;">${esc(sub.name)}</h3><p class="muted small" style="margin-top:10px;">${esc(sub.description || '').slice(0,150)}${(sub.description || '').length > 150 ? '...' : ''}</p></div><div class="project-meta"><span>📅 ${esc(sub.period || '')}</span><span>👥 ${esc(sub.members || '')}</span></div>${btn(`#/projects/${project.id}/sub/${sub.id}`, '查看专项详情', 'primary', 'btn-sm')}</article>`).join('')}</div></div></section>`;
  }

  function renderProjectDetail(projectId) {
    const project = findProject(projectId);
    if (!project) return renderNotFound('项目未找到', '该项目可能已被移除或不存在。');
    const externalLinks = [
      project.partnerUrl ? btn(project.partnerUrl, '合作方链接', 'secondary', 'btn-sm') : '',
      project.sribdUrl ? btn(project.sribdUrl, 'SRIBD 链接', 'secondary', 'btn-sm') : ''
    ].join('');
    return `<div class="fade-in">
      <section class="section-tight"><div class="container">
        <div class="breadcrumb"><a href="#/">首页</a><span>/</span><a href="#/projects">项目列表</a><span>/</span><span>${esc(project.name)}</span></div>
        <article class="card detail-hero">
          <div class="detail-title-row">
            <div>
              <div class="pill-row" style="margin-bottom:14px;"><span class="badge primary">${esc(project.domain?.name || '')}</span>${statusBadge(project.progress)}</div>
              <h1 style="font-size:clamp(30px,4vw,52px);">${esc(project.name)}</h1>
              <p class="lead" style="margin-top:16px;">${esc(project.description)}</p>
            </div>
            <div class="pill-row" style="flex-shrink:0;">${btn(applyLink(project), '点击报名', 'primary')}${externalLinks}</div>
          </div>
          <div class="detail-meta-grid">
            ${metaBox('项目周期', project.period)}
            ${metaBox('负责人', project.leader)}
            ${metaBox('指导老师', project.supervisor)}
            ${metaBox('项目成员', project.members)}
            ${metaBox('合作方', project.partner)}
            ${metaBox('录取方式', project.achievements)}
          </div>
          ${project.techIndicators ? `<div class="meta-box"><div class="meta-label">技术指标</div><div class="meta-value">${esc(project.techIndicators)}</div></div>` : ''}
          ${project.expectedOutcome ? `<div class="meta-box"><div class="meta-label">预期产出</div><div class="meta-value">${esc(project.expectedOutcome)}</div></div>` : ''}
        </article>
      </div></section>
      ${renderObjectives(project.coreObjectives)}
      ${renderRecruitment(project)}
      ${renderSpecialSections(project)}
      ${renderSubProjects(project)}
    </div>`;
  }

  function renderSubProjectDetail(projectId, subId) {
    const sub = findSubProject(projectId, subId);
    if (!sub) return renderNotFound('专项未找到', '该专项可能已被移除或不存在。');
    const parent = sub.parent;
    return `<div class="fade-in">
      <section class="section-tight"><div class="container">
        <div class="breadcrumb"><a href="#/">首页</a><span>/</span><a href="#/projects">项目列表</a><span>/</span><a href="#/projects/${esc(parent.id)}">${esc(parent.name)}</a><span>/</span><span>${esc(sub.name)}</span></div>
        <article class="card detail-hero">
          <div class="detail-title-row">
            <div>
              <div class="pill-row" style="margin-bottom:14px;"><span class="badge primary">专项子项目</span>${statusBadge(sub.progress || parent.progress)}</div>
              <h1 style="font-size:clamp(30px,4vw,50px);">${esc(sub.name)}</h1>
              <p class="lead" style="margin-top:16px;">${esc(sub.description)}</p>
            </div>
            <div class="pill-row" style="flex-shrink:0;">${btn(APPLY_LINK_DEFAULT, '报名申请', 'primary')}</div>
          </div>
          <div class="detail-meta-grid">
            ${metaBox('项目周期', sub.period)}
            ${metaBox('负责人', sub.leader)}
            ${metaBox('项目成员', sub.members)}
            ${metaBox('合作方', sub.partner)}
          </div>
          ${sub.techIndicators ? `<div class="meta-box"><div class="meta-label">技术指标</div><div class="meta-value">${esc(sub.techIndicators)}</div></div>` : ''}
          ${sub.expectedOutcome ? `<div class="meta-box"><div class="meta-label">预期产出</div><div class="meta-value">${esc(sub.expectedOutcome)}</div></div>` : ''}
        </article>
      </div></section>
      ${renderObjectives(sub.coreObjectives)}
      ${sub.recruitment ? renderRecruitment(sub) : ''}
    </div>`;
  }

  function renderNotFound(title = '页面未找到', desc = '你访问的页面不存在。') {
    return `<section class="section"><div class="container"><div class="empty-state card"><h1>${esc(title)}</h1><p class="muted" style="margin:14px 0 24px;">${esc(desc)}</p>${btn('#/', '返回首页', 'primary')}</div></div></section>`;
  }

  function parseRoute() {
    const raw = (window.location.hash || '#/').replace(/^#\/?/, '').replace(/^\//, '');
    const parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
    if (!parts.length) return { name: 'home' };
    return { name: 'home' };
  }

  function updateNav(routeName) {
    const navKey = routeName === 'home' ? 'home' : 'projects';
    document.querySelectorAll('[data-nav]').forEach(item => {
      item.classList.toggle('active', item.dataset.nav === navKey);
    });
  }

  function initProjectFilters() {
    const input = document.getElementById('project-search');
    const filters = document.getElementById('domain-filters');
    if (!input || !filters) return;
    let activeDomain = 'all';
    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      document.querySelectorAll('[data-project-card]').forEach(card => {
        const matchDomain = activeDomain === 'all' || card.dataset.domain === activeDomain;
        const matchText = !q || (card.dataset.search || '').includes(q);
        const show = matchDomain && matchText;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      const noResults = document.getElementById('no-results');
      if (noResults) noResults.classList.toggle('show', visible === 0);
    };
    input.addEventListener('input', apply);
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-domain-filter]');
      if (!button) return;
      activeDomain = button.dataset.domainFilter;
      filters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      apply();
    });
  }

  function render() {
    const route = parseRoute();
    let html = '';
    if (route.name === 'home') html = renderHome();
    else if (route.name === 'projects') html = renderProjectsPage();
    else if (route.name === 'project') html = renderProjectDetail(route.projectId);
    else if (route.name === 'subproject') html = renderSubProjectDetail(route.projectId, route.subId);
    else html = renderNotFound();
    app.innerHTML = html;
    updateNav(route.name);
    initProjectFilters();
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    document.querySelector('.mobile-nav')?.classList.remove('open');
    document.querySelector('.mobile-menu-button')?.setAttribute('aria-expanded', 'false');
  }

  document.querySelector('.mobile-menu-button')?.addEventListener('click', function () {
    const nav = document.querySelector('.mobile-nav');
    const open = nav.classList.toggle('open');
    this.setAttribute('aria-expanded', String(open));
    this.textContent = open ? '×' : '☰';
  });

  window.addEventListener('hashchange', render);
  render();
})();
