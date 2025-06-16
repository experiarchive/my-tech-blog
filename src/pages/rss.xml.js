import rss from '@astrojs/rss';
import { client } from '../../sanity/client';

export async function GET(context) {
  // Sanity에서 모든 포스트 가져오기
  const query = `*[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    _createdAt,
    excerpt
  }`;
  
  const posts = await client.fetch(query);

  return rss({
    title: 'Lintrahub',
    description: '기술과 건강에 관한 유용한 정보를 공유하는 블로그입니다.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedAt || post._createdAt),
      description: post.excerpt || '',
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>ko-kr</language>`,
  });
} 