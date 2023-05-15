<template>
  <div class="notice-page">
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
        :data="notices"
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
        <notice-form
          @notice:update="onNoticeUpdate"
          @notice:create="onNoticeCreate"
          :selected-notice="selectedNotice"
          :loading="loading"
        ></notice-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, h } from "vue";
import { mapActions, mapState } from "pinia";
import { noticeStore } from "@/store/notice.js";
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
      title: "Name",
      key: "name",
      sorter: "default",
      width: 150
    },
    {
      title: "Filename",
      key: "filename",
      width: 100,
    },
    {
      title: "Link",
      key: "link",
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
    ...mapState(noticeStore, ["notices"]),
    drawerTitle() {
      return this.selectedNotice ? "Update Notice" : "Create Notice";
    }
  },
  data() {
    const active = ref(false);
    const selectedNotice = ref(null);
    const message = useMessage();

    return {
      active,
      selectedNotice,
      message,
      loading: ref(false),
      pagination: {
        pageSize: 5
      },
      columns: createColumns({
        updateHandler: row => {
          active.value = true;
          selectedNotice.value = row;
        },
        deleteHandler: row => {
          this.onNoticeDelete(row.id)
        }
      })
    };
  },
  
  methods: {
    ...mapActions(noticeStore, ["fetchNotices", "createNotice", "updateNotice", "deleteNotice"]),
    updateNoticeCallback() {},
    onUpdateDrawer(isOpened) {
      if (isOpened) {
        return;
      }

      this.selectedNotice = null;
    },
    onNoticeCreate(data) {
      this.loading = true;
      this.createNotice(data)
        .then(() => {
          this.message.success("Notice created successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedNotice = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onNoticeUpdate(id, data) {
      this.loading = true;
      this.updateNotice(id, data)
        .then(() => {
          this.message.success("Notice updated successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedNotice = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onNoticeDelete(id) {
      this.loading = true;
      this.deleteNotice(id)
        .then(() => {
          this.message.success("Notice deleted successfully.", {
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
    this.fetchNotices()
  }
});
</script>