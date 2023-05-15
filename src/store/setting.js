import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const settingeStore = defineStore('settings', {
  state: () => ({
    settings: []
  }),
  actions: {
     createSetting(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/setting', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.settings.push(data.setting)

            resolve(data.setting)
          })
        .catch((error) => reject(error))
      })
    },

    fetchSetting(filters = {}) {
      return axios
        .get("/setting", {
          params: filters
        })
        .then(({ data }) => {
          this.settings = data.setting;
        });
    },

    updateSetting(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/setting/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedSetting = data.setting;
          const index = this.settings.findIndex(
            setting => setting.id === updatedSetting.id
          );
          this.settings.splice(index, 1, updatedSetting);

          resolve(updatedSetting)
        })
          .catch((error) => reject(error));
     })
    },

    deleteSetting(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/setting/${id}`)
        .then(({ data }) => {
          const deletedSetting = data.setting;
          const index = this.settings.findIndex(
            setting => setting.id === deletedSetting.id
          );
          this.settings.pop(index, 1, deletedSetting);


          resolve(deletedSetting)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
