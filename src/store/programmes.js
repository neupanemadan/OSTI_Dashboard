import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const programmeStore = defineStore('programmes', {
  state: () => ({
    programmes: []
  }),
  actions: {
     createProgramme(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/programmes', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.programmes.push(data.programme)

            resolve(data.programme)
          })
        .catch((error) => reject(error))
      })
    },

    fetchProgrammes(filters = {}) {
      return axios
        .get("/programmes", {
          params: filters
        })
        .then(({ data }) => {
          this.programmes = data.programmes;
        });
    },

    updateProgramme(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/programmes/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedProgramme = data.programme;
          const index = this.programmes.findIndex(
            programme => programme.id === updatedProgramme.id
          );
          this.programmes.splice(index, 1, updatedProgramme);

          resolve(updatedProgramme)
        })
          .catch((error) => reject(error));
     })
    },

    deleteProgramme(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/programmes/${id}`)
        .then(({ data }) => {
          const deletedProgramme = data.programme;
          const index = this.programmes.findIndex(
            programme => programme.id === deletedProgramme.id
          );
          this.programmes.pop(index, 1, deletedProgramme);


          resolve(deletedProgramme)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
