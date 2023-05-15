<template>
  <div class="setting-page">
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
        :data="settings"
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
        <setting-form
          @setting:update="onSettingUpdate"
          @setting:create="onSettingCreate"
          :selected-setting="selectedSetting"
          :loading="loading"
        ></setting-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, h } from "vue";
import { mapActions, mapState } from "pinia";
import { settingeStore } from "@/store/setting.js";
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
      title: "Company Name",
      key: "name",
      sorter: "default",
      width: 250
    },
    {
      title: "Address 1",
      key: "first_address",
      width: 200
    },
    {
      title: "Address 2",
      key: "second_address",
      width: 200
    },
    {
      title: "Email 1",
      key: "first_email",
      width: 200
    },
    {
      title: "Email 2",
      key: "second_email",
      width: 200
    },
    {
      title: "Phone 1",
      key: "first_phone",
      width: 200
    },
    {
      title: "Phone 2",
      key: "second_phone",
      width: 200
    },
    {
      title: "Facebook",
      key: "facebook",
      width: 100,
    },
    {
      title: "Instagram",
      key: "instagram",
      width: 100,
    },
    {
      title: "Filename",
      key: "filename",
      width: 100,
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
      title: "Actions",
      key: "actions",
      width: 200,
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
    ...mapState(settingeStore, ["settings"]),
    drawerTitle() {
      return this.selectedSetting ? "Update Setting" : "Create Setting";
    }
  },
  data() {
    const active = ref(false);
    const selectedSetting = ref(null);
    const message = useMessage();

    return {
      active,
      selectedSetting,
      message,
      loading: ref(false),
      pagination: {
        pageSize: 5
      },
      columns: createColumns({
        updateHandler: row => {
          active.value = true;
          selectedSetting.value = row;
        },
        deleteHandler: row => {
          this.onSettingDelete(row.id)
        }
      })
    };
  },
  
  methods: {
    ...mapActions(settingeStore, ["fetchSetting", "createSetting", "updateSetting", "deleteSetting"]),
    updateSettingCallback() {},
    onUpdateDrawer(isOpened) {
      if (isOpened) {
        return;
      }

      this.selectedSetting = null;
    },
    onSettingCreate(data) {
      this.loading = true;
      this.createSetting(data)
        .then(() => {
          this.message.success("Setting created successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedSetting = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSettingUpdate(id, data) {
      this.loading = true;
      this.updateSetting(id, data)
        .then(() => {
          this.message.success("Setting updated successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedSetting = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSettingDelete(id) {
      this.loading = true;
      this.deleteSetting(id)
        .then(() => {
          this.message.success("Setting deleted successfully.", {
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
    this.fetchSetting()
  }
});
</script>