/**
 * 客户端路由跳转（route push）后的锚点自动滚动
 * - Docusaurus 默认不会在客户端导航时滚动到 #hash 位置
 * - hash 可能是 URL 编码（如中文锚点 %E8%81%94...），需要解码后匹配元素 id
 */
export function onRouteDidUpdate({ location }: { location: Location }) {
    const hash = location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));

    // 等待页面渲染完成后滚动，重试几次以应对异步内容
    let attempts = 0;
    const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (attempts++ < 10) {
            setTimeout(tryScroll, 100);
        }
    };
    setTimeout(tryScroll, 50);
}
