<template>
  <div class="users-page">
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
        :data="teams"
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
        <team-form
          @team:update="onTeamUpdate"
          @team:create="onTeamCreate"
          :selected-team="selectedTeam"
          :loading="loading"
        ></team-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, h } from "vue";
import { mapActions, mapState } from "pinia";
import { teamStore } from "@/store/teams.js";
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
      title: "Position",
      key: "position",
      width: 200
    },
    {
      title: "Email",
      key: "email",
      width: 200
    },
    {
      title: "Facebook",
      key: "facebook",
      width: 100,
    },
    {
      title: "Filename",
      key: "filename",
      width: 100,
    },
    {
      title: "Action",
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
    ...mapState(teamStore, ["teams"]),
    drawerTitle() {
      return this.selectedTeam ? "Update Team" : "Create Team";
    }
  },
  data() {
    const active = ref(false);
    const selectedTeam = ref(null);
    const message = useMessage();

    return {
      active,
      selectedTeam,
      message,
      loading: ref(false),
      pagination: {
        pageSize: 5
      },
      columns: createColumns({
        updateHandler: row => {
          active.value = true;
          selectedTeam.value = row;
        },
        deleteHandler: row => {
          this.onTeamDelete(row.id)
        }
      })
    };
  },
  
  methods: {
    ...mapActions(teamStore, ["fetchTeams", "createTeam", "updateTeam", "deleteTeam"]),
    updateTeamCallback() {},
    onUpdateDrawer(isOpened) {
      if (isOpened) {
        return;
      }

      this.selectedTeam = null;
    },
    onTeamCreate(data) {
      this.loading = true;
      this.createTeam(data)
        .then(() => {
          this.message.success("Team created successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedTeam = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onTeamUpdate(id, data) {
      this.loading = true;
      this.updateTeam(id, data)
        .then(() => {
          this.message.success("Team updated successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedTeam = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onTeamDelete(id) {
      this.loading = true;
      this.deleteTeam(id)
        .then(() => {
          this.message.success("Team deleted successfully.", {
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
    this.fetchTeams()
  }
});
</script>