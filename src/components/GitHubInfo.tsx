import React, { useEffect, useState } from 'react';
import './GitHubInfo.css';

const REPO = 'ocsjs/ocsjs';
const REPO_URL = `https://github.com/${REPO}`;

interface RepoStats {
    stars: number | null;
    forks: number | null;
    openIssues: number | null;
    pullRequests: number | null;
}

interface Contributor {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

interface ActivityItem {
    number: number;
    title: string;
    html_url: string;
    state: 'open' | 'closed';
    created_at: string;
    merged_at?: string | null;
}

const formatNumber = (num: number | null): string => {
    if (num === null) return '-';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return String(num);
};

const GitHubInfo: React.FC = () => {
    const [stats, setStats] = useState<RepoStats>({
        stars: null,
        forks: null,
        openIssues: null,
        pullRequests: null
    });
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [issues, setIssues] = useState<ActivityItem[]>([]);
    const [prs, setPrs] = useState<ActivityItem[]>([]);

    useEffect(() => {
        // 仓库基础数据（stars / forks / open issues）
        fetch(`https://api.github.com/repos/${REPO}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => {
                setStats((prev) => ({
                    ...prev,
                    stars: data.stargazers_count,
                    forks: data.forks_count,
                    openIssues: data.open_issues_count
                }));
            })
            .catch(() => { /* 接口失败时保持占位符 */ });

        // PR 总数（open + closed）
        fetch(`https://api.github.com/search/issues?q=repo:${REPO}+type:pr&per_page=1`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => {
                setStats((prev) => ({ ...prev, pullRequests: data.total_count }));
            })
            .catch(() => { /* 接口失败时保持占位符 */ });

        // 维护者/贡献者（取前 12 位）
        fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=12`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data: Contributor[]) => {
                if (Array.isArray(data)) setContributors(data);
            })
            .catch(() => { /* 接口失败时保持空列表 */ });

        // 近期 issues（issues 接口会混入 PR，需过滤，取前 5 条）
        fetch(`https://api.github.com/repos/${REPO}/issues?state=all&sort=created&direction=desc&per_page=10`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data: (ActivityItem & { pull_request?: unknown })[]) => {
                if (Array.isArray(data)) {
                    setIssues(data.filter((item) => !item.pull_request).slice(0, 5));
                }
            })
            .catch(() => { /* 接口失败时保持空列表 */ });

        // 近期 PR（取前 5 条）
        fetch(`https://api.github.com/repos/${REPO}/pulls?state=all&sort=created&direction=desc&per_page=5`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data: ActivityItem[]) => {
                if (Array.isArray(data)) setPrs(data.slice(0, 5));
            })
            .catch(() => { /* 接口失败时保持空列表 */ });
    }, []);

    const statCards = [
        { icon: '⭐', label: 'Stars', value: stats.stars, href: `${REPO_URL}/stargazers` },
        { icon: '🍴', label: 'Forks', value: stats.forks, href: `${REPO_URL}/forks` },
        { icon: '🐛', label: 'Issues', value: stats.openIssues, href: `${REPO_URL}/issues` },
        { icon: '🔀', label: 'Pull Requests', value: stats.pullRequests, href: `${REPO_URL}/pulls` }
    ];

    const renderActivityList = (items: ActivityItem[], emptyText: string, isPr: boolean) => {
        if (items.length === 0) {
            return <p className="github-activity-empty">{emptyText}</p>;
        }
        return (
            <ul className="github-activity-list">
                {items.map((item) => {
                    const merged = isPr && !!item.merged_at;
                    const stateLabel = merged ? 'Merged' : item.state === 'open' ? 'Open' : 'Closed';
                    const stateClass = merged
                        ? 'github-activity-state-merged'
                        : item.state === 'open'
                            ? 'github-activity-state-open'
                            : 'github-activity-state-closed';
                    return (
                        <li key={item.number}>
                            <a
                                className="github-activity-item"
                                href={item.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={item.title}
                            >
                                <span className={`github-activity-state ${stateClass}`}>{stateLabel}</span>
                                <span className="github-activity-item-title">{item.title}</span>
                                <span className="github-activity-meta">
                                    #{item.number} · {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="github-info">
            {/* 数据统计卡片 */}
            <div className="github-stats-grid">
                {statCards.map((card) => (
                    <a
                        key={card.label}
                        className="github-stat-card"
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="github-stat-icon">{card.icon}</div>
                        <div className="github-stat-value">{formatNumber(card.value)}</div>
                        <div className="github-stat-label">{card.label}</div>
                    </a>
                ))}
            </div>

            <div className="github-detail-grid">
                {/* Star 趋势图 */}
                <div className="github-panel">
                    <h3 className="github-panel-title">⭐ Star 趋势</h3>
                    <a href={`https://star-history.com/#${REPO}&Date`} target="_blank" rel="noopener noreferrer">
                        <img
                            className="github-star-chart"
                            src={`https://api.star-history.com/svg?repos=${REPO}&type=Date`}
                            alt="ocsjs star 趋势图"
                            loading="lazy"
                        />
                    </a>
                </div>

                {/* 维护者/贡献者 */}
                <div className="github-panel">
                    <h3 className="github-panel-title">👥 维护者 & 贡献者</h3>
                    {contributors.length > 0 ? (
                        <div className="github-contributors">
                            {contributors.map((c) => (
                                <a
                                    key={c.login}
                                    className="github-contributor"
                                    href={c.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`${c.login}（${c.contributions} 次提交）`}
                                >
                                    <img className="github-contributor-avatar" src={c.avatar_url} alt={c.login} loading="lazy" />
                                    <span className="github-contributor-name">{c.login}</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="github-contributors-empty">贡献者列表加载失败，请前往 GitHub 查看。</p>
                    )}
                    <a className="github-repo-link" href={REPO_URL} target="_blank" rel="noopener noreferrer">
                        前往 GitHub 仓库 →
                    </a>
                </div>
            </div>

            {/* 近期 issues 与 PR（独立卡片） */}
            <div className="github-activity-grid">
                <div className="github-panel">
                    <h3 className="github-panel-title">🐛 近期 Issues</h3>
                    {renderActivityList(issues, '近期 Issues 加载失败，请前往 GitHub 查看。', false)}
                </div>
                <div className="github-panel">
                    <h3 className="github-panel-title">🔀 近期 Pull Requests</h3>
                    {renderActivityList(prs, '近期 PR 加载失败，请前往 GitHub 查看。', true)}
                </div>
            </div>
        </div>
    );
};

export default GitHubInfo;
