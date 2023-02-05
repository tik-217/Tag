<template>
  <div class="board">
    <div class="board__wrap">
      <h3>{{ score }}</h3>
      <p>Best score: {{ bestScore }}</p>
      <div class="board__num">
        <template v-for="elem in initialLayout" :key="elem">
          <div
            @click="moveNum(elem)"
            :class="[elem === 0 && 'board__num_empty-num']"
          >
            {{ elem }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ICoord, IZeroEnvironment } from "@/types";

export default defineComponent({
  name: "BoardNum",
  data() {
    return {
      bestScore: localStorage.getItem("score") ?? "0",
      score: 0,
      zeroPosInit: {
        x: 3,
        y: 3,
      },
      initialLayout: [] as number[],
    };
  },
  methods: {
    moveNum(num: number) {
      const { coord, zeroEnvironment } = this.gettingZeroPosition(num);
      let isZeroZero = false;

      Object.values(zeroEnvironment).forEach((el: ICoord) => {
        const elArr = Object.values(el);
        const coordArr = Object.values(coord);

        // Filtering of all available numbers to change the position. The number selected by the user is returned
        const choosenClickELem = elArr.filter(
          (value, index) => value === coordArr[index]
        );

        if (choosenClickELem.length !== 2) return;

        if (isZeroZero === false) {
          const zeroZero = choosenClickELem.every(
            (el: number, i: number, arr: number[]) =>
              i === 0 || (el === 0 && arr[i - 1] === 0)
          );

          this.score++;

          if (zeroZero) {
            isZeroZero = zeroZero;
            return;
          }
        }

        const posNum = this.initialLayout.indexOf(num);
        const posZero = this.initialLayout.indexOf(0);

        this.zeroPosInit.x = el.x;
        this.zeroPosInit.y = el.y;

        this.initialLayout[posNum] = 0;
        this.initialLayout[posZero] = num;
      });
    },
    gettingZeroPosition(num: number) {
      const { preparedArray, coord } = this.preparingArray(num);

      // North — север
      // South — юг
      // East — восток
      // West – запад
      const zeroEnvironment: IZeroEnvironment = {
        north: {
          x: 0,
          y: 0,
        },
        east: {
          x: 0,
          y: 0,
        },
        south: {
          x: 0,
          y: 0,
        },
        west: {
          x: 0,
          y: 0,
        },
      };

      // north
      if (this.zeroPosInit.y - 1 >= 0) {
        zeroEnvironment.north.y = this.zeroPosInit.y - 1;
        zeroEnvironment.north.x = this.zeroPosInit.x;
      }

      // east
      if (preparedArray.length - 1 >= this.zeroPosInit.x + 1) {
        zeroEnvironment.east.x = this.zeroPosInit.x + 1;
        zeroEnvironment.east.y = this.zeroPosInit.y;
      }

      // south
      if (preparedArray.length - 1 >= this.zeroPosInit.y + 1) {
        zeroEnvironment.south.y = this.zeroPosInit.y + 1;
        zeroEnvironment.south.x = this.zeroPosInit.x;
      }

      // west
      if (this.zeroPosInit.x - 1 >= 0) {
        zeroEnvironment.west.x = this.zeroPosInit.x - 1;
        zeroEnvironment.west.y = this.zeroPosInit.y;
      }

      return { coord, zeroEnvironment };
    },
    preparingArray(num: number) {
      const newLayout = this.initialLayout;
      const preparedArray: Array<number[]> = [];

      const coord = {
        x: 0,
        y: 0,
      };

      // cut the array into 4 parts
      const chunkSize = 4;
      for (let i = 0; i < newLayout.length; i += chunkSize) {
        const chunk = newLayout.slice(i, i + chunkSize);
        // getting a position y in chank
        const existInChank = chunk.indexOf(num);

        // getting click by x and y
        if (existInChank >= 0) {
          coord.x = existInChank;
          coord.y = i / 4;
        }

        preparedArray.push(chunk);
      }

      return { preparedArray, coord };
    },
    genInitialLayout() {
      for (let i = 0; i <= 14; i++) {
        this.genRandom();
      }
      this.initialLayout.push(0);
    },
    genRandom() {
      const randomNum: number = Math.round(Math.random() * 15);

      if (randomNum === 0 || this.initialLayout.includes(randomNum)) {
        this.genRandom();
      } else {
        this.initialLayout.push(randomNum);
      }
    },
  },
  watch: {
    initialLayout: {
      handler(val) {
        const result = val.every(
          (el: number, i: number, arr: number[]) =>
            i === 15 || i === 0 || el >= arr[i - 1]
        );

        if (result) {
          alert("Game complete");
          localStorage.setItem("score", JSON.stringify(this.score));
          this.score = 0;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.genInitialLayout();
    });
  },
});
</script>
<style lang="scss">
.board {
  height: 100%;
  position: relative;
}

.board__wrap {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  flex-direction: column;
}

.board__wrap h3 {
  top: 5vh;
  position: absolute;
  font-size: 30px;
}

.board__num {
  background: #745;
  box-shadow: rgb(119 68 85) 0px 50px 100px -20px,
    rgb(119 68 85) 0px 30px 60px -30px;
  padding: 10px;
  border-radius: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.board__num div {
  height: 100px;
  width: 100px;
  background: #fff;
  display: flex;

  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-radius: 10px;

  margin: 10px;
  user-select: none;
  cursor: pointer;
}

.board .board__num_empty-num {
  background: none;
  cursor: auto;
  color: transparent;
}
</style>
