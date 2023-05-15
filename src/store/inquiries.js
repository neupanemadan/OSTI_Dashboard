import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const inquiriesStore = defineStore('inquiries', {
  state: () => ({
    inquiries: []
  }),
  actions: {

    fetchInquiries(filters = {}) {
      return axios
        .get("/inquiries", {
          params: filters
        })
        .then(({ data }) => {
          this.inquiries = data.inquiries;
        });
    },

    deleteInquiry(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/inquiries/${id}`)
        .then(({ data }) => {
          const deletedInquiry = data.inquiry;
          const index = this.inquiries.findIndex(
            inquiry => inquiry.id === deletedInquiry.id
          );
          this.inquiries.pop(index, 1, deletedInquiry);


          resolve(deletedInquiry)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
