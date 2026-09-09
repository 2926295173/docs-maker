import React from 'react';
import { Redirect } from '@docusaurus/router';

/**
 * /docs/quickly-start 已合并到首页教程区域
 * 通过 SPA 路由重定向到首页锚点，由 hashScroll 客户端模块负责滚动
 */
const RedirectToTutorial: React.FC = () => {
    return <Redirect to="/#tutorial" />;
};

export default RedirectToTutorial;
