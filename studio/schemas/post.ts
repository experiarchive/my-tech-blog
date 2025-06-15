// studio/schemas/post.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title', // 글 제목
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug', // 웹 주소(URL)에 사용될 고유 이름
      type: 'slug',
      options: {
        source: 'title', // 제목을 기반으로 자동 생성
        maxLength: 96,
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image', // 대표 이미지(썸네일)
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories', // 카테고리
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at', // 발행일
      type: 'datetime',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt', // 요약글
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'body',
      title: 'Body', // 본문
      type: 'blockContent',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
}) 