import React, { useEffect, useState } from 'react';

export interface PreviewImage {
    src: string;
    label?: string;
}

/**
 * 浏览器窗口风格的图片预览组件
 * - 卡片带浏览器顶部栏（红黄绿按钮 + 标题）
 * - 悬浮显示 "点击放大" 提示
 * - 点击打开灯箱放大查看（背景/✕/ESC 关闭）
 */
const ImagePreview: React.FC<{ images: PreviewImage[] }> = ({ images }) => {
    const [preview, setPreview] = useState<PreviewImage | null>(null);

    // ESC 关闭预览
    useEffect(() => {
        if (!preview) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreview(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [preview]);

    return (
        <>
            <div className="img-preview-grid">
                {images.map((img) => (
                    <div className="img-preview-item" key={img.src}>
                        <div className="img-preview-bar">
                            <span className="img-preview-dot" style={{ background: '#ff5f57' }}></span>
                            <span className="img-preview-dot" style={{ background: '#febc2e' }}></span>
                            <span className="img-preview-dot" style={{ background: '#28c840' }}></span>
                            {img.label && <span className="img-preview-title">{img.label}</span>}
                        </div>
                        <div className="img-preview-image" onClick={() => setPreview(img)}>
                            <img src={img.src} alt={img.label || ''} loading="lazy" />
                            <div className="img-preview-zoom">
                                <span>🔍 点击放大</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {preview && (
                <div className="img-preview-lightbox" onClick={() => setPreview(null)}>
                    <button className="img-preview-close" aria-label="关闭">✕</button>
                    <img
                        className="img-preview-lightbox-img"
                        src={preview.src}
                        alt={preview.label || ''}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {preview.label && <div className="img-preview-caption">{preview.label}</div>}
                </div>
            )}
        </>
    );
};

export default ImagePreview;
