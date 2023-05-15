import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const aboutStore = defineStore('abouts', {
  state: () => ({
    abouts: []
  }),
  actions: {
     createAbout(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/about', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.abouts.push(data.about)

            resolve(data.about)
          })
        .catch((error) => reject(error))
      })
    },

    fetchAbout(filters = {}) {
      return axios
        .get("/about", {
          params: filters
        })
        .then(({ data }) => {
          this.abouts = data.about;
        });
    },

    updateAbout(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/about/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedAbout = data.about;
          const index = this.abouts.findIndex(
            about => about.id === updatedAbout.id
          );
          this.abouts.splice(index, 1, updatedAbout);

          resolve(updatedAbout)
        })
          .catch((error) => reject(error));
     })
    },

    deleteAbout(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/about/${id}`)
        .then(({ data }) => {
          const deletedAbout = data.about;
          const index = this.abouts.findIndex(
            about => about.id === deletedAbout.id
          );
          this.abouts.pop(index, 1, deletedAbout);


          resolve(deletedAbout)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
