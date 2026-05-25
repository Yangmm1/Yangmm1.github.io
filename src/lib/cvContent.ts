import { getConfig } from './config';
import { getMarkdownContent } from './content';

function getContactLabels(locale?: string) {
  if (locale === 'zh') {
    return { heading: '联系方式', phone: '电话 / 微信', email: '邮箱' };
  }
  return { heading: 'Contact', phone: 'Phone / WeChat', email: 'Email' };
}

export function getCvPageContent(locale?: string): string {
  const body = getMarkdownContent('cv.md', locale);
  const { social } = getConfig(locale);
  const labels = getContactLabels(locale);
  const { email, phone_wechat: phoneWechat } = social;

  const items: string[] = [];
  if (email) {
    items.push(`- **${labels.email}:** [${email}](mailto:${email})`);
  }
  if (phoneWechat) {
    items.push(`- **${labels.phone}:** ${phoneWechat}`);
  }
  if (items.length === 0) {
    return body;
  }

  const footer = ['', `## ${labels.heading}`, '', ...items, ''].join('\n');
  return `${body.trimEnd()}${footer}`;
}
