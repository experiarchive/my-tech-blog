import React, { useState, useCallback } from 'react'
import { Stack, Button, Card, Text, Flex } from '@sanity/ui'
import { StringInputProps, set, unset } from 'sanity'

interface LinkPreviewData {
  url: string
  title?: string
  description?: string
  imageUrl?: string
  siteName?: string
}

export default function LinkPreviewInput(props: StringInputProps) {
  const { onChange, value } = props
  const [isLoading, setIsLoading] = useState(false)
  const [metadata, setMetadata] = useState<LinkPreviewData | null>(null)

  const fetchMetadata = useCallback(async (url: string) => {
    if (!url) return

    setIsLoading(true)
    try {
      // CORS 문제를 해결하기 위해 더 간단한 API 사용
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)}&callback=?`)
      const data = await response.json()
      const linkData = JSON.parse(data.contents)
      
      if (linkData.status === 'success') {
        const metaData: LinkPreviewData = {
          url,
          title: linkData.data.title || '',
          description: linkData.data.description || '',
          imageUrl: linkData.data.image?.url || '',
          siteName: linkData.data.publisher || new URL(url).hostname,
        }
        
        setMetadata(metaData)
        
        // Sanity 필드에 메타데이터 자동 입력
        onChange(set({
          url,
          title: metaData.title,
          description: metaData.description,
          imageUrl: metaData.imageUrl,
          siteName: metaData.siteName,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error)
    } finally {
      setIsLoading(false)
    }
  }, [onChange])

  const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    onChange(url ? set(url) : unset())
    
    // URL이 완전한 형태일 때만 자동으로 메타데이터 가져오기
    if (url && url.startsWith('http')) {
      fetchMetadata(url)
    }
  }, [onChange, fetchMetadata])

  return (
    <Stack space={3}>
      <input
        type="url"
        value={value || ''}
        onChange={handleUrlChange}
        placeholder="https://example.com"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
      
      {isLoading && (
        <Card padding={3} radius={2} tone="primary">
          <Text size={1}>메타데이터를 가져오는 중...</Text>
        </Card>
      )}
      
      {metadata && !isLoading && (
        <Card padding={3} radius={2} tone="positive">
          <Stack space={2}>
            <Text weight="semibold" size={1}>미리보기</Text>
            {metadata.imageUrl && (
              <img 
                src={metadata.imageUrl} 
                alt="Preview" 
                style={{ width: '100%', maxWidth: '200px', height: 'auto', borderRadius: '4px' }}
              />
            )}
            <Text weight="semibold">{metadata.title}</Text>
            {metadata.description && (
              <Text size={1} style={{ color: '#666' }}>{metadata.description}</Text>
            )}
            <Text size={0} style={{ color: '#999' }}>{metadata.siteName}</Text>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}