import { http as axios } from '@/axios.js'
import { defineStore } from 'pinia'

export const documentStore = defineStore('documents', {
  state: () => ({
    customers: [],
    documents: [],
    documentCount: null,
    departments: [],
    documentCategories: [],
    users: []
  }),
  actions: {
    createDocument(formData) {
      return axios.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    },
    createCustomer(data) {
      return new Promise((resolve, reject) => {
        return axios.post('/customers', data)
          .then(({ data }) => {
            this.customers.push({
              label: data.customer.name,
              value: data.customer.id
            })

            resolve(data.customer)
          })
        .catch((error) => reject(error))
      })
    },
    getDocuments(filters = {}) {
      return axios
        .get("/documents", {
          params: filters
        })
        .then(({ data }) => {
          this.documents = data.documents;
          this.documentCount = data.count;
        });
    },
    getDepartments() {
      return axios.get("/departments").then(({ data }) => {
        this.departments = data.departments.map(department => {
          return {
            label: department.name,
            value: department.id
          };
        });
      });
    },
    getDocumentCategories() {
      return axios.get("/document_categories").then(({ data }) => {
        this.documentCategories = data.categories.map(category => {
          return {
            label: category.name,
            value: category.id
          };
        });
      });
    },
    getUsers() {
      return axios.get("/users").then(({ data }) => {
        this.users = data.users.map(user => {
          return {
            label: user.full_name,
            value: user.id,
            department_id: user.department_id
          };
        });
      });
    },
    getCustomers() {
      return axios.get("/customers").then(({ data }) => {
        this.customers = data.customers.map(customer => {
          return {
            label: customer.name,
            value: customer.id
          };
        });
      });
    },
    updateDocument(id, data) {
      return new Promise((resolve, reject) => {
        axios
        .put(`/documents/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(({ data }) => {
          const updatedDocument = data.document;
          const index = this.documents.findIndex(
            document => document.id === updatedDocument.id
          );
          this.documents.splice(index, 1, updatedDocument);

          resolve(updatedDocument)
        })
          .catch((error) => reject(error));
     })
    }
  }
})
