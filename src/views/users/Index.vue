<template>
  <div class="users-page">
    <n-space justify="end">
      <n-button @click="active = true" type="primary" size="large">
        <template #icon>
          <n-icon>
            <PersonAddOutline />
          </n-icon>
        </template>
        登録
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
          リロード
        </n-button>
      </n-space>
      <n-data-table
        remote
        ref="fileTable"
        :columns="columns"
        :data="users"
        :loading="loading"
        :pagination="pagination"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
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
        <user-form
          @user:update="onUserUpdate"
          @user:create="onUserCreate"
          :selected-user="selectedUser"
          :loading="loading"
        ></user-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, h } from "vue";
import { mapActions, mapState } from "pinia";
import { userStore } from "@/store/users.js";
import { NButton } from "naive-ui";
import { NAlert, NTag, useMessage } from "naive-ui";
import { PersonAddOutline, ReloadOutline } from "@vicons/ionicons5";

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

const createColumns = ({ updateHandler }) => {
  return [
    {
      title: "ユーザー名",
      key: "full_name",
      sorter: "default",
      fixed: "left",
      width: 150
    },
    {
      title: "Role",
      key: "role",
      width: 100,
      render(row) {
        return h(
          NTag,
          {
            type: row.role === "ROLE_ADMIN" ? "error" : "info",
            bordered: false
          },
          {
            default: () => {
              return row.role === "ROLE_ADMIN" ? "Admin" : "User";
            }
          }
        );
      }
    },
    {
      title: "更新日付",
      key: "updated_at",
      width: 200
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
          { default: () => "修正" }
        );
      }
    }
  ];
};

const paginationOptions = {
  itemCount: 0,
  pageSize: 15,
  showSizePicker: true,
  prefix({ itemCount }) {
    return `ユーザー数: ${itemCount}`;
  },
  pageSizes: [
    {
      label: "15 per page",
      value: 15
    },
    {
      label: "30 per page",
      value: 30
    },
    {
      label: "50 per page",
      value: 50
    },
    {
      label: "100 per page",
      value: 100
    }
  ],
  page: 1
};

export default defineComponent({
  components: {
    PersonAddOutline,
    ReloadOutline
  },
  computed: {
    ...mapState(userStore, ["users", "userCount"]),
    drawerTitle() {
      return this.selectedUser ? "ユーザー情報編集" : "ユーザー作成";
    }
  },
  setup() {
    const active = ref(false);
    const selectedUser = ref(null);
    const message = useMessage();

    return {
      active,
      selectedUser,
      message,
      loading: ref(false),
      pagination: ref(paginationOptions),
      columns: createColumns({
        updateHandler: row => {
          active.value = true;
          selectedUser.value = row;
        }
      })
    };
  },
  methods: {
    ...mapActions(userStore, ["updateUser", "fetchUsers", "createUser"]),
    updateUserCallback() {},
    handlePageChange() {},
    handlePageSizeChange() {},
    onUpdateDrawer(isOpened) {
      if (isOpened) {
        return;
      }

      this.selectedUser = null;
    },
    onUserCreate(data) {
      this.loading = true;
      this.createUser(data)
        .then(() => {
          this.message.success("ユーザー登録を完了しました", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedUser = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onUserUpdate(data) {
      this.loading = true;
      this.updateUser(data.id, data)
        .then(() => {
          this.message.success("ユーザー更新を完了しました", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedUser = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.loading = true;
    this.fetchUsers()
      .then(() => {
        this.pagination.itemCount = this.userCount;
      })
      .finally(() => {
        this.loading = false;
      });
  }
});
</script>