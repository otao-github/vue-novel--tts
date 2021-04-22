<template>
  <div class="configurator text-center m-3">
    <div class="btn-group btn-group-sm" role="group">
      <button
        class="btn"
        :class="{ 'btn-primary': config.forceUpdate }"
        @click="toggle_config('forceUpdate')"
      >
        更新
      </button>
      <button
        class="btn"
        :class="{ 'btn-primary': config.darkMode }"
        @click="toggle_config('darkMode')"
      >
        夜间
      </button>
      <button
        class="btn"
        :class="{ 'btn-primary': config.bgColorEnable }"
        @click="toggle_config('bgColorEnable')"
      >
        背景
      </button>
      <button class="btn btn-primary" @click="set_font_size()">
        {{ config.fontSize }} px
      </button>
    </div>

    <div class="d-none d-md-inline-block">
      <input
        class="ml-3 align-middle"
        v-show="config.bgColorEnable"
        type="color"
        v-model="config.bgColor"
        @input="toggle_config('bgColor', config.bgColor)"
      />
    </div>

    <div class="d-block d-md-none">
      <div class="text-center" v-show="config.bgColorEnable">
        <input
          class="ml align-middle"
          type="range"
          min="0"
          max="360"
          step="10"
          style="width: 86px"
          v-model="h"
          @input="toggle_config('bgColor', `hsl(${h}, ${s}%, ${l}%)`)"
        />
        <input
          class="ml-3 align-middle"
          type="range"
          min="0"
          max="100"
          step="2"
          style="width: 86px"
          v-model="s"
          @input="toggle_config('bgColor', `hsl(${h}, ${s}%, ${l}%)`)"
        />
        <input
          class="ml-3 align-middle"
          type="range"
          min="0"
          max="100"
          step="2"
          style="width: 86px"
          v-model="l"
          @input="toggle_config('bgColor', `hsl(${h}, ${s}%, ${l}%)`)"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { AppConfig as config, AppController as controller } from "@/config";

export default {
  data() {
    return {
      config,
      h: 30,
      s: 85,
      l: 92,
    };
  },
  mounted() {
    this.toggle_config("bgColor", config.bgColor);
    this.toggle_config("bgColorEnable", config.bgColorEnable);
    this.toggle_config("darkMode", config.darkMode);
    this.toggle_config("fontSize", config.fontSize);
  },
  methods: {
    set_font_size() {
      var val = parseInt(prompt("font size ( 16 ~ 30 )", 16));
      if (val >= 16 && val <= 32) {
        this.toggle_config("fontSize", val);
      }
    },
    toggle_config(key, val) {
      val = val === undefined ? !config[key] : val;
      if (config[key] !== val) {
        config[key] = val;
        controller.save_config();
        console.log(key, val, config[key]);
      }

      var root = document.documentElement;
      var body = document.body;
      switch (key) {
        case "bgColor":
          root.style.setProperty("--bg-color", val);
          break;
        case "bgColorEnable":
          body.classList.toggle("custom-bg-color", val);
          break;
        case "darkMode":
          body.classList.toggle("bg-dark", val);
          break;
        case "fontSize":
          root.style.setProperty("--font-size", val + "px");
          break;
      }
    },
  },
};
</script>
<style>
:not(.sub-switch-btn-on) > .sub-switch-btn {
  display: none;
}
</style>