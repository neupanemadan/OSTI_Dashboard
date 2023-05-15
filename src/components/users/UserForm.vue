<template>
  <n-form ref="formRef" :model="user" :rules="rules" size="large">
    <n-grid x-gap="12" :cols="1">
      <n-gi>
        <n-card title="ユーザー情報" embedded :bordered="true">
          <n-grid :span="24" :x-gap="24">
            <n-form-item-gi span="16" label="氏名" path="profile.name">
              <n-input v-model:value="user.profile.name" placeholder="氏名" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="部署" path="department_id">
              <n-select
                filterable
                placeholder="部署"
                :options="departments"
                v-model:value="user.department_id"
                size="large"
              />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="ロール" path="role">
              <n-radio-group v-model:value="user.role" name="radiogroup">
                <n-space>
                  <n-radio
                    v-for="role in roles"
                    :key="role.value"
                    :value="role.value"
                    :label="role.label"
                  />
                </n-space>
              </n-radio-group>
            </n-form-item-gi>
            <n-form-item-gi span="16" label="ユーザー名" path="username">
              <n-input v-model:value="user.username" placeholder="ユーザー名" size="large" />
            </n-form-item-gi>
            <n-form-item-gi span="16" label="パスワード更新" v-if="user.id">
              <n-switch v-model:value="showUpdatePassword" />
            </n-form-item-gi>
            <n-form-item-gi
              span="16"
              label="パスワード"
              path="password"
              v-if="!user.id || showUpdatePassword"
            >
              <n-input
                v-model:value="user.password"
                type="password"
                showPasswordOn="click"
                placeholder="パスワード"
                size="large"
              />
            </n-form-item-gi>
            <n-gi span="9" :x-gap="5">
              <n-button
                @click="onSubmit"
                :loading="loading"
                type="primary"
                size="large"
                style="margin-top: 20px"
              >登録</n-button>
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
  name: "UserForm",
  props: {
    departments: {
      required: true
    },
    selectedUser: {
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultUser = {
      username: null,
      password: null,
      role: "ROLE_USER",
      profile: {
        name: null
      }
    };
    const user = ref(props.selectedUser || defaultUser);
    return {
      user,
      formref: ref(null),
      showUpdatePassword: ref(false),
      rules: {
        username: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "ユーザー名が必要です。"
        },
        role: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "ロールが必要です。"
        },
        password: {
          required: true,
          type: "string",
          trigger: ["blur", "change"],
          message: "パスワードが必要です。"
        },
        profile: {
          name: {
            required: true,
            type: "string",
            trigger: ["blur", "change"],
            message: "氏名が必要です。"
          }
        },
        department_id: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "部署が必要です。"
        }
      },
      roles: [
        {
          value: "ROLE_ADMIN",
          label: "ADMIN"
        },
        {
          value: "ROLE_USER",
          label: "USER"
        }
      ]
    };
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate(errors => {
        if (errors) {
          return;
        }
        if (!this.user.email) {
          this.user.email = `no-reply-${this.user.username}@endo-kogyo.co.jp`;
        }
        const eventName = this.user.id ? "user:update" : "user:create";
        this.$emit(eventName, this.getFormData());
      });
    },
    getFormData() {
      const data = {
        username: this.user.username,
        email: this.user.email,
        role: this.user.role,
        department_id: this.user.department_id,
        profile: {
          ...this.user.profile
        }
      };

      if (this.user.id) {
        data.id = this.user.id;
      }

      if (!this.user.id || this.showUpdatePassword) {
        data.password = this.user.password;
      }

      return data;
    }
  }
});
</script>