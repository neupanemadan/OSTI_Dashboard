<template>
  <n-form ref="formRef" :model="gallery" :rules="rules" size="large">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <n-card title="Gallery Information" embedded :bordered="true">
          <n-grid :span="24" :x-gap="24">
            <n-form-item-gi span="16" label="Album Name" path="album">
              <n-input v-model:value="gallery.album" placeholder="Album Name" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" path="image" label="Image (W400px*H200px)">
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
  name: "GalleryForm",
  props: {
    selectedGallery: {
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultGallery = {
      id:null,
      album: null
    };
    const gallery = ref(props.selectedGallery|| defaultGallery);
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

    if (gallery.value.id) {
      previewFileList.value = [
        {
          id: gallery.value.id,
          name: gallery.value.filename,
          status: 'finished',
          url: gallery.value.filepath
        }
      ]
    }

    return {
      handlePreview,
      showModal: showModalRef,
      previewImageUrl: previewImageUrlRef,
      gallery,
      file,
      formref: ref(null),
      rules: {
        album: {
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
      this.gallery.filename = file.name
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
        if (this.gallery.id) {
          const eventName =  "gallery:update";
          this.$emit(eventName, this.gallery.id ,  formData);
        } else {
          console.log("create000000000")
          console.log(formData)
          const eventName = "gallery:create";
          this.$emit(eventName, formData);
        }
      });
    },
    getFormData() {
      const data = {
        album: this.gallery.album,
        filename: this.gallery.filename
      };

      if (this.gallery.id) {
        data.id = this.gallery.id;
      }

      return data;
    }
  }
});
</script>