import React, { useEffect, useState } from 'react';
import { ScriptDownloadCards } from './ScriptDownloadCards';

/**
 * 快捷更新/安装弹窗
 * - 默认不显示，避免与教程内的安装区域重复
 * - 仅当 url 锚点为 #quick-install 时以弹窗形式展示
 * - 关闭方式：背景 / ✕ / ESC，关闭后清除锚点
 */
const QuickInstall: React.FC = () => {
    const [open, setOpen] = useState(false);

    // 检测锚点（含 SPA 路由跳转、浏览器前进后退）
    useEffect(() => {
        const check = () => {
            try {
                setOpen(decodeURIComponent(window.location.hash.slice(1)) === 'quick-install');
            } catch {
                setOpen(false);
            }
        };
        check();
        window.addEventListener('hashchange', check);
        window.addEventListener('popstate', check);
        window.addEventListener('ocs-route-update', check);
        return () => {
            window.removeEventListener('hashchange', check);
            window.removeEventListener('popstate', check);
            window.removeEventListener('ocs-route-update', check);
        };
    }, []);

    // ESC 关闭
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    const close = () => {
        setOpen(false);
        // 清除锚点，便于再次通过链接触发
        history.replaceState(null, '', window.location.pathname + window.location.search);
    };

    if (!open) return null;

    return (
        <div className="quick-install-modal" onClick={close}>
            <div className="quick-install-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="quick-install-header">
                    <span className="quick-install-title">📥 快捷更新/安装</span>
                    <button className="quick-install-close" aria-label="关闭" onClick={close}>✕</button>
                </div>
                <div className="quick-install-body">
                    <ScriptDownloadCards />
                </div>
            </div>
        </div>
    );
};

export default QuickInstall;
