<template>
  <n-form ref="formRef" :model="about" :rules="rules" size="large">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <n-card title="About us" embedded :bordered="true">
          <n-grid :span="24" :x-gap="24">
            <n-form-item-gi span="16" label="Mission" path="mission">
                <n-input
                    v-model:value="about.mission"
                    type="textarea"
                    placeholder="Mission"
                />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Vision" path="vision">
                <n-input
                    v-model:value="about.vision"
                    type="textarea"
                    placeholder="Vision"
                />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Company Description" path="company_description">
                <n-input
                    v-model:value="about.company_description"
                    type="textarea"
                    placeholder="Company Description"
                />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="CEO Message Paragraph 1" path="ceo_message">
                <n-input
                    v-model:value="about.ceo_message"
                    type="textarea"
                    placeholder="CEO Message"
                />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Ceo Message Paragraph 2" path="policy">
                <n-input
                    v-model:value="about.policy"
                    type="textarea"
                    placeholder="policy"
                />
            </n-form-item-gi>
            <n-form-item-gi span="16" path="image" label="Image (W750px*H700px)">
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
  name: "AreaForm",
  props: {
    selectedAbout: {
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultAbout = {
      id:null,
      mission: null,
      vision: null,
      company_description: null,
      ceo_message: null,
      name: null,
      policy: null,
      filename: null
    };
    const about = ref(props.selectedAbout|| defaultAbout);
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

    if (about.value.id) {
      previewFileList.value = [
        {
          id: about.value.id,
          name: about.value.filename,
          status: 'finished',
          url: about.value.filepath
        }
      ]
    }

    return {
      handlePreview,
      showModal: showModalRef,
      previewImageUrl: previewImageUrlRef,
      about,
      file,
      formref: ref(null),
      rules: {
        ceo_message: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "Ceo message is required."
        },
        mission: {
          required: false,
          type: "string",
          trigger: ["blur", "change"]
        },
        vision: {
          required: false,
          type: "string",
          trigger: ["blur", "change"]
        },
        company_description: {
          required: false,
          type: "string",
          trigger: ["blur", "change"]
        },
        policy: {
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
      this.about.filename = file.name
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
        if (this.about.id) {
          const eventName =  "about:update";
          this.$emit(eventName, this.about.id ,  formData);
        } else {
          const eventName = "about:create";
          this.$emit(eventName, formData);
        }
      });
    },
    getFormData() {
      const data = {
        mission: this.about.mission,
        vision: this.about.vision,
        company_description: this.about.company_description,
        ceo_message: this.about.ceo_message,
        policy: this.about.policy,
        filename: this.about.filename
      };

      if (this.about.id) {
        data.id = this.about.id;
      }

      return data;
    }
  }
});
</script>