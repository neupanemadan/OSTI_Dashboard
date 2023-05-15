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
        :data="programmes"
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
        <programme-form
          @programme:update="onProgrammeUpdate"
          @programme:create="onProgrammeCreate"
          :selected-programme="selectedProgramme"
          :loading="loading"
        ></programme-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, h } from "vue";
import { mapActions, mapState } from "pinia";
import { programmeStore } from "@/store/programmes.js";
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
      title: "Title",
      key: "name",
      sorter: "default",
      width: 150
    },
    {
      title: "Description",
      key: "description",
      width: 200
    },
    {
      title: "Start From",
      key: "date",
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
    ...mapState(programmeStore, ["programmes"]),
    drawerTitle() {
      return this.selectedProgramme ? "Update Programme" : "Create Programme";
    }
  },
  data() {
    const active = ref(false);
    const selectedProgramme = ref(null);
    const message = useMessage();

    return {
      active,
      selectedProgramme,
      message,
      loading: ref(false),
      pagination: {
        pageSize: 5
      },
      columns: createColumns({
        updateHandler: row => {
          active.value = true;
          selectedProgramme.value = row;
        },
        deleteHandler: row => {
          this.onProgrammeDelete(row.id)
        }
      })
    };
  },
  
  methods: {
    ...mapActions(programmeStore, ["fetchProgrammes", "createProgramme", "updateProgramme", "deleteProgramme"]),
    updateProgrammeCallback() {},
    onUpdateDrawer(isOpened) {
      if (isOpened) {
        return;
      }

      this.selectedProgramme = null;
    },
    onProgrammeCreate(data) {
      this.loading = true;
      this.createProgramme(data)
        .then(() => {
          this.message.success("Programme created successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedProgramme = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onProgrammeUpdate(id, data) {
      this.loading = true;
      this.updateProgramme(id, data)
        .then(() => {
          this.message.success("Programme updated successfully.", {
            render: renderMessage,
            closable: true,
            duration: 5000
          });
          this.selectedProgramme = null;
          this.active = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onProgrammeDelete(id) {
      this.loading = true;
      this.deleteProgramme(id)
        .then(() => {
          this.message.success("Programme deleted successfully.", {
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
    this.fetchProgrammes()
  }
});
</script>