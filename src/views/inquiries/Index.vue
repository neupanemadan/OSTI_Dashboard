<template>
  <div class="inquiries-page">
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
        :data="inquiries"
        :loading="loading"
        :pagination="pagination"
        size="large"
      />
    </n-card>
  </div>
</template>
<script>
import { defineComponent, ref, h } from "vue";
import { mapActions, mapState } from "pinia";
import { inquiriesStore } from "@/store/inquiries.js";
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
      title: "Email",
      key: "email",
      width: 200
    },
    {
      title: "Phone No.",
      key: "phone",
      width: 200
    },
    {
      title: "Company",
      key: "company",
      width: 100,
    },
    {
      title: "Subject",
      key: "subject",
      width: 100,
    },
    {
      title: "Message",
      key: "message",
      width: 300,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
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
    ReloadOutline
  },
  computed: {
    ...mapState(inquiriesStore, ["inquiries"]),
  },
  data() {
    const selectedInquiries= ref(null);
    const message = useMessage();

    return {
      selectedInquiries,
      message,
      loading: ref(false),
      pagination: {
        pageSize: 5
      },
      columns: createColumns({
        deleteHandler: row => {
          this.deleteInquiry(row.id)
        }
      })
    };
  },
  
  methods: {
    ...mapActions(inquiriesStore, ["fetchInquiries", "deleteInquiry"]),

    deleteInquiry(id) {
      this.loading = true;
      this.deleteInquiry(id)
        .then(() => {
          this.message.success("Inquiries deleted successfully.", {
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
    this.fetchInquiries()
  }
});
</script>