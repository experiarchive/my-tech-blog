// 링크 메타데이터 캐시
const metadataCache = new Map<string, any>();

export async function fetchLinkMetadata(url: string) {
  // 캐시에서 먼저 확인
  if (metadataCache.has(url)) {
    return metadataCache.get(url);
  }

  try {
    // CORS 프록시를 사용하여 메타데이터 가져오기
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error('No content received');
    }

    const html = data.contents;
    
    // 정규식을 사용하여 메타 태그 추출
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/) || 
                      html.match(/<title[^>]*>([^<]*)<\/title>/);
    
    const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/) ||
                           html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
    
    const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/) ||
                      html.match(/<meta\s+name="twitter:image"\s+content="([^"]*)"/);

    const siteNameMatch = html.match(/<meta\s+property="og:site_name"\s+content="([^"]*)"/);

    const hostname = new URL(url).hostname.replace('www.', '').replace('link.', '');
    
    const metadata = {
      title: titleMatch ? titleMatch[1].trim() : '',
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      image: imageMatch ? imageMatch[1].trim() : '',
      siteName: siteNameMatch ? siteNameMatch[1] : 
                hostname.includes('coupang') ? 'COUPANG' :
                hostname.includes('amazon') ? 'AMAZON' :
                hostname.toUpperCase(),
      url: url
    };

    // 캐시에 저장 (5분간 유효)
    metadataCache.set(url, metadata);
    setTimeout(() => metadataCache.delete(url), 5 * 60 * 1000);

    return metadata;
  } catch (error) {
    console.warn(`Failed to fetch metadata for ${url}:`, error);
    
    // 실패 시 기본 메타데이터 반환
    const hostname = new URL(url).hostname.replace('www.', '').replace('link.', '');
    const fallback = {
      title: '',
      description: '',
      image: '',
      siteName: hostname.includes('coupang') ? 'COUPANG' :
                hostname.includes('amazon') ? 'AMAZON' :
                hostname.toUpperCase(),
      url: url
    };
    
    metadataCache.set(url, fallback);
    return fallback;
  }
}