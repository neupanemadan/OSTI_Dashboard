<template>
  <div class="about-page">
    <n-space justify="end">
      <n-button @click="active = true" type="primary" size="large">
        <template #icon>
          <n-icon>
            <CreateOutline />
          </n-icon>
        </template>
        Create
      </n-button>
    </n-space>
    <n-card style="margin-top: 20px" :bordered="true">
      <n-space style="margin-bottom: 5px" justify="end">
        <n-button type="info" dashed>
          <template #icon>
            <n-icon>
              <ReloadOutline />
            </n-icon>
          </template>
          Reload
        </n-button>
      </n-space>
      <n-data-table
        remote
        ref="fileTable"
        :columns="columns"
        :data="abouts"
        :loading="loading"
        :pagination="pagination"
        size="large"
      />
    </n-card>

    <n-drawer
      v-model:show="active"
      :close-on-esc="false"
      :mask-closable="false"
      @update:show="onUpdateDrawer"
      width="800px"
      placement="left"
    >
      <n-drawer-content :title="drawerTitle" closable :native-scrollbar="false">
        <about-form
          @about:update="onAboutUpdate"
          @about:create="onAboutCreate"
          :selected-about="selectedAbout"
          :loading="loading"
        ></about-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, h } from "vue";
import { mapActions, mapState } from "pinia";
import { aboutStore } from "@/store/about.js";
import { NButton } from "naive-ui";
import { NAlert, useMessage } from "naive-ui";
import { CreateOutline, ReloadOutline } from "@vicons/ionicons5";

const renderMessage = props => {
  const { type } = props;
  return h(
    NAlert,
    {
      closable: props.closable,
      onClose: props.onClose,
      type: type === "loading" ? "default" : type,
      title: props.title,
      style: {
        boxShadow: "var(--n-box-shadow)",
        maxWidth: "calc(100vw - 32px)",
        width: "480px"
      }
    },
    {
      default: () => props.content
    }
  );
};

const createColumns = ({ updateHandler, deleteHandler }) => {
  return [
    {
      title: "Mission",
      key: "mission",
      sorter: "default",
      width: 200
    },
    {
      title: "Vision",
      key: "vision",
      width: 200
    },
    {
      title: "About us",
      key: "company_description",
      width: 200
    },

    {
      title: "CEO Message",
      key: "ceo_message",
      width: 200
    },

    {
      title: "Policy",
      key: "policy",
      width: 200
    },
    {
      title: "Filename",
      key: "filename",
      width: 100,
    },
    {
      title: "Action",
      key: "actions",
      width: 100,
      render(row) {
        return h(
          NButton,
          {
            style: {
              marginLeft: "6px"
            },
            type: "info",
            strong: true,
            size: "medium",
            onClick: () => updateHandler(row)
          },
          { default: () => "Edit" }
        );
      }
    },
    {
      title: "",
      key: "actions",
      width: 20,
      render(row) {
        return h(
          NButton,
          {
            style: {
              allignItem:"left",
              marginLeft: "6px"
            },
            type: "error",
            strong: true,
            size: "medium",
            onClick: () => deleteHandler(row)
          },
          { default: () => "Delete" }
        );
      }
    },
  ];
};


export default defineComponent({
  components: {
    CreateOutline,
    ReloadOutline
  },
  computed: {
    ...mapState(aboutStore, ["abouts"]),
    drawerTitle() {
      return this.selectedAbout ? "Update About" : "Create About";
    }
  },
  data() {
    const active = ref(false);
    const selectedAbout = ref(null);
    const message = useMessage();

    return {
      active,
      selectedAbout,
      message,
      loading: ref(false),
      pagination: {
        pageSize: 5
      },
      columns: createColumns({
        updateHandler: row => {
          active.value = true;
          selectedAbout.value = row;
        },
        deleteHandler: row => {
          this.onAboutDelete(row.id)
        }
      })
    };
  },
  
  methods: {
    ...mapActions(aboutStore, ["fetchAbout", "createAbout", "updateAbout", "deleteAbout"]),
    updateAboutCallback() {},
    onUpdateDrawer(isOpened) {
      if (isOpened) {
        return;
      }

      this.selectedAbout = null;
    },
    onAboutCreate(data) {
      this.loading = true;
      this.createAbout(data)
        .then(() => {
          this.message.success("About created successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedAbout = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onAboutUpdate(id, data) {
      this.loading = true;
      this.updateAbout(id, data)
        .then(() => {
          this.message.success("About updated successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedAbout = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onAboutDelete(id) {
      this.loading = true;
      this.deleteAbout(id)
        .then(() => {
          this.message.success("About deleted successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    // this.loading = true;
    this.fetchAbout()
  }
});
</script>