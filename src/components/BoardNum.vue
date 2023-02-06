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
      <button @click="collect">Собрать</button>
      <button @click="mixNum" v-if="assembleQuickly">Размешать</button>
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
      assembleQuickly: false,
      score: 0,
      zeroPosInit: {
        x: 3,
        y: 3,
      },
      initialLayout: [] as number[],
    };
  },
  methods: {
    mixNum() {
      this.genInitialLayout();
      this.assembleQuickly = false;
    },
    collect() {
      const zero = this.initialLayout.indexOf(0);

      this.initialLayout.splice(zero, 1);
      this.initialLayout.sort((a, b) => a - b);
      this.initialLayout.push(0);

      this.assembleQuickly = true;
    },
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
      this.initialLayout = [];

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
          setTimeout(() => {
            alert("Game complete");
          }, 100);

          if (!this.assembleQuickly) {
            localStorage.setItem("score", JSON.stringify(this.score));
          }

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
}

.board__wrap {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  flex-direction: column;

  h3 {
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

    div {
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

      -webkit-appearance: none;
      appearance: none;
    }

    .board__num_empty-num {
      background: none;
      cursor: auto;
      color: transparent;
    }
  }

  button {
    padding: 10px 20px;
    border-radius: 15px;
    border: none;
    margin-top: 20px;
    background: white;
    font-size: 13px;
    color: #925368;
    cursor: pointer;
    font-weight: 600;
    border: 2px solid #925368;
    box-shadow: 0 14px 28px rgb(119 68 85 / 36%), 0 10px 10px rgb(0 0 0 / 2%);
  }
}

@media screen and (max-height: 730px) {
  .board__wrap .board__num {
    div {
      height: 80px;
      width: 80px;
      margin: 6px;
    }
  }
}

@media screen and (max-height: 600px) {
  .board__wrap .board__num {
    padding: 8px;
    div {
      height: 50px;
      width: 50px;
      margin: 5px;
      font-size: 25px;
    }
  }
}

@media screen and (max-width: 600px) {
  .board__wrap .board__num {
    padding: 8px;
    div {
      height: 80px;
      width: 80px;
      margin: 8px;
    }
  }
}

@media screen and (max-width: 500px) {
  .board__wrap .board__num {
    div {
      margin: 6px;
    }
  }
}

@media screen and (max-width: 450px) {
  .board__wrap .board__num {
    div {
      height: 60px;
      width: 60px;
      margin: 5px;
      font-size: 25px;
    }
  }
}

@media screen and (max-width: 350px) {
  .board__wrap .board__num {
    div {
      height: 55px;
      width: 55px;
    }
  }
}
</style>
