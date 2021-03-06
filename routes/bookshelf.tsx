
import * as React from 'react'
import { PureComponent } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Entry } from 'contentful'

import { ContentContext, Bookshelf as ContentBookshelf } from '../contexts/content'
import { A, Spacer } from '../components/text'
import { Helm } from '../components/helm'


interface Props extends RouteComponentProps<any> {}
interface State {
  bookshelf: Entry<ContentBookshelf>
}


export class Bookshelf extends PureComponent<Props, State> {
  static contextType = ContentContext
  context!: React.ContextType<typeof ContentContext>

  constructor(props: Props, context: React.ContextType<typeof ContentContext>) {
    super(props)
    this.state = {
      bookshelf: context.content.bookshelfs.items.find(bookshelf => bookshelf.fields.identifier === props.match.params.id)
    }
  }

  public render() {
    return <>
      <Helm title={this.state.bookshelf.fields.title} />

      <h1>{this.state.bookshelf.fields.title}</h1>
      {this.state.bookshelf.fields.books && this.state.bookshelf.fields.books.map(book => <div key={book.sys.id}>
        <A to={book.fields.externalLink} external>{book.fields.title}</A><br />
      </div>)}
      <Spacer />
      <A to={'/pages/books'} underline>← Back to books</A>
    </>
  }
}