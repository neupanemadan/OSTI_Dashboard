<template>
  <n-config-provider
    :locale="config.jaJP"
    :theme-overrides="themeOverrides"
    :date-locale="config.dateJaJP"
  >
    <n-message-provider>
      <Router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import { jaJP, dateJaJP } from "naive-ui";

const themeOverrides = {
  common: {
    fontSize: "15px",
    fontSizeMedium: "15px",
    fontSizeLarge: "16px"
  },
  Card: {
    titleFontSizeMedium: "20px"
  },
  Form: {
    labelFontSizeTopLarge: "15px"
  }
};
export default {
  data() {
    return {
      config: {
        jaJP,
        dateJaJP
      },
      themeOverrides
    };
  }
};
</script>
<style>
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 320px;
  --header-height: 64px;
  --content-width: 1100px;
  --content-max-width: calc(80vw - 32px);
}

body {
  overflow: auto;
  -webkit-font-smoothing: antialiased;
}

.n-scrollbar {
  --n-scrollbar-width: 10px !important;
}

.n-layout-header {
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  padding: 16px;
}

.nav {
  height: calc(var(--header-height) - 1px);
  display: flex;
  justify-content: center;
}

.nav-box {
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: var(--content-width);
  max-width: var(--content-max-width);
}

.left-menu {
  display: flex;
}

.nav-menu {
  padding-left: 100px;
  font-size: 18px;
  font-weight: 500;
}

.ui-logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.ui-logo > img {
  margin-right: 12px;
  height: 42px;
  width: 220px;
}

.content-box {
  margin: auto;
  width: var(--content-width);
  max-width: var(--content-max-width);
}
</style>