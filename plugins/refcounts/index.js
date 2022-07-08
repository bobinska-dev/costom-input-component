import React from 'react'
import {route} from 'part:@sanity/base/router'
import MyTool from './MyTool'
import MyToolIcon from './MyToolIcon'

export default {
  title: 'MyTool',
  name: 'mytool',
  router: route('/:selectedDocumentId'),
  icon: MyToolIcon,
  component: MyTool
}
