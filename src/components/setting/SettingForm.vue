<template>
  <n-form ref="formRef" :model="setting" :rules="rules" size="large">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <n-card title="Settings" embedded :bordered="true">
          <n-grid :span="24" :x-gap="24">
            <n-form-item-gi span="16" label="Company Name" path="company_name">
              <n-input v-model:value="setting.name" placeholder="Company Name" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="First Address" path="first_address">
              <n-input v-model:value="setting.first_address" placeholder="First Address" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Second Address" path="second_address">
              <n-input v-model:value="setting.second_address" placeholder="Second Address" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="First Phone Number" path="first_phone">
              <n-input v-model:value="setting.first_phone" placeholder="First Phone Number" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Second Phone Number" path="second_phone">
              <n-input v-model:value="setting.second_phone" placeholder="Second Phone Number" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="First Email Address" path="first_email">
              <n-input v-model:value="setting.first_email" placeholder="First Email Address" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Second Email Address" path="second_email">
              <n-input v-model:value="setting.second_email" placeholder="Second Email Address" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Facebook" path="facebook">
              <n-input v-model:value="setting.facebook" placeholder="Facebook" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Instagram" path="instagram">
              <n-input v-model:value="setting.instagram" placeholder="Instagram" size="large" />
            </n-form-item-gi>

            <n-form-item-gi span="16" path="image" label="Image (W530px*H120px)">
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
  name: "SettingForm",
  props: {
    selectedSetting: {
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultSetting = {
      id:null,
      name: null,
      first_address: null,
      second_address: null,
      first_phone: null,
      second_phone: null,
      first_email: null,
      second_email: null,
      facebook: null,
      instagram: null,
      filename: null
    };
    const setting = ref(props.selectedSetting || defaultSetting);
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

    if (setting.value.id) {
      previewFileList.value = [
        {
          id: setting.value.id,
          name: setting.value.filename,
          status: 'finished',
          url: setting.value.filepath
        }
      ]
    }

    return {
      handlePreview,
      showModal: showModalRef,
      previewImageUrl: previewImageUrlRef,
      setting,
      file,
      formref: ref(null),
      rules: {
        name: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "Title is required."
        },
        first_address: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "first_address is required."
        },
        first_phone: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "first_phone is required."
        },
        first_email: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "first_email is required."
        }
      },
      previewFileList
    };
  },
  methods: {
    handleUpdate ({file}) {
      this.setting.filename = file.name
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
        if (this.setting.id) {
          const eventName =  "setting:update";
          this.$emit(eventName, this.setting.id ,  formData);
        } else {
          const eventName = "setting:create";
          this.$emit(eventName, formData);
        }
      });
    },
    getFormData() {
      const data = {
        name: this.setting.name,
        first_address: this.setting.first_address,
        second_address: this.setting.second_address,
        first_phone: this.setting.first_phone,
        second_phone: this.setting.second_phone,
        first_email: this.setting.first_email,
        second_email: this.setting.second_email,
        facebook: this.setting.facebook,
        instagram: this.setting.instagram,
        filename: this.setting.filename
      };

      if (this.setting.id) {
        data.id = this.setting.id;
      }

      return data;
    }
  }
});
</script>