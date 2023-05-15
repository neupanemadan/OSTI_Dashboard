<template>
  <n-form ref="formRef" :model="slider" :rules="rules" size="large">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <n-card title="Slider" embedded :bordered="true">
          <n-grid :span="24" :x-gap="24">
            <n-form-item-gi span="16" label="Name" path="name">
              <n-input v-model:value="slider.name" placeholder="Name" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="Description" path="description">
                <n-input
                    v-model:value="slider.description"
                    type="textslider"
                    placeholder="Description"
                />
            </n-form-item-gi>
            <n-form-item-gi span="16" path="image" label="Image (W1024px*H592px)">
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
  name: "SliderForm",
  props: {
    selectedSlider: {
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultSlider = {
      id:null,
      name: null,
      description: null
    };
    const slider = ref(props.selectedSlider|| defaultSlider);
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

    if (slider.value.id) {
      previewFileList.value = [
        {
          id: slider.value.id,
          name: slider.value.filename,
          status: 'finished',
          url: slider.value.filepath
        }
      ]
    }

    return {
      handlePreview,
      showModal: showModalRef,
      previewImageUrl: previewImageUrlRef,
      slider,
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
      this.slider.filename = file.name
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
        if (this.slider.id) {
          const eventName =  "slider:update";
          this.$emit(eventName, this.slider.id ,  formData);
        } else {
          const eventName = "slider:create";
          this.$emit(eventName, formData);
        }
      });
    },
    getFormData() {
      const data = {
        name: this.slider.name,
        description: this.slider.description,
        filename: this.slider.filename
      };

      if (this.slider.id) {
        data.id = this.slider.id;
      }

      return data;
    }
  }
});
</script>