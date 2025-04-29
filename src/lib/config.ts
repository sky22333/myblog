import siteConfig from '@/content/config/site.json';
import type { IconType } from 'react-icons';
import { FaGithub, FaYoutube } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa6';
import { MdMail } from 'react-icons/md';
import { SiBilibili } from 'react-icons/si';
import { RiWeiboFill } from 'react-icons/ri';

// 社交媒体平台与对应图标的映射
export const socialIcons: Record<string, IconType> = {
  github: FaGithub,
  youtube: FaYoutube,
  bilibili: SiBilibili,
  telegram: FaTelegram,
  email: MdMail,
  weibo: RiWeiboFill
};

export function getSiteConfig() {
  return {
    ...siteConfig,
    // 处理友链页面联系信息中的邮箱占位符
    friendsPageSettings: {
      ...siteConfig.friendsPageSettings,
      contactText: siteConfig.friendsPageSettings.contactText.replace(
        '{email}',
        siteConfig.friendsPageSettings.contactEmail
      )
    },
    // 获取社交媒体配置，包含图标组件
    getSocialMedia() {
      const { socials = {} } = siteConfig;
      return Object.entries(socials)
        .filter(([_, url]) => url && typeof url === 'string' && url.trim() !== '')
        .map(([platform, url]) => ({
          platform,
          url,
          icon: socialIcons[platform] || null
        }));
    }
  };
} 