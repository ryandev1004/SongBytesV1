import { db } from '@/utilities/firebaseConfig'
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'

const songCollection = collection(db, 'songs')

export default {
  async requestSong(songData, userId) {
    const dataToSave = {
      ...songData,
      createdBy: userId,
      ownedBy: userId,
      auctionEndTime: songData.offMarket
        ? null
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
    const docRef = await addDoc(songCollection, dataToSave)
    return { id: docRef.id, ...dataToSave }
  },

  async getSongs() {
    const snapshot = await getDocs(songCollection)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getSongById(id) {
    const docRef = doc(db, 'songs', id) // reference of the document in firebase
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() }
    } else {
      throw new Error('Song not found')
    }
  },

  async getUserLibrary(userId) {
    const songsQuery = query(songCollection, where('ownedBy', '==', userId))
    const snapshot = await getDocs(songsQuery)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getUserCreatedSongs(userId) {
    const songsQuery = query(songCollection, where('createdBy', '==', userId))
    const snapshot = await getDocs(songsQuery)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getOnMarketSongs() {
    const songsQuery = query(songCollection, where('offMarket', '==', false))
    const snapshot = await getDocs(songsQuery)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getOnMarketSongs() {
    let songsQuery = songCollection

    songsQuery = query(songCollection, where('offMarket', '==', false))

    const snapshot = await getDocs(songsQuery)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getOnMarketTagCounts() {
    const songsQuery = query(songCollection, where('offMarket', '==', false))
    const snapshot = await getDocs(songsQuery)
    const tagCounts = {}
    
    snapshot.docs.forEach((doc) => {
      const songData = doc.data()
      if (Array.isArray(songData.tags)) {
        songData.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })
    
    // Convert to array of objects and sort by count descending
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  },

  async updateSong(id, songData) {
    const docRef = doc(db, 'songs', id)
    const dataToUpdate = {
      ...songData,
      auctionEndTime: songData.offMarket
        ? null
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
    await updateDoc(docRef, dataToUpdate)
    return { id, ...dataToUpdate }
  },

  async deleteSong(id) {
    const docRef = doc(db, 'songs', id)
    await deleteDoc(docRef)
  },

  async transferSongOwnership(songId, newOwnerId) {
    const docRef = doc(db, 'songs', songId)
    await updateDoc(docRef, {
      ownedBy: newOwnerId,
      offMarket: true, 
    })
  },
}
