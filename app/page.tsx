import type { ReactNode } from "react";

const navGroups = [
  {
    title: "开始",
    items: [
      ["文档说明", "overview"],
      ["系统全景", "architecture"],
      ["部署前准备", "prerequisites"],
    ],
  },
  {
    title: "搭建",
    items: [
      ["部署步骤", "deployment"],
      ["镜像如何生成", "image-build"],
      ["容器如何启动", "startup"],
    ],
  },
  {
    title: "工作流程",
    items: [
      ["文档入库", "ingestion"],
      ["RAG 问答", "rag"],
      ["TDengine Agent", "tdengine"],
    ],
  },
  {
    title: "完成",
    items: [
      ["数据与持久化", "persistence"],
      ["部署验收", "acceptance"],
    ],
  },
] as const;

const topLinks = [
  ["系统全景", "architecture"],
  ["部署步骤", "deployment"],
  ["三条工作流", "ingestion"],
  ["验收清单", "acceptance"],
] as const;

function CodeBlock({ children, label = "Terminal" }: { children: string; label?: string }) {
  return (
    <div className="code-block">
      <div className="code-bar">
        <span className="traffic-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>{label}</span>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function ChapterHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="chapter-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="deploy-step">
      <div className="step-number">{number}</div>
      <div className="step-body">
        <h3>{title}</h3>
        {children}
      </div>
    </article>
  );
}

function FlowNode({
  index,
  title,
  detail,
}: {
  index: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="flow-node">
      <span>{index}</span>
      <div><strong>{title}</strong><small>{detail}</small></div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="返回文档开头">
          <span className="brand-mark">SC</span>
          <span><b>尚宸知识库</b><small>部署文档</small></span>
        </a>
        <nav aria-label="顶部导航">
          {topLinks.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <span className="version-badge">AnythingLLM 1.15.0</span>
      </header>

      <aside className="sidebar" aria-label="章节导航">
        <div className="sidebar-intro">
          <p>部署与原理</p>
          <span>从空白主机到可用知识库</span>
        </div>
        {navGroups.map((group) => (
          <section key={group.title}>
            <h2>{group.title}</h2>
            {group.items.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </section>
        ))}
        <div className="sidebar-note">
          <b>阅读建议</b>
          <p>第一次接手，请按目录从上到下阅读；实际部署时可直接从“部署步骤”开始。</p>
        </div>
      </aside>

      <main>
        <section className="hero" id="overview">
          <div className="hero-kicker"><span /> DEPLOYMENT GUIDE · 2026-08-03</div>
          <h1>尚宸智能体知识库<br /><em>部署与工作原理</em></h1>
          <p className="hero-lead">
            这是一份面向接手人的部署指南：讲清楚系统由什么组成、如何在新环境中搭起来，
            以及文档入库、RAG 问答和 TDengine SQL Agent 三条核心链路如何协作。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#deployment">开始部署 <span>→</span></a>
            <a className="text-button" href="#architecture">先理解架构</a>
          </div>
          <div className="scope-strip">
            <div><b>部署形态</b><span>Docker Compose · 单容器</span></div>
            <div><b>应用基线</b><span>AnythingLLM 1.15.0</span></div>
            <div><b>定制能力</b><span>TDengine SQL Agent</span></div>
          </div>
        </section>

        <section className="content-section intro-section">
          <div className="summary-card">
            <span className="summary-icon">i</span>
            <div>
              <h2>先记住一句话</h2>
              <p>
                当前仓库不是 AnythingLLM 的完整源码，而是一套<strong>无密钥、无业务数据的生产部署基线</strong>：
                它以固定版本的官方镜像为底座，在构建阶段注入 TDengine 连接器，再通过 Docker Compose 运行。
              </p>
            </div>
          </div>
          <div className="boundary-grid">
            <article><span>01</span><h3>主应用</h3><p>AnythingLLM 提供页面、API、用户、工作区、RAG 与 Agent。</p></article>
            <article><span>02</span><h3>本地数据</h3><p>SQLite、LanceDB 和解析后的文档都保存在宿主机 storage。</p></article>
            <article><span>03</span><h3>外部能力</h3><p>DeepSeek、Embedding 服务和 TDengine 均通过网络调用。</p></article>
            <article><span>04</span><h3>定制层</h3><p>仓库只维护部署配置、版本锁定和 TDengine 扩展代码。</p></article>
          </div>
        </section>

        <section className="content-section" id="architecture">
          <ChapterHeading eyebrow="01 · Architecture" title="系统全景">
            用户只面对 AnythingLLM，但一次完整的知识库请求会在主服务、采集器、本地数据和外部模型之间流转。
          </ChapterHeading>

          <div className="architecture-board" role="img" aria-label="尚宸知识库逻辑架构图">
            <div className="arch-user"><span>USER</span><strong>用户浏览器</strong><small>Web UI · API · WebSocket</small></div>
            <div className="down-connector"><span>HTTP 3001</span><i>↓</i></div>
            <div className="arch-core">
              <span>CORE APPLICATION</span>
              <strong>AnythingLLM 主服务</strong>
              <small>认证 · 工作区 · 文档管理 · RAG · Agent</small>
            </div>
            <div className="branch-label">主服务向内管理数据，向外调用能力</div>
            <div className="arch-grid">
              <div className="arch-card local"><span>INTERNAL · 8888</span><b>Collector</b><small>解析 / OCR / 转写</small></div>
              <div className="arch-card data"><span>LOCAL STORAGE</span><b>SQLite + LanceDB</b><small>元数据 / 向量</small></div>
              <div className="arch-card cloud"><span>HTTPS · 443</span><b>模型服务</b><small>DeepSeek / Embedding</small></div>
              <div className="arch-card external"><span>REST · 6041</span><b>TDengine</b><small>外部时序业务数据</small></div>
            </div>
          </div>

          <div className="prose-grid">
            <div>
              <h3>部署拓扑</h3>
              <p>Compose 只启动一个 <code>anythingllm</code> 服务。容器内同时运行 Server 与 Collector 两个 Node.js 进程；3001 对宿主机开放，8888 只供容器内部通信。</p>
            </div>
            <div>
              <h3>关键边界</h3>
              <p>TDengine 不是 AnythingLLM 的主数据库，也不是向量库。它只在 Agent 需要查询业务时序数据时参与，不影响普通 RAG 的启动和检索。</p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>组件</th><th>职责</th><th>位置 / 连接</th><th>不可替代的数据</th></tr></thead>
              <tbody>
                <tr><td><b>AnythingLLM Server</b></td><td>Web、API、认证、RAG、Agent</td><td>容器内 3001</td><td>—</td></tr>
                <tr><td><b>Collector</b></td><td>文件解析、OCR、转写、网页抓取</td><td>容器内 8888</td><td>解析结果写入 storage</td></tr>
                <tr><td><b>SQLite</b></td><td>用户、工作区、聊天、设置、数据关系</td><td><code>storage/anythingllm.db</code></td><td>业务元数据</td></tr>
                <tr><td><b>LanceDB</b></td><td>保存文档切片向量并执行相似度检索</td><td><code>storage/lancedb/</code></td><td>知识库向量</td></tr>
                <tr><td><b>TDengine</b></td><td>供 SQL Agent 查询外部时序数据</td><td>外部 REST 端口</td><td>业务时序数据</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="content-section" id="prerequisites">
          <ChapterHeading eyebrow="02 · Preparation" title="部署前准备">
            在执行命令前，先确认主机、网络、密钥和持久化边界。这里不满足，容器即使启动也无法完成问答。
          </ChapterHeading>
          <div className="check-grid">
            <div className="check-card">
              <span className="check-mark">✓</span><div><h3>主机与运行环境</h3><p>Linux 主机、Docker Engine、Docker Compose v2；宿主机端口 3001 可用。</p></div>
            </div>
            <div className="check-card">
              <span className="check-mark">✓</span><div><h3>镜像来源</h3><p>可访问基础镜像仓库，或已准备并校验离线镜像包。</p></div>
            </div>
            <div className="check-card">
              <span className="check-mark">✓</span><div><h3>外部服务</h3><p>容器可以访问 DeepSeek、Embedding API；启用 SQL Agent 时还要访问 TDengine REST。</p></div>
            </div>
            <div className="check-card">
              <span className="check-mark">✓</span><div><h3>受控密钥</h3><p>准备 LLM、Embedding API Key，以及独立生成的 JWT、SIG_KEY、SIG_SALT。</p></div>
            </div>
          </div>
          <aside className="callout warning">
            <b>生产入口原则</b>
            <p>3001 应只允许反向代理或管理网段访问，并由外围网关提供 HTTPS；Collector 的 8888 不应映射到宿主机。</p>
          </aside>
        </section>

        <section className="content-section deployment-section" id="deployment">
          <ChapterHeading eyebrow="03 · Installation" title="从空白主机开始部署">
            以下流程创建一个全新的空实例，不恢复旧用户、聊天或知识库数据。命令中的地址、模型名与密钥均需替换为实际受控值。
          </ChapterHeading>

          <div className="steps">
            <Step number="01" title="获取部署基线并固定版本">
              <p>克隆内部部署仓库，并切换到当前生产基线标签。固定标签能让 Dockerfile、Compose 和 TDengine 扩展保持在同一版本。</p>
              <CodeBlock>{`git clone <internal-repository-url>\ncd sc-knowledge-base-deployment\ngit fetch --tags\ngit checkout v1.15.0-sc.1`}</CodeBlock>
            </Step>

            <Step number="02" title="创建持久化目录与配置文件">
              <p><code>storage/</code> 是整个系统的持久化边界。配置、业务元数据、文档与向量最终都汇聚在这里。</p>
              <CodeBlock>{`umask 077\nmkdir -p storage\ncp storage.env.example storage/.env\nchmod 700 storage\nchmod 600 storage/.env`}</CodeBlock>
              <div className="mini-note"><b>新环境</b><span>生成全新的 JWT_SECRET、SIG_KEY、SIG_SALT。</span></div>
              <div className="mini-note"><b>恢复环境</b><span>必须沿用原密钥；更换后可能无法解密已有数据。</span></div>
            </Step>

            <Step number="03" title="填写外部服务与安全配置">
              <p>LLM 与 Embedding 是两条独立链路。模型 ID 必须以供应商当前实际返回的可用列表为准，不要照抄未验证的示例模型名。</p>
              <CodeBlock label="storage/.env">{`LLM_PROVIDER=deepseek\nDEEPSEEK_API_KEY=<secret>\nDEEPSEEK_MODEL_PREF=<validated-chat-model-id>\n\nEMBEDDING_ENGINE=generic-openai\nEMBEDDING_BASE_PATH=<openai-compatible-endpoint>\nEMBEDDING_MODEL_PREF=<validated-embedding-model-id>\nGENERIC_OPEN_AI_EMBEDDING_API_KEY=<secret>\n\nVECTOR_DB=lancedb\nSTORAGE_DIR=/app/server/storage\nJWT_SECRET=<random-hex>\nSIG_KEY=<random-hex>\nSIG_SALT=<random-hex>\nAUTH_TOKEN=<strong-admin-password>\nDISABLE_TELEMETRY=true`}</CodeBlock>
            </Step>

            <Step number="04" title="确认目录权限">
              <p>基础镜像默认使用非 root 用户。先确认镜像内 UID/GID，再让该用户拥有 <code>storage/</code> 的读写权限；当前基线通常为 1000:1000。</p>
              <CodeBlock>{`# 仅在确认容器用户 UID/GID 后执行\nsudo chown -R 1000:1000 storage\nsudo chmod 700 storage\nsudo chmod 600 storage/.env`}</CodeBlock>
            </Step>

            <Step number="05" title="展开配置并构建定制镜像">
              <p>先让 Compose 展开最终配置，再从固定官方镜像构建 TDengine 定制层。构建日志应明确提示后端与前端入口均已补丁成功。</p>
              <CodeBlock>{`docker compose config\ndocker compose build --no-cache\n\ndocker image inspect anythingllm-tdengine:1.15.0 \\\n  --format '{{.Id}}'`}</CodeBlock>
              <aside className="inline-callout"><b>为什么要构建？</b><span>标准 AnythingLLM 镜像不认识 TDengine。构建过程会把连接器、图标和注册入口注入镜像。</span></aside>
            </Step>

            <Step number="06" title="启动并完成首次初始化">
              <p>容器启动后，先检查状态与健康接口，再通过受控网络打开页面完成 onboarding。</p>
              <CodeBlock>{`docker compose up -d\ndocker compose ps\ndocker logs --tail 200 anythingllm\ncurl -fsS http://127.0.0.1:3001/api/ping`}</CodeBlock>
              <ol className="compact-list">
                <li>完成管理员登录保护；</li>
                <li>确认 LLM、Embedding 和 LanceDB 配置；</li>
                <li>创建测试 workspace，上传一份非敏感文档；</li>
                <li>用 Query 模式提问并确认回答带有来源；</li>
                <li>最后再用只读账号配置 TDengine SQL Agent。</li>
              </ol>
            </Step>
          </div>
        </section>

        <section className="content-section split-section" id="image-build">
          <ChapterHeading eyebrow="04 · Build Principle" title="镜像如何生成">
            当前方案不是重新编译整套 AnythingLLM，而是在固定官方镜像上增加一层可审计的 TDengine 定制。
          </ChapterHeading>
          <div className="pipeline horizontal-pipeline">
            <FlowNode index="1" title="固定官方镜像" detail="AnythingLLM 1.15.0 · digest 锁定" />
            <span className="flow-arrow">→</span>
            <FlowNode index="2" title="复制扩展" detail="TDengine.js · 图标 · 补丁脚本" />
            <span className="flow-arrow">→</span>
            <FlowNode index="3" title="注入注册入口" detail="后端 Connector + 前端数据源入口" />
            <span className="flow-arrow">→</span>
            <FlowNode index="4" title="生成定制镜像" detail="anythingllm-tdengine:1.15.0" />
          </div>
          <div className="explain-cards">
            <article><h3>为什么使用 digest</h3><p>tag 可能被重新指向，digest 对应确定的镜像内容。这样同一部署基线不会在未来悄悄换成别的上游版本。</p></article>
            <article><h3>为什么补丁会主动失败</h3><p>脚本要求每个目标字符串只出现一次。上游结构变化时会停止构建，避免生成“只补了一半”的镜像。</p></article>
            <article><h3>为什么最终切回非 root</h3><p>构建阶段需要写入镜像文件；运行阶段回到 <code>anythingllm</code> 用户，减少应用进程权限。</p></article>
          </div>
        </section>

        <section className="content-section" id="startup">
          <ChapterHeading eyebrow="05 · Runtime" title="容器如何启动">
            一个容器里有两个并行进程。主服务管理用户与问答，Collector 专门处理文档；任一进程退出，容器整体退出并由 Compose 重启。
          </ChapterHeading>
          <div className="startup-rail">
            <div className="startup-entry"><span>ENTRYPOINT</span><b>容器启动</b></div>
            <div className="rail-arrow">↓</div>
            <div className="startup-branches">
              <article>
                <span>PROCESS A · SERVER</span>
                <h3>主服务</h3>
                <ol><li>生成 Prisma Client</li><li>执行未应用的 SQLite migration</li><li>启动 Express 与静态前端</li><li>监听 3001</li></ol>
              </article>
              <article>
                <span>PROCESS B · COLLECTOR</span>
                <h3>文档采集器</h3>
                <ol><li>清理上传临时目录</li><li>注册解析、OCR、转写接口</li><li>校验 Server 签名请求</li><li>监听内部 8888</li></ol>
              </article>
            </div>
            <div className="rail-arrow">↓</div>
            <div className="startup-result"><b>wait -n</b><span>任一子进程退出 → 容器退出 → <code>unless-stopped</code> 策略重启</span></div>
          </div>
          <aside className="callout info">
            <b>健康检查的含义</b>
            <p><code>GET /api/ping</code> 返回 200 只证明主服务可响应；它不证明 Collector、Embedding、DeepSeek、LanceDB 或 TDengine 都正常。</p>
          </aside>
        </section>

        <section className="content-section workflow-section" id="ingestion">
          <ChapterHeading eyebrow="06 · Workflow A" title="文档上传、解析与入库">
            上传文件只是开始。真正成为可检索知识，需要经过解析、持久化、切片、向量化和关系登记。
          </ChapterHeading>
          <div className="workflow-card">
            <div className="workflow-title"><span>A</span><div><b>Ingestion Pipeline</b><small>原始文件 → 可检索知识</small></div></div>
            <div className="workflow-flow">
              <FlowNode index="01" title="用户上传" detail="Server 保存到 hotdir" />
              <FlowNode index="02" title="签名转交" detail="内部 POST /process" />
              <FlowNode index="03" title="内容解析" detail="文本 / OCR / 转写" />
              <FlowNode index="04" title="写入文档 JSON" detail="storage/documents" />
              <FlowNode index="05" title="切片与向量化" detail="调用 Embedding API" />
              <FlowNode index="06" title="建立知识关系" detail="LanceDB + SQLite" />
            </div>
          </div>
          <div className="detail-list">
            <article><span>解析</span><p>Collector 按文件类型提取正文；扫描 PDF 在没有数字文本时尝试 OCR，音视频通过转写服务生成文本。</p></article>
            <article><span>持久化</span><p>解析后的标准 JSON 保存在 <code>storage/documents</code>。hotdir 只是临时目录，容器重启会清理。</p></article>
            <article><span>向量化</span><p>Server 读取 <code>pageContent</code>，按系统设置切片，调用兼容 OpenAI 的 Embedding API，再写入 LanceDB。</p></article>
            <article><span>登记</span><p>SQLite 同时记录文档与 workspace 的关系、文档 ID 与向量 ID 的映射，保证后续引用和删除可追踪。</p></article>
          </div>
        </section>

        <section className="content-section workflow-section" id="rag">
          <ChapterHeading eyebrow="07 · Workflow B" title="RAG 问答如何产生答案">
            RAG 不会把整个知识库塞给模型，而是先把问题转成向量，找到最相近的切片，再把少量相关上下文交给大模型。
          </ChapterHeading>
          <div className="workflow-card dark-card">
            <div className="workflow-title"><span>B</span><div><b>Retrieval-Augmented Generation</b><small>问题 → 检索 → 上下文 → 回答</small></div></div>
            <div className="rag-line">
              <div><span>1</span><b>用户问题</b><small>连同 workspace 配置与历史</small></div>
              <i>→</i>
              <div><span>2</span><b>查询向量</b><small>Embedding API</small></div>
              <i>→</i>
              <div><span>3</span><b>相似度检索</b><small>LanceDB · topN</small></div>
              <i>→</i>
              <div><span>4</span><b>组装上下文</b><small>来源 + Prompt + 历史</small></div>
              <i>→</i>
              <div><span>5</span><b>流式回答</b><small>DeepSeek + 引用</small></div>
            </div>
          </div>
          <div className="two-col-notes">
            <article><h3>默认检索参数</h3><ul><li><code>topN = 4</code></li><li><code>similarityThreshold = 0.25</code></li><li>默认 cosine similarity</li><li>可选 rerank 模式</li></ul></article>
            <article><h3>Query 与 Chat 的区别</h3><p><b>Query</b> 在没有相关知识上下文时拒绝回答，更适合知识库问答；<b>Chat</b> 允许模型结合一般知识作答，覆盖面更广，但边界更松。</p></article>
          </div>
        </section>

        <section className="content-section workflow-section" id="tdengine">
          <ChapterHeading eyebrow="08 · Workflow C" title="TDengine SQL Agent 如何工作">
            这条链路独立于 RAG。Agent 把自然语言意图转为工具调用，通过定制 Connector 查询外部 TDengine，再把结果交还模型组织答案。
          </ChapterHeading>
          <div className="td-flow">
            <div><span>USER</span><b>@agent 自然语言问题</b></div><i>→</i>
            <div><span>TOOLS</span><b>列库 / 列表 / Schema</b></div><i>→</i>
            <div><span>SQL</span><b>模型生成 SELECT</b></div><i>→</i>
            <div><span>REST</span><b>TDengine 6041</b></div><i>→</i>
            <div><span>ANSWER</span><b>结果映射并回答</b></div>
          </div>
          <div className="td-details">
            <div>
              <h3>启用路径</h3>
              <ol className="compact-list"><li>管理员启用 <code>sql-agent</code> 技能；</li><li>新增 TDengine 连接并通过验证；</li><li>用户以 <code>@agent</code> 或自动模式触发工具调用。</li></ol>
            </div>
            <div>
              <h3>连接原理</h3>
              <p>Connector 不使用 native client，而是向 <code>/rest/sql/&lt;database&gt;</code> 发送 HTTP POST。连接串中的 6030 只用于推导默认 REST 端口 6041。</p>
            </div>
          </div>
          <aside className="callout danger">
            <b>必须使用数据库侧只读账号</b>
            <p>当前代码不会在执行前强制拦截写入 SQL；工具说明虽要求 SELECT，Connector 仍会把完整 SQL 原样发送给 TDengine。生产必须靠最小权限账号、网络控制和数据库审计兜底。</p>
          </aside>
        </section>

        <section className="content-section" id="persistence">
          <ChapterHeading eyebrow="09 · Data" title="数据与持久化边界">
            镜像可以重建，<code>storage/</code> 不能凭空恢复。对这套系统来说，storage 才是生产数据本体。
          </ChapterHeading>
          <div className="storage-layout">
            <div className="folder-tree">
              <div className="folder-root"><span>▾</span><b>storage/</b><small>一致性备份单元</small></div>
              <ul>
                <li><b>.env</b><span>配置、API Key、JWT 与加密密钥</span></li>
                <li><b>anythingllm.db</b><span>用户、工作区、聊天、设置、数据关系</span></li>
                <li><b>documents/</b><span>解析后的原始正文 JSON</span></li>
                <li><b>lancedb/</b><span>知识库切片向量</span></li>
                <li><b>vector-cache/</b><span>可复用的 Embedding 结果</span></li>
                <li><b>assets/ · comkey/ · models/</b><span>上传资产、通信密钥与本地模型资源</span></li>
              </ul>
            </div>
            <div className="consistency-card">
              <span>ONE DOCUMENT · THREE STATES</span>
              <h3>一篇已入库文档跨越三类状态</h3>
              <ol><li><b>documents JSON</b><small>可审计、可重新切片的解析正文</small></li><li><b>SQLite 关系</b><small>文档、workspace 与向量 ID 的映射</small></li><li><b>LanceDB 向量</b><small>实际用于相似度检索的数据</small></li></ol>
              <p>只复制其中一部分，会留下孤儿记录、缺失引用或无法重建的问题。因此迁移和恢复应把整个 storage 作为同一个一致性单元。</p>
            </div>
          </div>
        </section>

        <section className="content-section final-section" id="acceptance">
          <ChapterHeading eyebrow="10 · Verification" title="部署验收清单">
            验收目标不是“容器在运行”，而是验证用户能够完成一条真实、可引用、可追踪的知识库问答。
          </ChapterHeading>
          <div className="acceptance-list">
            <label><input type="checkbox" /><span><b>01 · 服务可达</b><small>Compose 显示容器运行，<code>/api/ping</code> 返回成功。</small></span></label>
            <label><input type="checkbox" /><span><b>02 · 登录受控</b><small>onboarding 已完成，管理员入口有强密码或组织级认证保护。</small></span></label>
            <label><input type="checkbox" /><span><b>03 · 模型链路</b><small>DeepSeek 模型可用，Embedding API 能返回与配置一致的向量。</small></span></label>
            <label><input type="checkbox" /><span><b>04 · 文档入库</b><small>测试文档成功解析，documents、SQLite 与 LanceDB 均产生对应状态。</small></span></label>
            <label><input type="checkbox" /><span><b>05 · RAG 回答</b><small>Query 模式能命中测试内容，答案含正确引用来源。</small></span></label>
            <label><input type="checkbox" /><span><b>06 · SQL Agent</b><small>如启用 TDengine，可列出 supertable、读取 Schema，并用只读账号完成有限 SELECT。</small></span></label>
          </div>
          <div className="finish-banner">
            <div><span>READY</span><h3>完成这六项，才算部署完成</h3></div>
            <p>此后再接入反向代理、HTTPS、备份与监控；这些属于生产外围能力，不改变本文描述的核心搭建和工作流程。</p>
          </div>
        </section>

        <footer>
          <div><b>尚宸智能体知识库</b><span>部署与工作原理 · 2026-08-03</span></div>
          <p>内容重构自生产部署交接材料；排版参考 <a href="https://auto-lirpa.readthedocs.io/en/latest/?badge=latest" target="_blank" rel="noreferrer">auto_LiRPA documentation</a> 的文档导航方式。</p>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <span>本页目录</span>
        {topLinks.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        <div className="rail-divider" />
        <span>当前基线</span>
        <p>v1.15.0-sc.1<br />单容器部署<br />本地 LanceDB</p>
      </aside>
    </div>
  );
}
