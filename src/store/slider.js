import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const sliderStore = defineStore('sliders', {
  state: () => ({
    sliders: []
  }),
  actions: {
     createSlider(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/sliders', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.sliders.push(data.slider)

            resolve(data.slider)
          })
        .catch((error) => reject(error))
      })
    },

    fetchSliders(filters = {}) {
      return axios
        .get("/sliders", {
          params: filters
        })
        .then(({ data }) => {
          this.sliders = data.sliders;
        });
    },

    updateSlider(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/sliders/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedSlider = data.slider;
          const index = this.sliders.findIndex(
            slider => slider.id === updatedSlider.id
          );
          this.sliders.splice(index, 1, updatedSlider);

          resolve(updatedSlider)
        })
          .catch((error) => reject(error));
     })
    },

    deleteSlider(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/sliders/${id}`)
        .then(({ data }) => {
          const deletedSlider = data.slider;
          const index = this.sliders.findIndex(
            slider => slider.id === deletedSlider.id
          );
          this.sliders.pop(index, 1, deletedSlider);


          resolve(deletedSlider)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
