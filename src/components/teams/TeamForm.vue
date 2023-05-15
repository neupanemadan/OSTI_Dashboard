<template>
  <n-form ref="formRef" :model="team" :rules="rules" size="large">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <n-card title="Team Information" embedded :bordered="true">
          <n-grid :span="24" :x-gap="24">
            <n-form-item-gi span="16" label="Name" path="name">
              <n-input v-model:value="team.name" placeholder="Name" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Position" path="name">
              <n-input v-model:value="team.position" placeholder="Position" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Email" path="email">
              <n-input v-model:value="team.email" placeholder="Email" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Facebook" path="facebook">
              <n-input v-model:value="team.facebook" placeholder="Facebook" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" path="image" label="Image (W500px*H600px)">
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
  name: "TeamForm",
  props: {
    selectedTeam: {
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultTeam = {
      id:null,
      name: null,
      position: null,
      email: null,
      facebook: null
    };
    const team = ref(props.selectedTeam || defaultTeam);
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

    if (team.value.id) {
      previewFileList.value = [
        {
          id: team.value.id,
          name: team.value.filename,
          status: 'finished',
          url: team.value.filepath
        }
      ]
    }

    return {
      handlePreview,
      showModal: showModalRef,
      previewImageUrl: previewImageUrlRef,
      team,
      file,
      formref: ref(null),
      rules: {
        name: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "Title is required."
        },
        email: {
          required: true,
          type: "email",
          trigger: ["blur", "change"],
          message: "Email is required."
        },
        facebook: {
          required: false,
          type: "string",
          trigger: ["blur", "change"]
        }
      },
      previewFileList
    };
  },
  methods: {
    handleUpdate ({file}) {
      this.team.filename = file.name
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
        if (this.team.id) {
          const eventName =  "team:update";
          this.$emit(eventName, this.team.id ,  formData);
        } else {
          const eventName = "team:create";
          this.$emit(eventName, formData);
        }
      });
    },
    getFormData() {
      const data = {
        name: this.team.name,
        position: this.team.position,
        email: this.team.email,
        facebook: this.team.facebook,
        filename: this.team.filename
      };

      if (this.team.id) {
        data.id = this.team.id;
      }

      return data;
    }
  }
});
</script>