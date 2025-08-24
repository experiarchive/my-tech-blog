import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {table} from '@sanity/table'
import post from './schemas/post'
import category from './schemas/category'
import blockContent from './schemas/blockContent'
import linkPreview from './schemas/linkPreview'

export default defineConfig({
  name: 'default',
  title: 'my-tech-blog-studio',

  projectId: 'pjt88hjd',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), table()],

  schema: {
    types: [post, category, blockContent, linkPreview],
  },
})
