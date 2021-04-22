<template>
  <div class="home">
    <h1 class="text-center">Home</h1>

    <div id="novel-container" class="mt-5">
      <div class="card mb-3" v-for="(novel, idx) in config.novels" :key="idx">
        <div class="card-body">
          <div class="card-title ml-2">
            <router-link
              class="h4"
              :to="`/novel/${idx}`"
            >
              {{ novel.title }}
            </router-link>
          </div>
          <div class="card-text">
            <span class="ml-2">作者: {{ novel.author }}</span>
          </div>
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn text-danger" @click="remove_novel(idx)">
              删除
            </button>
            <a
              class="btn btn-link"
              role="button"
              target="_blank"
              :href="novel.href"
              >来源</a
            >
          </div>
        </div>
      </div>

      <div class="card text-center mb-5">
        <div class="card-body">
          <div class="display-4" @click="add_novel()">+</div>
        </div>
      </div>
      <div class="row text-center">
        <div class="col">
          <button class="btn text-danger" @click="reset()">
            &gt; 清空缓存 &lt;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { AppConfig as config, AppController as controller } from "@/config";
var debug = 1;
export default {
  data() {
    return {
      config,
    };
  },
  methods: {
    add_novel() {
      var href = (
        prompt("飘天链接（https://www.ptwxz.com/html/x/xxxx/）") || ""
      ).trim();
      if (href) {
        controller.get_novel_info(href, (novel_info) => {
          config.novels.push(novel_info);
          controller.save_config()
          debug && console.log("add novel", novel_info);
        });
      }
    },
    remove_novel(i) {
      var novel = config.novels[i]
      if (confirm(`确认删除 <<${novel.title}>>?`)) {
        controller.clear_novel_cache(novel.href);
        config.novels.splice(i, 1);
        controller.save_config()
      }
      debug && console.log("remove novel");
    },
    reset() {
      if (confirm(`确认清空本地缓存?`)) {
        controller.clear_cache();
        window.location.reload();
      }
    },
  },
};
</script>