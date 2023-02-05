<template>
  <BoardNum />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BoardNum from "./components/BoardNum.vue";

export default defineComponent({
  name: "App",
  components: {
    BoardNum,
  },
});
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  height: 100%;
  width: 100%;
}

* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
