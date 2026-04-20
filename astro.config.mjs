// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkWikiLink from 'remark-wiki-link';

export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [
			[
				remarkWikiLink,
				{
					pageResolver: (name) => [name.replace(/ /g, '-').toLowerCase()],
					hrefTemplate: (permalink) => `/blog/${permalink}`,
					aliasDivider: '|',
				},
			],
		],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
