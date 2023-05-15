import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const noticeStore = defineStore('notices', {
  state: () => ({
    notices: []
  }),
  actions: {
     createNotice(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/notices', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.notices.push(data.notice)

            resolve(data.notice)
          })
        .catch((error) => reject(error))
      })
    },

    fetchNotices(filters = {}) {
      return axios
        .get("/notices", {
          params: filters
        })
        .then(({ data }) => {
          this.notices = data.notices;
        });
    },

    updateNotice(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/notices/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedNotice = data.notice;
          const index = this.notices.findIndex(
            notice => notice.id === updatedNotice.id
          );
          this.notices.splice(index, 1, updatedNotice);

          resolve(updatedNotice)
        })
          .catch((error) => reject(error));
     })
    },

    deleteNotice(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/notices/${id}`)
        .then(({ data }) => {
          const deletedNotice = data.notice;
          const index = this.notices.findIndex(
            notice => notice.id === deletedNotice.id
          );
          this.notices.pop(index, 1, deletedNotice);


          resolve(deletedNotice)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
