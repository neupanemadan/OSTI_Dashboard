import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const galleryStore = defineStore('galleries', {
  state: () => ({
    galleries: []
  }),
  actions: {
     createGallery(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/galleries', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.galleries.push(data.gallery)

            resolve(data.gallery)
          })
        .catch((error) => reject(error))
      })
    },

    fetchGalleries(filters = {}) {
      return axios
        .get("/galleries", {
          params: filters
        })
        .then(({ data }) => {
          this.galleries = data.galleries;
        });
    },

    updateGallery(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/galleries/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedGallery = data.gallery;
          const index = this.galleries.findIndex(
            gallery => gallery.id === updatedGallery.id
          );
          this.galleries.splice(index, 1, updatedGallery);

          resolve(updatedGallery)
        })
          .catch((error) => reject(error));
     })
    },

    deleteGallery(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/galleries/${id}`)
        .then(({ data }) => {
          const deletedGallery = data.gallery;
          const index = this.galleries.findIndex(
            gallery => gallery.id === deletedGallery.id
          );
          this.galleries.pop(index, 1, deletedGallery);


          resolve(deletedGallery)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
