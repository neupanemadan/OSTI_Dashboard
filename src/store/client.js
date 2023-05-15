import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const clientStore = defineStore('clients', {
  state: () => ({
    clients: []
  }),
  actions: {
     createClient(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/clients', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.clients.push(data.client)

            resolve(data.client)
          })
        .catch((error) => reject(error))
      })
    },

    fetchClients(filters = {}) {
      return axios
        .get("/clients", {
          params: filters
        })
        .then(({ data }) => {
          this.clients = data.clients;
        });
    },

    updateClient(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/clients/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedClient = data.client;
          const index = this.clients.findIndex(
            client => client.id === updatedClient.id
          );
          this.clients.splice(index, 1, updatedClient);

          resolve(updatedClient)
        })
          .catch((error) => reject(error));
     })
    },

    deleteClient(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/clients/${id}`)
        .then(({ data }) => {
          const deletedClient = data.client;
          const index = this.clients.findIndex(
            client => client.id === deletedClient.id
          );
          this.clients.pop(index, 1, deletedClient);


          resolve(deletedClient)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
