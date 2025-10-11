import { Alert, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { BasicDialog } from './Dialog/index';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ScriptInstallAlert from '../../docs/script.install.alert.mdx'

export const download_infos = [
    {
        name: "官方来源",
        desc: '✨推荐：腾讯云托管，稳定更新快',
        icon: '/logos/ocs.png',
        type: 'file',
        url: `https://cdn.ocsjs.com/ocs.user.js`,
    },
    {
        name: "脚本猫托管",
        desc: '国人搭建脚本平台，稳定托管',
        icon: '/logos/scriptcat.png',
        type: 'link',
        url: `https://scriptcat.org/script-show-page/367`,
        history_link: 'https://scriptcat.org/script-show-page/367/history'
    },
    {
        name: "GF托管",
        desc: '⚠️国外脚本平台，目前无法访问',
        icon: '/logos/gf.png',
        type: 'link',
        url: `https://greasyfork.org/zh-CN/scripts/457151`,
        history_link: 'https://scriptcat.org/script-show-page/367/history'
    },
    {
        name: 'Github Releases',
        desc: '本项目国外代码开源原站',
        icon: <svg height="64" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="64" data-view-component="true"  >
            <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
        </svg>,
        type: 'file',
        url: "https://github.com/ocsjs/ocsjs/releases/latest/download/ocs.user.js",
        history_link: 'https://scriptcat.org/script-show-page/367/history'
    }
];



export const ScriptDownloadCards = () => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [current_install_url, setCurrentInstallUrl] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [log_open, setLogOpen] = useState(false);
    const handleLogOpen = () => setLogOpen(true);
    const handleLogClose = () => setLogOpen(false);


    const DownloadCard = ({ children, name, desc, url, type }) => {
        return (
            <div
                style={{
                    borderRadius: "12px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    width: "200px",
                }}
            >
                <a
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                        handleOpen();
                        setCurrentInstallUrl(url);
                    }}
                >
                    <div>{children} </div>
                    <div style={{ color: "black", fontWeight: 'bold' }}>{name} </div>
                    <div style={{ color: "gray", fontSize: "12px" }}>
                        <div>{desc}</div>
                    </div>
                    <div
                        style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            display: "flex",
                            marginTop: "12px",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <span style={{ marginRight: '4px' }}>{type === 'link' ? '前往' : '安装'}</span>
                        {type === 'link' ? <OpenInNewIcon /> : <FileDownloadOutlinedIcon />}
                    </div>
                </a>
            </div>
        );
    };


    useEffect(() => {
        setLoading(true);
        const fetchPosts = async () => {
            const data = await fetch('https://cdn.ocsjs.com/ocs-version.json?t=' + Date.now()).then(res => res.json()).catch((e) => {
                setError('获取最新版本信息失败，请稍后再试：' + String(e))
                console.error(e)
            }).finally(() => {
                setLoading(false);
            });
            if (data) {
                setData(data);
            }
        };
        fetchPosts();
    }, [])


    return (
        <>
            <BasicDialog
                title="安装必读"
                confirmText="我已阅读，确认安装"
                showCancelButton={true}
                open={open}
                maskCloseable={false}
                onClose={handleClose}
                closeableDelay={5}
                onConfirm={() => {
                    handleClose();
                    window.open(current_install_url, '_blank');
                }}
            >
                <ScriptInstallAlert />
            </BasicDialog>

            <BasicDialog
                title={"更新日志 - " + data?.['last-version']}
                open={log_open}
                maskCloseable={true}
                onClose={handleLogClose}
            >
                {data?.['notes'].map((note, index) => (
                    <div key={index} style={{ marginBottom: '12px' }}>
                        {note}
                    </div>
                ))}
            </BasicDialog>

            {error ? <Alert severity="error">{error}</Alert> : null}
            {loading ? <Alert severity="info">正在获取最新版本信息...</Alert> : null}
            {data ? <Alert severity="success">当前最新版本：{data['last-version']}，更新日志：<Button size={'small'} variant="text" onClick={handleLogOpen}>点击查看</Button></Alert> : null}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "24px" }}>

                {download_infos.map((info, index) => (
                    <div key={index} >
                        <div

                            style={{
                                borderRadius: "12px",
                                padding: "24px 0px ",
                                margin: "24px 0px 12px 0px",
                                boxShadow: "0 0 8px rgb(0 0 0 / 10%)",
                            }}
                            className="download-card"
                        >
                            <DownloadCard {...info} >
                                <div  >  {typeof info.icon === 'string' ? <img src={info.icon} style={{ width: "64px", height: "64px", }} /> : info.icon}</div>
                            </DownloadCard>
                        </div>


                        <div style={{
                            textAlign: 'center',
                            padding: '4px',
                            marginTop: '2px',
                            fontSize: '12px',
                            color: '#c5c5c5',
                            width: '100%',
                        }}>
                            {info.history_link ? (
                                <a href={info.history_link} >历史版本-&gt;</a>
                            ) : <span>暂无历史版本</span>}
                        </div>

                        <div />
                    </div>

                ))}
            </div>
        </>

    )
}