<template>
  <div class="audio-control text-center">
    <div
      class="btn-group btn-group-sm"
      role="group"
      :class="{
        'sub-switch-btn-on': config.speechEnable,
      }"
    >
      <button
        class="btn"
        :class="{
          'btn-primary': config.speechEnable,
          'btn-light': !config.speechEnable,
        }"
        @click="
          toggle_config('speechEnable'), !config.speechEnable && $emit('stop')
        "
      >
        朗读
      </button>

      <button
        class="btn sub-switch-btn"
        :class="{
          'btn-primary': config.autoPlay,
          'btn-light': !config.autoPlay,
        }"
        @click="toggle_config('autoPlay')"
      >
        自动
      </button>
      <button
        class="btn sub-switch-btn"
        :class="{
          'btn-primary': config.follow,
          'btn-light': !config.follow,
        }"
        @click="toggle_config('follow')"
      >
        跟随
      </button>
      <button class="btn btn-light sub-switch-btn" @click="$emit('play')">
        播放
      </button>
      <button class="btn btn-light sub-switch-btn" @click="$emit('stop')">
        停止
      </button>
      <button
        class="btn sub-switch-btn btn-primary"
        @click="set_speech_pitch()"
      >
        {{ config.speechPitch }} ph
      </button>
      <button class="btn sub-switch-btn btn-primary" @click="set_speech_rate()">
        {{ config.speechRate }} rt
      </button>
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
    };
  },
  methods: {
    set_speech_pitch() {
      var val = parseFloat(prompt("speech pitch ( 0.8 ~ 1.2 )", 0.9));
      if (val >= 0.8 && val <= 1.2) {
        this.toggle_config("speechPitch", val);
      }
    },
    set_speech_rate() {
      var val = parseFloat(prompt("speech rate ( 0.5 ~ 10 )", 1));
      if (val >= 0.5 && val <= 10) {
        this.toggle_config("speechRate", val);
      }
    },
    toggle_config(key, val) {
      val = val === undefined ? !config[key] : val;
      if (config[key] !== val) {
        config[key] = val;
        console.log(key, val, config[key]);
        controller.save_config();
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