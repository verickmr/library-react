import localforage from 'localforage'

export const booksDb = localforage.createInstance({
  name: 'library',
  storeName: 'books',
})

export const authorsDb = localforage.createInstance({
  name: 'library',
  storeName: 'authors',
})
