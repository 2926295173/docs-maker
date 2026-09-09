import React from 'react';

type PlatformKey = 'chaoxing' | 'yuketang' | 'zhijiaoyun' | 'icve' | 'zhihuishu' | 'mooc';

interface Platform {
    name: string;
    icon: string;
    url: string;
    suffix?: string;
}

const PLATFORMS: Record<PlatformKey, Platform> = {
    chaoxing: { name: '超星学习通', icon: '/img/platforms/chaoxing.png', url: 'https://i.chaoxing.com' },
    yuketang: { name: '雨课堂', icon: '/img/platforms/yuketang.png', url: 'https://www.yuketang.cn', suffix: '（更新中）' },
    zhijiaoyun: { name: '职教云', icon: '/img/platforms/zhijiaoyun.png', url: 'https://zjy2.icve.com.cn' },
    icve: { name: '智慧职教', icon: '/img/platforms/icve.png', url: 'https://www.icve.com.cn' },
    zhihuishu: { name: '智慧树', icon: '/img/platforms/zhihuishu.png', url: 'https://www.zhihuishu.com' },
    mooc: { name: '中国大学MOOC', icon: '/img/platforms/mooc.png', url: 'https://www.icourse163.org' }
};

/** 文本后的外链小图标（图标由 custom.css 中 .platform-link 的 mask 渲染） */
const ExtLink: React.FC<{ href: string; title?: string }> = ({ href, title }) => (
    <a className="platform-link" href={href} target="_blank" rel="noopener noreferrer" title={title || '打开平台官网'} />
);

const PlatformItem: React.FC<{ platform: Platform; unsupported?: boolean }> = ({ platform, unsupported }) => (
    <div className={`platform-item${unsupported ? ' platform-unsupported' : ''}`}>
        <img className="platform-icon" src={platform.icon} alt="" />
        {platform.name}
        <ExtLink href={platform.url} />
        {platform.suffix}
    </div>
);

const PlatformList: React.FC<{ keys: PlatformKey[]; unsupported?: boolean }> = ({ keys, unsupported }) => (
    <div className="platform-list">
        {keys.map((k) => (
            <PlatformItem key={k} platform={PLATFORMS[k]} unsupported={unsupported} />
        ))}
    </div>
);

export type TutorialType = 'app' | 'script' | 'mobile';

/** 桌面端卡片 */
const AppCard: React.FC = () => (
    <div className="tutorial-card">
        <h3>🖥️ 桌面端 <span className="tutorial-card-tag">✨ 推荐</span></h3>
        <div className="tutorial-card-body">
            <p><strong>类型：</strong>电脑软件，适合零基础小白 以及 想要多账号/浏览功能的用户</p>
            <p><strong>功能：</strong>一键安装、一键启动、多账号、软件辅助、浏览器多开/分身、网课账号管理、自动登录等功能</p>
            <p className="card-compare"><strong>对比：</strong>自2025年后浏览器安装脚本比较繁琐，桌面端一键安装即可使用，并且可绕过智慧树、中国大学MOOC的脚本检测</p>
            <p className="platform-title"><strong>适用学习平台：</strong></p>
            <PlatformList keys={['chaoxing', 'yuketang', 'zhijiaoyun', 'icve', 'zhihuishu', 'mooc']} />
        </div>
        <a className="tutorial-card-link" href="/docs/app">📖 详细教程</a>
    </div>
);

/** 网页版卡片 */
const ScriptCard: React.FC = () => (
    <div className="tutorial-card">
        <h3>🌐 网页版</h3>
        <div className="tutorial-card-body">
            <p>
                <strong>类型：</strong>网页版网课脚本，适合电脑自用浏览器安装了脚本管理器（如：脚本猫
                <ExtLink href="https://scriptcat.org" title="打开 脚本猫 官网" />
                、篡改猴
                <ExtLink href="https://www.tampermonkey.net" title="打开 篡改猴 官网" />
                ）的用户
            </p>
            <p><strong>功能：</strong>自动刷课、自动答题、自动签到、自动播放视频、自动翻页、自动翻阅 PPT 等功能</p>
            <p className="card-compare"><strong>对比：</strong>如果仅用超星、职教云等简单网课，或者个人使用可以选择网页版更加轻量化。</p>
            <p className="platform-title"><strong>适用学习平台：</strong></p>
            <PlatformList keys={['chaoxing', 'yuketang', 'zhijiaoyun', 'icve']} />
            <p className="platform-title"><strong>不支持：</strong></p>
            <p className="platform-note">以下平台请使用🖥️桌面版</p>
            <PlatformList keys={['zhihuishu', 'mooc']} unsupported />
        </div>
        <a className="tutorial-card-link" href="/docs/script">📖 详细教程</a>
    </div>
);

/** 手机&平板卡片（平台与网页版一致） */
const MobileCard: React.FC = () => (
    <div className="tutorial-card">
        <h3>📱 手机&平板</h3>
        <div className="tutorial-card-body">
            <p><strong>类型：</strong>移动端网课脚本，适合手机、iPad 平板等移动设备，在移动端浏览器中安装脚本使用</p>
            <p><strong>功能：</strong>自动刷课、自动答题、自动签到、自动播放视频、自动翻页、自动翻阅 PPT 等功能</p>
            <p className="platform-title"><strong>适用学习平台：</strong></p>
            <PlatformList keys={['chaoxing', 'yuketang', 'zhijiaoyun', 'icve']} />
            <p className="platform-title"><strong>不支持：</strong></p>
            <p className="platform-note">以下平台请使用🖥️桌面端</p>
            <PlatformList keys={['zhihuishu', 'mooc']} unsupported />
        </div>
        <a className="tutorial-card-link" href="/docs/mobile">📖 详细教程</a>
    </div>
);

/** 单个教程卡片 */
export const TutorialCard: React.FC<{ type: TutorialType }> = ({ type }) => {
    if (type === 'app') return <AppCard />;
    if (type === 'script') return <ScriptCard />;
    return <MobileCard />;
};

/** 教程卡片（两列网格） */
const TutorialCards: React.FC = () => (
    <div className="tutorial-cards">
        <AppCard />
        <ScriptCard />
        <MobileCard />
    </div>
);

export default TutorialCards;
