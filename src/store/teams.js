import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const teamStore = defineStore('teams', {
  state: () => ({
    teams: []
  }),
  actions: {
     createTeam(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/teams', data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
          .then(({ data }) => {
            this.teams.push(data.team)

            resolve(data.team)
          })
        .catch((error) => reject(error))
      })
    },

    fetchTeams(filters = {}) {
      return axios
        .get("/teams", {
          params: filters
        })
        .then(({ data }) => {
          this.teams = data.teams;
        });
    },

    updateTeam(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/teams/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
          })
        .then(({ data }) => {
          const updatedTeam = data.team;
          const index = this.teams.findIndex(
            team => team.id === updatedTeam.id
          );
          this.teams.splice(index, 1, updatedTeam);

          resolve(updatedTeam)
        })
          .catch((error) => reject(error));
     })
    },

    deleteTeam(id) {
      return new Promise((resolve, reject) => {
        axios
        .delete(`/teams/${id}`)
        .then(({ data }) => {
          const deletedTeam = data.team;
          const index = this.teams.findIndex(
            team => team.id === deletedTeam.id
          );
          this.teams.pop(index, 1, deletedTeam);


          resolve(deletedTeam)
        })
          .catch((error) => reject(error));
     })
    },
  }
})
