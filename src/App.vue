<template>
  <BoardNum />
  <div class="abilityControlKeyboard">
    <img
      src="../public/icons8-keyboard-64.png"
      :id="blinking1 ? 'blink' : 'unblinking'"
      alt=""
    />
    <img
      src="../public/icons8-arrow-keys-64.png"
      :id="blinking2 ? 'blink' : 'unblinking'"
      alt=""
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BoardNum from "@/components/BoardNum.vue";

export default defineComponent({
  name: "App",
  components: {
    BoardNum,
  },
  data() {
    return {
      blinking1: true,
      blinking2: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.blinking1 = false;
      }, 4000);

      setTimeout(() => {
        this.blinking2 = true;
      }, 4100);

      setTimeout(() => {
        this.blinking2 = false;
      }, 8000);
    });
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

.abilityControlKeyboard {
  position: absolute;
  top: 40px;
  right: 40px;
}

#unblinking {
  display: none;
}

#blink {
  -webkit-animation: blink 4s linear infinite;
  animation: blink 4s linear infinite;
  opacity: 0;
}
@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media screen and (max-width: 990px) {
  .abilityControlKeyboard {
    display: none;
  }
}
</style>
