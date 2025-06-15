import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import post from './schemas/post'
import category from './schemas/category'
import blockContent from './schemas/blockContent'

export default defineConfig({
  name: 'default',
  title: 'my-tech-blog-studio',

  projectId: 'pjt88hjd',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [post, category, blockContent],
  },
})
