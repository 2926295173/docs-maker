/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }]

  // But you can create a sidebar manually

  tutorialSidebar: [
    {
      type: 'doc',
      label: '使用教程',
      id: 'quickly-start'
    },
    {
      type: 'doc',
      label: '关于OCS',
      id: 'about'
    },
    {
      type: 'doc',
      label: '功能列表',
      id: 'feat-list'
    },
    {
      type: 'category',
      label: '全部教程',
      items: ['script', 'app', 'work', 'update'],
      collapsed: false
    },
    {
      type: 'category',
      label: '油猴教程',
      items: ['油猴教程/setup'],
      collapsed: false
    },
    {
      type: 'category',
      label: '资源下载',
      items: ['资源下载/app-downloads', '资源下载/script-downloads'],
      collapsed: false
    },
    {
      type: 'category',
      label: '更多',
      items: ['更多/api', '更多/FQA'],
      collapsed: false
    }
  ]

};

module.exports = sidebars;
