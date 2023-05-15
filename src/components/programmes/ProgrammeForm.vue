<template>
  <n-form ref="formRef" :model="programme" :rules="rules" size="large">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <n-card title="Programme Information" embedded :bordered="true">
          <n-grid :span="24" :x-gap="24">
            <n-form-item-gi span="16" label="Tittle" path="name">
              <n-input v-model:value="programme.name" placeholder="Tittle" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Description" path="description">
                <n-input
                    v-model:value="programme.description"
                    type="textarea"
                    placeholder="Description"
                />
            </n-form-item-gi>
            <n-form-item-gi span="16" path="date" label="Start Date">
                <n-date-picker
                    size="large"
                    type="date"
                    v-model:formatted-value="programme.date"
                    autosize
                />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Is Featured" path="is_featured">
              <n-switch v-model:value="programme.is_featured" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" path="image" label="Image (W550px*H400px)">
            <n-upload
                @change="handleUpdate"
                :default-file-list="previewFileList"
                :max="1"
                list-type="image-card"
                @preview="handlePreview"
              />
              <n-modal
                v-model:show="showModal"
                preset="card"
                style="width: 600px"
                title="A Cool Picture"
              >
                <img :src="previewImageUrl" style="width: 100%">
              </n-modal>
            </n-form-item-gi>
            <n-gi span="9" :x-gap="5">
              <n-button
                @click="onSubmit"
                :loading="loading"
                type="primary"
                size="large"
                style="margin-top: 20px"
              >Submit</n-button>
            </n-gi>
          </n-grid>
        </n-card>
      </n-gi>
    </n-grid>
  </n-form>
</template>
<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ProgrammeForm",
  props: {
    selectedProgramme: {
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultProgramme = {
      id:null,
      name: null,
      is_featured: null,
      description: null,
      date: null
    };
    const programme = ref(props.selectedProgramme || defaultProgramme);
    const showModalRef = ref(false);
    const file = ref(null);
    const previewImageUrlRef = ref("");
    function handlePreview(file) {
      const { url } = file;
      previewImageUrlRef.value = url;
      showModalRef.value = true;
    }

    const formRef = ref(null);
    const previewFileList = ref([])

    if (programme.value.id) {
      previewFileList.value = [
        {
          id: programme.value.id,
          name: programme.value.filename,
          status: 'finished',
          url: programme.value.filepath
        }
      ]
    }

    return {
      handlePreview,
      showModal: showModalRef,
      previewImageUrl: previewImageUrlRef,
      programme,
      file,
      formref: ref(null),
      rules: {
        name: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "Title is required."
        },
        description: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "Description is required."
        },
        date: {
          required: false,
          type: "date",
          trigger: ["blur", "change"]
        }
      },
      previewFileList
    };
  },
  methods: {
    handleUpdate ({file}) {
      this.programme.filename = file.name
      this.file = file
    },
    onSubmit() {
      this.$refs.formRef.validate(errors => {
        if (errors) {
          return;
        }
        const formData = new FormData();

        if (this.file) {
          formData.append("file", this.file.file);
        } 
        formData.append("data", JSON.stringify(this.getFormData()));
        if (this.programme.id) {
          const eventName =  "programme:update";
          this.$emit(eventName, this.programme.id ,  formData);
        } else {
          const eventName = "programme:create";
          this.$emit(eventName, formData);
        }
      });
    },
    getFormData() {
      const data = {
        name: this.programme.name,
        description: this.programme.description,
        is_featured: this.programme.is_featured,
        date: this.programme.date,
        filename: this.programme.filename
      };

      if (this.programme.id) {
        data.id = this.programme.id;
      }

      return data;
    }
  }
});
</script>