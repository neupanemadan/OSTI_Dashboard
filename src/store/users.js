import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const userStore = defineStore('users', {
  state: () => ({
    users: [],
    userCount: null
  }),
  actions: {
     createUser(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/users', data)
          .then(({ data }) => {
            this.users.push(data.user)

            resolve(data.user)
          })
        .catch((error) => reject(error))
      })
    },

    fetchUsers(filters = {}) {
      return axios
        .get("/users", {
          params: filters
        })
        .then(({ data }) => {
          this.users = data.users;
          this.userCount = data.count;
        });
    },
    updateUser(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/users/${id}`, data)
        .then(({ data }) => {
          const updatedUser = data.user;
          const index = this.users.findIndex(
            user => user.id === updatedUser.id
          );
          this.users.splice(index, 1, updatedUser);

          resolve(updatedUser)
        })
          .catch((error) => reject(error));
     })
    }
  }
})
