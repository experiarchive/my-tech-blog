import { createClient } from '@sanity/client';

export const client = createClient({
  // .env 파일에 저장해 둔 환경 변수를 사용합니다.
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  useCdn: false, // 개발 중에는 false
  apiVersion: '2024-05-01', // 데이터를 가져올 Sanity API 버전
});

// 쿠키 없는 정적 이미지 URL 생성 함수
export function getImageUrl(asset: any, options: { width?: number; height?: number; quality?: number; format?: string } = {}) {
  if (!asset || !asset._ref) return '';
  
  try {
    // asset._ref 형식: image-[id]-[width]x[height]-[format]
    const [, id, dimensions, format] = asset._ref.split('-');
    
    const params = new URLSearchParams();
    
    // 너비 설정 (기본값: 800)
    if (options.width) {
      params.set('w', options.width.toString());
    }
    
    // 높이 설정
    if (options.height) {
      params.set('h', options.height.toString());
    }
    
    // 품질 설정 (기본값: 80)
    params.set('q', (options.quality || 80).toString());
    
    // 포맷 자동 최적화
    params.set('auto', 'format');
    
    // 반응형 크기 조정
    params.set('fit', 'max');
    
    const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
    const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
    
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?${params.toString()}`;
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '';
  }
}

// 반응형 이미지 srcset 생성
export function getResponsiveImageData(asset: any, sizes: string = '(max-width: 640px) 400px, (max-width: 1024px) 600px, 800px') {
  if (!asset) return { src: '', srcset: '', sizes: '' };
  
  const breakpoints = [400, 600, 800, 1200];
  
  const srcset = breakpoints
    .map(width => `${getImageUrl(asset, { width })} ${width}w`)
    .join(', ');
  
  return {
    src: getImageUrl(asset, { width: 800 }),
    srcset,
    sizes,
  };
}

export function formatDate(dateString: string) {
  if (!dateString) return 'Date not available';
  
  const date = new Date(dateString);
  
  // 유효하지 않은 날짜 체크
  if (isNaN(date.getTime())) {
    return 'Date not available';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
} 