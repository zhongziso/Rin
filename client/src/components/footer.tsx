import { useContext, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { ClientConfigContext } from '../state/config';
import { Helmet } from "react-helmet";
import { siteName } from '../utils/constants';
import { useTranslation } from "react-i18next";
import { fetchCountAndUpdateUI } from '../utils/count';

type ThemeMode = 'light' | 'dark' | 'system';
function Footer() {
    const { t } = useTranslation()
    const [modeState, setModeState] = useState<ThemeMode>('system');
    const config = useContext(ClientConfigContext);
    const [cdnFlag, setCdnFlag] = useState(false);
    const [flagRequested, setFlagRequested] = useState(false);
    useEffect(() => {
        const mode = localStorage.getItem('theme') as ThemeMode || 'system';
        setModeState(mode);
        setMode(mode);
        if (!flagRequested) {
            setFlagRequested(true)
            fetch('/cdnflag')
                .then(response => response.text())
                .then(data => {
                    if (data === '1') {
                        setCdnFlag(true);
                    }
                })
                .catch(error => console.error('Error fetching CDN flag:', error))
                .finally();
        }
        fetchCountAndUpdateUI()
    }, [])

    const setMode = (mode: ThemeMode) => {
        setModeState(mode);
        localStorage.setItem('theme', mode);


        if (mode !== 'system' || (!('theme' in localStorage) && window.matchMedia(`(prefers-color-scheme: ${mode})`).matches)) {
            document.documentElement.setAttribute('data-color-mode', mode);
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            if (mediaQuery.matches) {
                document.documentElement.setAttribute('data-color-mode', 'dark');
            } else {
                document.documentElement.setAttribute('data-color-mode', 'light');
            }
        }
        window.dispatchEvent(new Event("colorSchemeChange"));
    };

    return (
        <footer>
            <br/><br/>
            <Helmet>
                <link rel="alternate" type="application/rss+xml" title={siteName} href="/sub/rss.xml" />
                <link rel="alternate" type="application/atom+xml" title={siteName} href="/sub/atom.xml" />
                <link rel="alternate" type="application/json" title={siteName} href="/sub/rss.json" />
            </Helmet>
            <div className="flex flex-col mb-8 space-y-2 justify-center items-center h-16 t-primary ani-show">
                <div className="w-fit-content inline-flex rounded-full border border-zinc-200 p-[3px] dark:border-zinc-700">
                    <ThemeButton mode='light' current={modeState} label="Toggle light mode" icon="ri-sun-line" onClick={setMode} />
                    <ThemeButton mode='system' current={modeState} label="Toggle system mode" icon="ri-computer-line" onClick={setMode} />
                    <ThemeButton mode='dark' current={modeState} label="Toggle dark mode" icon="ri-moon-line" onClick={setMode} />
                </div>
                <p className='text-sm text-neutral-500 font-normal text-center'>
                    {t('count.site_pv')} <span id="site_pv"></span> | {t('count.site_uv')} <span id="site_uv"></span>
                </p>
                <p className='text-sm text-neutral-500 font-normal link-line text-center'>
                    <span>
                        © 2024 <a className='hover:underline' href="https://blog.luntan888.com" target="_blank">Chisato22</a>
                    </span>
                    {config.getOrDefault('rss', false) && <>
                        <Spliter />
                        <Popup trigger={
                            <button className="hover:underline" type="button">
                                RSS
                            </button>
                        }
                            position="top center"
                            arrow={false}
                            closeOnDocumentClick>
                            <div className="border-card">
                                <p className='font-bold t-primary'>
                                    {t('footer.rss')}
                                </p>
                                <p>
                                    <a href='/sub/rss.xml'>
                                        RSS
                                    </a> <Spliter />
                                    <a href='/sub/atom.xml'>
                                        Atom
                                    </a> <Spliter />
                                    <a href='/sub/rss.json'>
                                        JSON
                                    </a>
                                </p>
                                    
                            </div>
                        </Popup>
                    </>}
                    <br/>
                    <a className='hover:underline' href="https://blog.luntan888.com" target="_blank"><span className="icon-MOE"/>萌ICP备20240729号</a> | <a className='hover:underline' href="https://travel.moe/go.html?travel=on" title="异次元之旅-跃迁-我们一起去萌站成员的星球旅行吧！" target="_blank">异次元之旅</a>
                    <br/>Powered by <a className='hover:underline' href="https://blog.luntan888.com" target="_blank">Rin</a> & <a className='hover:underline' href="https://www.cloudflare.com" target="_blank">Cloudflare</a>
                    {cdnFlag && <><br/><a className='hover:underline' href="https://blog.luntan888.com" target="_blank">DogeCloud</a> {t('cdn_from_china')}</>}
                </p>
            </div>
            <br/><br/><br/>
        </footer>
    );
}

function Spliter() {
    return (<span className='px-1'>
        |
    </span>
    )
}

function ThemeButton({ current, mode, label, icon, onClick }: { current: ThemeMode, label: string, mode: ThemeMode, icon: string, onClick: (mode: ThemeMode) => void }) {
    return (<button aria-label={label} type="button" onClick={() => onClick(mode)}
        className={`rounded-inherit inline-flex h-[32px] w-[32px] items-center justify-center border-0 t-primary ${current === mode ? "bg-w rounded-full shadow-xl shadow-light" : ""}`}>
        <i className={`${icon}`} />
    </button>)
}

export default Footer;
