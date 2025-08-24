import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'linkPreview',
  title: 'Link Preview',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: Rule => Rule.required(),
      description: 'URL을 입력하세요. 메타데이터는 수동으로 입력하거나 브라우저 개발도구를 사용하여 가져올 수 있습니다.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: '링크 제목 (수동 입력)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: '링크 설명 (수동 입력)',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Preview Image URL',
      type: 'url',
      description: '프리뷰 이미지 URL (수동 입력)',
    }),
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: '사이트명 (수동 입력)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Link Preview',
        subtitle: subtitle,
        media: media,
      }
    },
  },
})