
import * as React from 'react'
import { PureComponent } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Entry } from 'contentful'
import { BLOCKS, Document } from '@contentful/rich-text-types'

import { ContentContext } from '../contexts/content'
import { rich } from '../helpers/formatters'

import { Big, Huge, Spacer, A } from '../components/text'
import { Flex, Quarter, Full, Third, third, half } from '../components/layout'
import { Products } from './collection'
import { Helm } from '../components/helm'


interface Props extends RouteComponentProps<any> {}
interface State {}


export class Page extends PureComponent<Props, State> {
  static contextType = ContentContext
  context!: React.ContextType<typeof ContentContext>


  public render() {
    let page = this.context.content.pages.items.find(page => page.fields.identifier === this.props.match.params.id)
    return <>
      <Helm title={page.fields.title} description={page.fields.excerpt} />
      
      {rich(page.fields.body, {
        [BLOCKS.EMBEDDED_ENTRY]: node => {
          return {
            collection: (target: any)=> <>
              <Products products={target.fields.products} />
            </>,
            bookshelf: (target: any)=> <div><A to={`/${target.sys.contentType.sys.id}s/${target.fields.identifier}`}><Huge>{target.fields.title}</Huge></A></div>,
            playlist: (target: any)=> <article>
              <h4><A to={target.fields.embedCode} external><Big>{target.fields.title}</Big></A></h4>
              <p>{target.fields.excerpt}</p>
              <iframe src={target.fields.embedCode} width='100%' height='366' frameBorder='0' allow='encrypted-media' />
            </article>,
            columns: (target: any)=> <>
              <Spacer />
              <h6>{target.fields.title}</h6>
              <Flex>
                {target.fields.columns.map((column: Entry<{
                  body: Document
                  size: string
                }>)=> ({
                  'One-third': <Third phone={half} key={column.sys.id}>
                    {rich(column.fields.body)}
                  </Third>,
                  'One-quarter': <Quarter phone={half} key={column.sys.id}>
                    {rich(column.fields.body)}
                  </Quarter>
                }[column.fields.size as 'One-quarter']))}
              </Flex>
              <Spacer />
            </>
          }[node.data.target.sys.contentType.sys.id as 'bookshelf'](node.data.target)
        }
      })}
    </>
  }
}