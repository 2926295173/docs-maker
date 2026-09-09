import React, { useEffect, useRef, useState } from 'react';

interface LazySectionProps {
    children: React.ReactNode;
    /** 未加载时的占位高度（px），避免页面跳动 */
    minHeight?: number;
    /** 提前触发加载的视口外距离，如 '200px' */
    rootMargin?: string;
}

/**
 * 懒加载容器：监听滚动，区域进入视口附近时才渲染子内容，
 * 用于延迟加载图片、第三方接口等重资源。
 */
const LazySection: React.FC<LazySectionProps> = ({ children, minHeight = 300, rootMargin = '200px' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible) return;
        const el = ref.current;
        if (!el) return;
        // 不支持 IntersectionObserver 时直接渲染
        if (!('IntersectionObserver' in window)) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [visible, rootMargin]);

    return (
        <div ref={ref} style={visible ? undefined : { minHeight }}>
            {visible ? children : null}
        </div>
    );
};

export default LazySection;
