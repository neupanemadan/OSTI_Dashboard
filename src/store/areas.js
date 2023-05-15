import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const areaStore = defineStore('areas', {
  state: () => ({
    areas: []
  }),
  actions: {
     createArea(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/areas', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.areas.push(data.area)

            resolve(data.area)
          })
        .catch((error) => reject(error))
      })
    },

    fetchAreas(filters = {}) {
      return axios
        .get("/areas", {
          params: filters
        })
        .then(({ data }) => {
          this.areas = data.areas;
        });
    },

    updateArea(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/areas/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedArea = data.area;
          const index = this.areas.findIndex(
            area => area.id === updatedArea.id
          );
          this.areas.splice(index, 1, updatedArea);

          resolve(updatedArea)
        })
          .catch((error) => reject(error));
     })
    },

    deleteArea(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/areas/${id}`)
        .then(({ data }) => {
          const deletedArea = data.area;
          const index = this.areas.findIndex(
            area => area.id === deletedArea.id
          );
          this.areas.pop(index, 1, deletedArea);


          resolve(deletedArea)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
