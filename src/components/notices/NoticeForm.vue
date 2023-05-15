<template>
  <n-form ref="formRef" :model="notice" :rules="rules" size="large">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <n-card title="Notice Information" embedded :bordered="true">
          <n-grid :span="24" :x-gap="24">
            <n-form-item-gi span="16" label="Name" path="name">
              <n-input v-model:value="notice.name" placeholder="Name" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Link" path="link">
              <n-input v-model:value="notice.link" placeholder="Link" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" path="image" label="Image">
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
  name: "NoticeForm",
  props: {
    selectedNotice: {
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultNotice = {
      id:null,
      name: null,
      link: null
    };
    const notice = ref(props.selectedNotice|| defaultNotice);
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

    if (notice.value.id) {
      previewFileList.value = [
        {
          id: notice.value.id,
          name: notice.value.filename,
          status: 'finished',
          url: notice.value.filepath
        }
      ]
    }

    return {
      handlePreview,
      showModal: showModalRef,
      previewImageUrl: previewImageUrlRef,
      notice,
      file,
      formref: ref(null),
      rules: {
        name: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "Title is required."
        }
      },
      previewFileList
    };
  },
  methods: {
    handleUpdate ({file}) {
      this.notice.filename = file.name
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
        if (this.notice.id) {
          const eventName =  "notice:update";
          this.$emit(eventName, this.notice.id ,  formData);
        } else {
          const eventName = "notice:create";
          this.$emit(eventName, formData);
        }
      });
    },
    getFormData() {
      const data = {
        name: this.notice.name,
        filename: this.notice.filename,
        link: this.notice.link
      };

      if (this.notice.id) {
        data.id = this.notice.id;
      }

      return data;
    }
  }
});
</script>