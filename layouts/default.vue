<template>
  <div>
    <div class="header">
      <div class="navbar">
        <a-menu v-model="current" mode="horizontal">
          <a-menu-item key="index">
            <a href="./">聊天室</a>
          </a-menu-item>
          <a-menu-item key="contact">
            <a href="contact">contact</a>
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <div class="app-container">
      <Nuxt />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: ["contact"],
    };
  },
  created() {
    this.current[0] = this.$route.name;
  },
};
</script>
<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.header {
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  position: relative;
  z-index: 10;
  max-width: 100%;
}
.navbar {
  max-width: 1024px;
  margin: 0 auto;
}
.app-container {
  max-width: 1024px;
  margin: 0 auto;
}
</style>
