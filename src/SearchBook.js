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
        let BookFound = {
            id: -1,
            shelf: ''
        }

        const allSelectedBooks = this.selectedBooks['currentlyReading']
            .concat(this.selectedBooks['wantToRead'])
            .concat(this.selectedBooks['read'])

      const bookIndex = allSelectedBooks.findIndex(item => item.id === book.bookReference.id)
      bookFounded.id = bookIndex
      
      if (bookIndex >= 0) {
          bookFounded.shelf = allSelectedBooks[bookIndex].shelf
      }
      return bookFounded
    }

    onChangeShelf = (targetShelfName, book) => {
        let bookFounded = this.findBookInShelf(book)
        if (targetShelfName != 'none') {
            let tempShelfBooks = this.selectedBooks[targetShelfName]
            if (bookFounded.id >= 0) {
                if (bookFounded.shelf !== targetShelfName) {
                    tempShelfBooks.push(Object.assign({}, book.bookReference, { 
                        shelf: targetShelfName 
                    }))
                    let tempOldBookShelf = this.selectedBooks[bookFounded.shelf]
                    const oldIndexBook = tempOldBookShelf.findIndex(item => item.id === book.bookReference.id)
                    tempOldBookShelf.splice(oldIndexBook, 1)
                    this.selectedBooks[bookFounded.shelf] = tempOldBookShelf
                }
            } else {
                tempShelfBooks.push(Object.assign({}, bookReference, {
                    shelf: targetShelfName
                }))
            }
            thi.selectedBooks[targetShelfName] = tempShelfBooks
        } else {
            if (bookFounded.id >= 0) {
                let tempOldBookShelf = this.selectedBooks[bookFounded.shelf]
                const oldIndexBook = tempOldBookShelf.findIndex(item => item.id === book.bookReference.id)
                tempOldBookShelf.splice(oldIndexBook, 1)
                this.selectedBooks[bookFounded.shelf] = tempOldBookShelf
            }
        }
    }

    onChangeRoute = () => {
        this.props.onAddBookShelf(this.selectedBooks)
    }

    render() {
        return (
            <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/* 
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
                  
                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>
                
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        )
    }
}
export default SearchBook