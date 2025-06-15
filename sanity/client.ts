import { createClient } from '@sanity/client';

export const client = createClient({
  // .env 파일에 저장해 둔 환경 변수를 사용합니다.
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  useCdn: false, // 개발 중에는 false
  apiVersion: '2024-05-01', // 데이터를 가져올 Sanity API 버전
});

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