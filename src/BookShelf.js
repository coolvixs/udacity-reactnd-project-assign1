import React, { Component } from 'react'

class BookShelf extends Component {
    render() {
        return (
            <div className="book-shelf-changer">
                <select value={this.props.bookReference.shelf} onChange={(event) => this.props.onChangeShelf(event.target.value, this.props)}>
                <option value="none" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
                </select>
            </div>
        )
    }
}

export default BookShelf