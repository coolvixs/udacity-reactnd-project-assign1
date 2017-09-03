import React, { Component } from 'react'

import Book from './Book'
import * as BooksAPI from './BooksAPI'

class SearchBook extends Component {
    constructor(props) {
        super(props)
        this.state = { resultsBooks: [] }
    }

    selectedBooks = {
        currentlyReading: [],
        wantToRead: [],
        read: []
    }

    componentDidMount() {
        this.inputSearch.focus();
    }

    onChangeSearchQuery = event => {
        const query = event.target.value.trim()
        const allExistingBooks = this.props.existingBooks['currentlyReading'].shelfBooks
          .concat(this.props.existingBooks['wantToRead'].shelfBooks)
          .concat(this.props.existingBooks['read'].shelfBooks)

        if (query) {
            BooksAPI.search(query, 20).then(response => {
                if (response && response.length > 0) {
                    this.setState({
                        resultsBooks: response.map(item => {
                            const bookIndex = allExistingBooks.findIndex(bookItem => bookItem.id === item.id)
                            if (bookIndex >= 0) {
                                return Object.assign({}, item, { shelf: allExistingBooks[bookIndex].shelf })
                            } else {
                                return item
                            }
                        })
                    })
                } else {
                    this.setState({ resultsBooks: []})
                }
            })
        } else {
            this.setState({ resultsBooks: [] })
        }
    }

    findBookInShelf = book => {
        let bookFound = {
            id: -1,
            shelf: ''
        }

        const allSelectedBooks = this.selectedBooks['currentlyReading']
            .concat(this.selectedBooks['wantToRead'])
            .concat(this.selectedBooks['read'])

      const bookIndex = allSelectedBooks.findIndex(item => item.id === book.bookReference.id)
      bookFound.id = bookIndex
      
      if (bookIndex >= 0) {
          bookFound.shelf = allSelectedBooks[bookIndex].shelf
      }
      return bookFound
    }

    onChangeShelf = (targetShelfName, book) => {
        let bookFound = this.findBookInShelf(book)
        if (targetShelfName !== 'none') {
            let tempShelfBooks = this.selectedBooks[targetShelfName]
            if (bookFound.id >= 0) {
                if (bookFound.shelf !== targetShelfName) {
                    tempShelfBooks.push(Object.assign({}, book.bookReference, { 
                        shelf: targetShelfName 
                    }))
                    let tempOldBookShelf = this.selectedBooks[bookFound.shelf]
                    const oldIndexBook = tempOldBookShelf.findIndex(item => item.id === book.bookReference.id)
                    tempOldBookShelf.splice(oldIndexBook, 1)
                    this.selectedBooks[bookFound.shelf] = tempOldBookShelf
                }
            } else {
                tempShelfBooks.push(Object.assign({}, book.bookReference, {
                    shelf: targetShelfName
                }))
            }
            this.selectedBooks[targetShelfName] = tempShelfBooks
        } else {
            if (bookFound.id >= 0) {
                let tempOldBookShelf = this.selectedBooks[bookFound.shelf]
                const oldIndexBook = tempOldBookShelf.findIndex(item => item.id === book.bookReference.id)
                tempOldBookShelf.splice(oldIndexBook, 1)
                this.selectedBooks[bookFound.shelf] = tempOldBookShelf
            }
        }
    }

    onChangeRoute = () => {
        this.props.onAddBookShelfs(this.selectedBooks)
    }

    render() {
        return (
            <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" style={{ cursor: 'pointer' }} onClick={this.onChangeRoute}>Close</a>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author" value={this.state.value} onKeyUp={event => this.onChangeSearchQuery(event)} ref={(input) => {this.inputSearch = input; }} />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                  {this.state.resultsBooks.map((singleBook, index) => (
                      <Book key={index} {...singleBook} onChangeShelf={this.onChangeShelf} />
                  ))}
              </ol>
            </div>
          </div>
        )
    }
}
export default SearchBook