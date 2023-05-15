<template>
  <n-space vertical>
        <n-layout has-sider>
          <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = true"
            @expand="collapsed = false"
          >
            <n-layout-header bordered content-style="padding: 700px;">
              <div class="">
                <n-text tag="div" class="ui-logo">
                  <img src="../assets/logo.png" />
                </n-text>
                <!-- <n-menu
                  mode="horizontal"
                  v-model:value="page"
                  class="nav-menu"
                  :options="menuOptions"
                  :icon-size="22"
                /> -->
                <!-- <n-avatar round>A</n-avatar> -->
              </div>
            </n-layout-header>
            <n-menu
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              :render-label="renderMenuLabel"
              :render-icon="renderMenuIcon"
              :expand-icon="expandIcon"
            />
          </n-layout-sider>
          <n-layout-content content-style="padding: 10px;">
                <n-layout-header bordered content-style="padding: 500px;">
                  <div class="nav-box">
                    <div class="left-menu">
                    </div>
                    <div class="actions">
                      <div class="avatar-container">
                        <n-dropdown
                          trigger="hover"
                          :options="actionOptions"
                          size="large"
                          @select="handleSelect"
                        >
                          <div class="action-wrapper">
                            <div class="avatar">
                              <n-avatar
                                circle
                                size="large"
                                :bordered="true"
                                object-fit="contain"
                                color="rgba(24, 160, 88, 0.16)"
                              >
                                <n-icon size="28px" color="#18a058">
                                  <PersonOutline />
                                </n-icon>
                              </n-avatar>
                            </div>
                            <span class="name">
                              {{ $auth.currentUser().full_name }}
                              <n-icon class="tip">
                                <CaretDownSharp />
                              </n-icon>
                            </span>
                          </div>
                        </n-dropdown>
                      </div>
                    </div>
                  </div>
                </n-layout-header>
                <n-layout-content content-style="padding: 10px;">
                  <div class="content-box">
                    <div class="content">
                      <Router-view />
                    </div>
                  </div>
                </n-layout-content>
          </n-layout-content>
        </n-layout>
    </n-space>
</template>
<script>
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import { NIcon } from "naive-ui";
import { defineComponent, h, ref } from "vue";
import {
  HomeOutline,
  LogInOutline,
  CaretDownSharp,
  PersonOutline,
  PeopleOutline,
  GridOutline,
  PeopleCircleOutline,
  ChatboxOutline,
  CogOutline,
  AlbumsOutline,
  ReaderOutline,
  CodeWorkingOutline,
  LayersOutline,
  CalendarNumberOutline,
  ImageOutline
} from "@vicons/ionicons5";
import { RouterLink } from "vue-router";
import { useAuth } from "../auth/";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menus = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "home"
          }
        },
        { default: () => "Home" }
      ),
    key: "home",
    icon: renderIcon(HomeOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "programmes"
          }
        },
        { default: () => "Programmes" }
      ),
    key: "programmes",
    icon: renderIcon(GridOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "teams"
          }
        },
        { default: () => "Teams" }
      ),
    key: "teams",
    icon: renderIcon(PeopleCircleOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "areas"
          }
        },
        { default: () => "Working Areas" }
      ),
    key: "areas",
    icon: renderIcon(AlbumsOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "about"
          }
        },
        { default: () => "About" }
      ),
    key: "about",
    icon: renderIcon(ReaderOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "inquiries"
          }
        },
        { default: () => "Inquiries" }
      ),
    key: "inquiries",
    icon: renderIcon(ChatboxOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "setting"
          }
        },
        { default: () => "Setting" }
      ),
    key: "setting",
    icon: renderIcon(CogOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "clients"
          }
        },
        { default: () => "Clients" }
      ),
    key: "clients",
    icon: renderIcon(LayersOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "sliders"
          }
        },
        { default: () => "Sliders" }
      ),
    key: "sliders",
    icon: renderIcon(CodeWorkingOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "notices"
          }
        },
        { default: () => "Notices" }
      ),
    key: "notices",
    icon: renderIcon(CalendarNumberOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "galleries"
          }
        },
        { default: () => "Gallery" }
      ),
    key: "galleries",
    icon: renderIcon(ImageOutline)
  }
];

const adminOnlyMenus = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "users"
          }
        },
        { default: () => "Users" }
      ),
    key: "users",
    icon: renderIcon(PeopleOutline)
  }
];

const actionOptions = [
  {
    label: "Logout",
    key: "logout",
    icon: () =>
      h(NIcon, null, {
        default: () => h(LogInOutline)
      })
  }
];

export default defineComponent({
  components: { CaretDownSharp, PersonOutline },
  setup() {
    const auth = useAuth();
    const router = useRouter();
    const route = useRoute();
    const defaultRoute = computed(() => route.name);
    let menuOptions = menus;
    if (auth.isAdmin) {
      menuOptions = [...menus, ...adminOnlyMenus];
    }

    const logout = () => {
      auth.logout().finally(() => {
        router.push({ name: "login" });
      });
    };

    const handleSelect = key => {
      if (key === "logout") {
        logout();
      }
    };

    return {
      page: ref(defaultRoute),
      active: false,
      actionOptions,
      menuOptions,
      handleSelect
    };
  }
});
</script>
<style>
.avatar-container .action-wrapper {
  display: flex;
  align-items: center;
}
.avatar-container .action-wrapper .avatar {
  display: flex;
  align-items: center;
}

.avatar-container .action-wrapper .name {
  margin: 0 5px;
}
.avatar-container .action-wrapper .name .tip {
  transform: rotate(0);
  transition: transform 0.5s;
  margin-left: 2px;
}
.avatar-container:hover {
  cursor: pointer;
  color: #18a058;
}
.avatar-container:hover .name .tip {
  transform: rotate(180deg);
  transition: transform 0.5s;
}
</style>